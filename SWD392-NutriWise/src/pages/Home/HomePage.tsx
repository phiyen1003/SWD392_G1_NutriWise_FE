import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Apple, HeartPulse, Users, Heart, Menu, X, MessageSquare, Home, BookOpen, Sprout, Info } from 'lucide-react';
import { Box, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { CompleteProfileRequest, firebaseLogin, signOut, updateProfile } from "../../api/accountApi";
import { getAllRecipes } from "../../api/recipeApi";
import { getAllIngredients } from "../../api/ingredientApi";
import { getAllHealthProfiles } from "../../api/healthProfileApi";
import { addFavorite } from "../../api/favoriteRecipeApi";
import { RecipeDTO, IngredientDTO, HealthProfileDTO, CreateFavoriteRecipeDTO } from "../../types/types";
import { JSX } from "react/jsx-runtime";
import AIChat from "../../components/Home/AIChat";
import AuthModal from "../../components/Home/AuthModal";
import Footer from "../../layout/Footer";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

interface AppUser {
  email: string | null;
  token: string;
  userId: string;
}

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

const HomePage: React.FC = () => {
  const [showAIChat, setShowAIChat] = useState<boolean>(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfileDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openLoginPrompt, setOpenLoginPrompt] = useState<boolean>(false);
  const navigate = useNavigate();

  const restoreUserState = useCallback(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    const tempShowAIChat = localStorage.getItem("tempShowAIChat") === "true";

    if (storedToken && storedEmail && storedUserId) {
      setUser({ email: storedEmail, token: storedToken, userId: storedUserId });
      setShowAIChat(true);
    } else if (tempShowAIChat) {
      setShowAIChat(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [recipesData, ingredientsData, healthProfiles] = await Promise.all([
        getAllRecipes(),
        getAllIngredients(),
        getAllHealthProfiles(),
      ]);
      setRecipes(Array.isArray(recipesData?.data) ? recipesData.data : []);
      setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
      setHealthProfile(Array.isArray(healthProfiles) && healthProfiles.length > 0 ? healthProfiles[0] : null);
    } catch (err) {
      setError("Không thể tải dữ liệu ban đầu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        currentUser.getIdToken().then((idToken) => {
          const newUser = {
            email: currentUser.email || null,
            token: idToken,
            userId: currentUser.uid,
          };
          setUser(newUser);
          localStorage.setItem("token", idToken);
          localStorage.setItem("email", currentUser.email || "");
          localStorage.setItem("userId", currentUser.uid);
          setShowAIChat(true);
          // if (!healthProfile) {
          //   setOpenAuthModal(true);
          // }
        });
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        setShowAIChat(false);
      }
    });

    return () => unsubscribe();
  }, [healthProfile]);

  useEffect(() => {
    restoreUserState();
    fetchData();

    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [restoreUserState, fetchData, error]);

  const handleGoogleLoginPrompt = () => {
    setOpenLoginPrompt(true);
  };

  const handleLogin = async () => {
    try {
      setError(null);
      const response = await firebaseLogin();
      setUser({ email: response.email || null, token: response.token, userId: response.userId });
      setOpenLoginPrompt(false);

      // Kiểm tra roleId và redirect
      if (response.roleID === 1) {
        navigate("/nutriwise/dashboard");
      } else {
        navigate("/"); // Giữ nguyên homepage nếu roleId không phải "1"
      }

      // if (!healthProfile) {
      //   setOpenAuthModal(true); // Mở modal nhập profile nếu chưa có
      // }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể đăng nhập bằng Google";
      setError(errorMessage);
      console.error("Lỗi đăng nhập Google:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowAIChat(false);
      setError(null);
      navigate("/");
      alert("Đăng xuất thành công!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng xuất");
    }
  };

  const handleCompleteProfile = async (data: CompleteProfileRequest) => {
    try {
      const response = await updateProfile(
        {
          fullName: data.fullName,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          height: data.height,
          weight: data.weight,
          allergenId: data.allergenId,
          healthGoalId: data.healthGoalId,
          bmi: data.bmi,
          bloodPressure: data.bloodPressure,
          cholesterol: data.cholesterol,
        },
        data.userId
      );
      setUser({ email: data.email || null, token: localStorage.getItem("token") || "", userId: data.userId });
      setShowAIChat(true);
      // setOpenAuthModal(false);
      setError(null);
      alert(response.message || "Hồ sơ đã được cập nhật thành công!");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật hồ sơ");
    }
  };

  const handleAddFavorite = async (recipeId: number) => {
    if (!user?.token || !user.userId) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      return;
    }
    try {
      const favoriteData: CreateFavoriteRecipeDTO = {
        userId: parseInt(user.userId),
        recipeId,
      };
      await addFavorite(favoriteData);
      alert(`Đã thêm công thức ${recipeId} vào danh sách yêu thích!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể thêm vào danh sách yêu thích");
    }
  };

  const handleToggleAIChatTemporarily = () => {
    const shouldShow = !showAIChat;
    setShowAIChat(shouldShow);
    localStorage.setItem("tempShowAIChat", shouldShow.toString());
  };

  const features: Feature[] = [
    { title: "Thực Đơn Đa Dạng", description: `Hơn ${recipes.length} công thức lành mạnh`, icon: <ChefHat style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Tư Vấn Dinh Dưỡng", description: "Chuyên gia hỗ trợ bạn", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Theo Dõi Sức Khỏe", description: `Cân nặng: ${healthProfile?.weight || "Chưa có"}kg`, icon: <HeartPulse style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Cộng Đồng", description: "Kết nối yêu sức khỏe", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
  ];

  const menuItems = [
    { label: "Trang Chủ", icon: <Home style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Công Thức", icon: <BookOpen style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Nguyên Liệu", icon: <Sprout style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Giới Thiệu", icon: <Info style={{ height: "18px", width: "18px", color: "inherit" }} /> },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {showAIChat && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            height: "550px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            overflow: "hidden",
            border: "1px solid #DBEAFE",
          }}
        >
          <AIChat />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "fixed",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
        >
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#DC2626",
            padding: "12px 20px",
            borderRadius: "6px",
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
            maxWidth: "300px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
            >
              X
            </button>
          </div>
        </motion.div>
      )}

      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 40,
        borderBottom: "1px solid #DBEAFE",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          maxWidth: "1200px",
        }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <HeartPulse style={{ height: "24px", width: "24px", color: "#3B82F6" }} />
            <span style={{ fontWeight: "700", fontSize: "22px", color: "#1F2937" }}>NutriWise</span>
          </motion.div>

          <nav style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden md:flex">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05, backgroundColor: "#E0F2FE" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#374151",
                  fontWeight: "500",
                  fontSize: "15px",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/${item.label.toLowerCase().replace(" ", "-")}`)}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: showAIChat ? "#DC2626" : "#2563EB" }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: showAIChat ? "#EF4444" : "#3B82F6",
                color: "#FFFFFF",
                borderRadius: "16px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleToggleAIChatTemporarily}
              className="md:flex hidden"
            >
              <MessageSquare style={{ height: "14px", width: "14px" }} />
              {showAIChat ? "Ẩn Chat AI" : "Hiện Chat AI"}
            </motion.button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    height: "36px",
                    width: "36px",
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "500",
                    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#DC2626" }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleLogout}
                >
                  Đăng Xuất
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "16px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleGoogleLoginPrompt}
                className="md:flex hidden"
              >
                Đăng Nhập
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: "6px", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu style={{ height: "20px", width: "20px", color: "#374151" }} />
            </motion.button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "250px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
            boxShadow: "-3px 0 5px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            padding: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
          className="md:hidden"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <HeartPulse style={{ height: "20px", width: "20px", color: "#3B82F6" }} />
              <span style={{ fontWeight: "700", fontSize: "18px", color: "#1F2937" }}>NutriWise</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X style={{ height: "20px", width: "20px", color: "#374151" }} />
            </motion.button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02, backgroundColor: "#E0F2FE" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#374151",
                  fontWeight: "500",
                  fontSize: "15px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/${item.label.toLowerCase().replace(" ", "-")}`);
                  setMobileMenuOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: showAIChat ? "#DC2626" : "#2563EB" }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                backgroundColor: showAIChat ? "#EF4444" : "#3B82F6",
                color: "#FFFFFF",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleToggleAIChatTemporarily}
            >
              <MessageSquare style={{ height: "16px", width: "16px" }} />
              {showAIChat ? "Ẩn Chat AI" : "Hiện Chat AI"}
            </motion.button>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#DC2626" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleLogout}
              >
                Đăng Xuất
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleGoogleLoginPrompt}
              >
                Đăng Nhập
              </motion.button>
            )}
          </nav>
        </motion.div>
      )}

      {/* <AuthModal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        onCompleteProfile={handleCompleteProfile}
        isNewUser={true}
        userId={user?.userId || ""}
        email={user?.email || ""}
      /> */}

      <Dialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)}>
        <DialogTitle>Đăng Nhập Với Google</DialogTitle>
        <DialogContent>
          <p>Vui lòng đăng nhập bằng tài khoản Google để tiếp tục:</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">Đăng Nhập</Button>
          <Button onClick={() => setOpenLoginPrompt(false)} color="secondary">Hủy</Button>
        </DialogActions>
      </Dialog>

      <section style={{
        position: "relative",
        padding: "80px 0",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(to right, #3B82F6, rgba(59, 130, 246, 0.2))",
        color: "#FFFFFF",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }} />
        <div style={{
          margin: "0 auto",
          textAlign: "center",
          padding: "0 15px",
          maxWidth: "1200px",
          position: "relative",
          zIndex: 10,
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "20px" }}
          >
            Sống Khỏe Mỗi Ngày Với NutriWise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: "16px", marginBottom: "25px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}
          >
            Giải pháp dinh dưỡng thông minh cho cuộc sống lành mạnh
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)",
                color: "#3B82F6",
                borderRadius: "10px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "none",
              }}
              onClick={handleGoogleLoginPrompt}
              onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #F3F4F6 0%, #FFFFFF 100%)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)")}
            >
              Bắt Đầu
              <ArrowRight style={{ height: "20px", width: "20px" }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "12px 24px",
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => navigate("/gioi-thieu")}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.border = "2px solid #FFFFFF";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.border = "2px solid rgba(255, 255, 255, 0.8)";
              }}
            >
              Tìm Hiểu Thêm
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "70px 0", backgroundColor: "#FFFFFF" }}>
        <div style={{ margin: "0 auto", padding: "0 15px", maxWidth: "1200px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "32px", fontWeight: "bold", textAlign: "center", marginBottom: "40px", color: "#1F2937" }}
          >
            Tính Năng Nổi Bật
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                style={{
                  padding: "20px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s",
                  border: "2px solid #DBEAFE",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.1)")}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px", textAlign: "center", color: "#1F2937" }}>{feature.title}</h3>
                <p style={{ textAlign: "center", color: "#6B7280", fontSize: "14px" }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "70px 0", backgroundColor: "#EFF6FF" }}>
        <div style={{ margin: "0 auto", padding: "0 15px", maxWidth: "1200px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "30px",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Apple style={{ height: "28px", width: "28px", color: "#3B82F6" }} /> Nguyên Liệu Phổ Biến
          </motion.h2>
          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "12px",
            padding: "12px 0",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "#3B82F6 #DBEAFE",
          }}>
            {ingredients.slice(0, 6).map((ingredient, index) => (
              <motion.div
                key={ingredient.ingredientId}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                style={{
                  flex: "0 0 220px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  border: "2px solid #DBEAFE",
                }}
              >
                <div style={{ position: "relative", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                    alt={ingredient.name || `Nguyên liệu ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #3B82F6",
                      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
                <div style={{ padding: "12px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1F2937", marginBottom: "6px" }}>
                    {ingredient.name || "Không có tên"}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ingredient.description || "Không có mô tả"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      width: "100%",
                    }}
                    onClick={() => navigate(`/nguyen-lieu/${ingredient.ingredientId}`)}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                  >
                    Xem Chi Tiết
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          {ingredients.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate("/nguyen-lieu")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                Xem Thêm <ArrowRight style={{ display: "inline-block", marginLeft: "6px", height: "18px", width: "18px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section style={{ padding: "70px 0", backgroundColor: "#FFFFFF" }}>
        <div style={{ margin: "0 auto", padding: "0 15px", maxWidth: "1200px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "40px",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <ChefHat style={{ height: "28px", width: "28px", color: "#3B82F6" }} /> Công Thức Nổi Bật
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }} className="sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 6).map((recipe, index) => (
              <motion.div
                key={recipe.recipeId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s",
                  border: "2px solid #DBEAFE",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.1)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.1)")}
              >
                <img
                  src="https://images.unsplash.com/photo-1504672281656-e4981d704151?q=80&w=2070&auto=format&fit=crop"
                  alt={recipe.name || `Công thức ${index + 1}`}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1F2937" }}>{recipe.name || "Không có tên"}</h3>
                    <button
                      onClick={() => handleAddFavorite(recipe.recipeId)}
                      disabled={!user}
                      style={{
                        color: "#6B7280",
                        transition: "color 0.3s",
                        cursor: user ? "pointer" : "not-allowed",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = user ? "#3B82F6" : "#6B7280")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
                    >
                      <Heart style={{ height: "18px", width: "18px" }} />
                    </button>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>{recipe.description || "Không có mô tả"}</p>
                  <button
                    style={{
                      width: "100%",
                      padding: "6px 12px",
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => navigate(`/cong-thuc/${recipe.recipeId}`)}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {recipes.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate("/cong-thuc")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                Xem Thêm <ArrowRight style={{ display: "inline-block", marginLeft: "6px", height: "18px", width: "18px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </Box>
  );
};

export default HomePage;