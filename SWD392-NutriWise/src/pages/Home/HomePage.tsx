// src/HomePage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Apple, HeartPulse, Users, Heart, Menu, X, MessageSquare, Home, BookOpen, Sprout, Info } from 'lucide-react';
import { Box, CircularProgress } from "@mui/material";
import { CompleteProfileRequest, firebaseLogin, signOut, updateProfile } from "../../api/accountApi"; // Cập nhật import
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
  email: string;
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
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Theo dõi trạng thái đăng nhập bằng Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        currentUser.getIdToken().then((idToken) => {
          setUser({
            email: currentUser.email || "",
            token: idToken,
            userId: currentUser.uid,
          });
          localStorage.setItem("token", idToken);
          localStorage.setItem("email", currentUser.email || "");
          localStorage.setItem("userId", currentUser.uid);
          setShowAIChat(true);
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
  }, []);

  useEffect(() => {
    restoreUserState();
    fetchData();

    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [restoreUserState, fetchData, error]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const response = await firebaseLogin();
      console.log("Phản hồi từ backend:", response);
  
      if (!response.profileComplete) {
        setOpenAuthModal(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể đăng nhập bằng Google";
      setError(errorMessage);
      console.error("Lỗi đăng nhập Google:", err);
    }
  };
  
  if (error) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={handleGoogleLogin}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
      </Box>
    );
  }
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
      const response = await updateProfile(data);
      setUser({ email: data.email || "", token: localStorage.getItem("token") || "", userId: data.userId });
      setShowAIChat(true);
      setOpenAuthModal(false);
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
    { title: "Diverse Menu", description: `Hơn ${recipes.length}+ công thức lành mạnh`, icon: <ChefHat style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Nutrition Advice", description: "Chuyên gia dinh dưỡng hỗ trợ bạn", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Health Tracking", description: `Theo dõi số liệu (Cân nặng: ${healthProfile?.weight || "N/A"}kg)`, icon: <HeartPulse style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Community", description: "Kết nối với cộng đồng yêu sức khỏe", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
  ];

  const menuItems = [
    { label: "Home", icon: <Home style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Recipes", icon: <BookOpen style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Ingredients", icon: <Sprout style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "About Us", icon: <Info style={{ height: "18px", width: "18px", color: "inherit" }} /> },
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
            bottom: "24px",
            right: "24px",
            width: "384px",
            height: "600px",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#DC2626",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            maxWidth: "320px",
          }}>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ marginLeft: "10px", color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
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
        height: "72px",
        background: "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          padding: "0 24px",
          maxWidth: "1280px",
          width: "100%",
        }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <HeartPulse style={{ height: "28px", width: "28px", color: "#3B82F6" }} />
            <span style={{ fontWeight: "700", fontSize: "26px", color: "#1F2937" }}>NutriWise</span>
          </motion.div>

          <nav style={{ display: "flex", alignItems: "center", gap: "16px" }} className="hidden md:flex">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.05, backgroundColor: "#E0F2FE" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#374151",
                  fontWeight: "500",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  padding: "8px 16px",
                  borderRadius: "20px",
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: showAIChat ? "#DC2626" : "#2563EB" }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: showAIChat ? "#EF4444" : "#3B82F6",
                color: "#FFFFFF",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleToggleAIChatTemporarily}
              className="md:flex hidden"
            >
              <MessageSquare style={{ height: "16px", width: "16px" }} />
              {showAIChat ? "Ẩn AI Chat" : "Hiện AI Chat"}
            </motion.button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    height: "40px",
                    width: "40px",
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "500",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {user.email[0].toUpperCase()}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#DC2626" }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleGoogleLogin}
                className="md:flex hidden"
              >
                Đăng nhập
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu style={{ height: "24px", width: "24px", color: "#374151" }} />
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
            width: "280px",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
            boxShadow: "-4px 0 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            padding: "24px",
            fontFamily: "'Poppins', sans-serif",
          }}
          className="md:hidden"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <HeartPulse style={{ height: "24px", width: "24px", color: "#3B82F6" }} />
              <span style={{ fontWeight: "700", fontSize: "20px", color: "#1F2937" }}>NutriWise</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X style={{ height: "24px", width: "24px", color: "#374151" }} />
            </motion.button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                  gap: "12px",
                  color: "#374151",
                  fontWeight: "500",
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  padding: "12px 16px",
                  borderRadius: "12px",
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
                gap: "12px",
                padding: "12px 16px",
                backgroundColor: showAIChat ? "#EF4444" : "#3B82F6",
                color: "#FFFFFF",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleToggleAIChatTemporarily}
            >
              <MessageSquare style={{ height: "18px", width: "18px" }} />
              {showAIChat ? "Ẩn AI Chat" : "Hiện AI Chat"}
            </motion.button>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#DC2626" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleLogout}
              >
                Đăng xuất
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleGoogleLogin}
              >
                Đăng nhập
              </motion.button>
            )}
          </nav>
        </motion.div>
      )}

      <AuthModal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        onCompleteProfile={handleCompleteProfile}
        isNewUser={true}
        userId={localStorage.getItem("tempUserId") || ""}
        email={localStorage.getItem("tempEmail") || ""}
      />

      <section style={{
        position: "relative",
        padding: "96px 0",
        minHeight: "90vh",
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
          padding: "0 16px",
          maxWidth: "1280px",
          position: "relative",
          zIndex: 10,
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "24px",
              letterSpacing: "-0.5px",
            }}
          >
            Sống Khỏe Mỗi Ngày với NutriWise
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "18px",
              marginBottom: "32px",
              maxWidth: "720px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Giải pháp dinh dưỡng thông minh cho lối sống lành mạnh
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 28px",
                background: "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)",
                color: "#3B82F6",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
              }}
              onClick={handleGoogleLogin}
              onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #F3F4F6 0%, #FFFFFF 100%)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)")}
            >
              Bắt Đầu
              <ArrowRight style={{ height: "22px", width: "22px" }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 28px",
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "12px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => navigate("/about-us")}
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

      <section style={{ padding: "80px 0", backgroundColor: "#FFFFFF" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1280px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "48px",
              color: "#1F2937",
            }}
          >
            Tính Năng Nổi Bật
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                style={{
                  padding: "24px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0.3s",
                  border: "2px solid #DBEAFE",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)")}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", textAlign: "center", color: "#1F2937" }}>{feature.title}</h3>
                <p style={{ textAlign: "center", color: "#6B7280" }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", backgroundColor: "#EFF6FF" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1280px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "32px",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Apple style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Nguyên Liệu Phổ Biến
          </motion.h2>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "16px",
              padding: "16px 0",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#3B82F6 #DBEAFE",
            }}
          >
            {ingredients.slice(0, 6).map((ingredient, index) => (
              <motion.div
                key={ingredient.ingredientId}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.15)" }}
                style={{
                  flex: "0 0 240px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  border: "2px solid #DBEAFE",
                }}
              >
                <div style={{ position: "relative", display: "flex", justifyContent: "center", paddingTop: "24px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                    alt={ingredient.name || `Nguyên liệu ${index + 1}`}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "3px solid #3B82F6",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", marginBottom: "8px" }}>
                    {ingredient.name || "Không có tên"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ingredient.description || "Không có mô tả"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      width: "100%",
                    }}
                    onClick={() => navigate(`/ingredients/${ingredient.ingredientId}`)}
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
              style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate("/ingredients")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                Xem Thêm <ArrowRight style={{ display: "inline-block", marginLeft: "8px", height: "20px", width: "20px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section style={{ padding: "80px 0", backgroundColor: "#FFFFFF" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1280px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "48px",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <ChefHat style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Công Thức Nổi Bật
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 6).map((recipe, index) => (
              <motion.div
                key={recipe.recipeId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s",
                  border: "2px solid #DBEAFE",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)")}
              >
                <img
                  src="https://images.unsplash.com/photo-1504672281656-e4981d704151?q=80&w=2070&auto=format&fit=crop"
                  alt={recipe.name || `Công thức ${index + 1}`}
                  style={{ width: "100%", height: "192px", objectFit: "cover" }}
                />
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937" }}>{recipe.name || "Không có tên"}</h3>
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
                      <Heart style={{ height: "20px", width: "20px" }} />
                    </button>
                  </div>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "16px" }}>{recipe.description || "Không có mô tả"}</p>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
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
              style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}
            >
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => navigate("/recipes")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                Xem Thêm <ArrowRight style={{ display: "inline-block", marginLeft: "8px", height: "20px", width: "20px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section style={{ padding: "80px 0", backgroundColor: "#EFF6FF" }}>
        <div style={{ margin: "0 auto", padding: "0 16px", maxWidth: "1280px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "48px",
              color: "#1F2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <HeartPulse style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Thông Tin Sức Khỏe
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              border: "2px solid #DBEAFE",
            }}
          >
            {healthProfile ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="sm:grid-cols-2">
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Họ Tên</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.fullName || "N/A"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Giới Tính</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.gender || "N/A"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Chiều Cao</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.height || "N/A"} cm</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Cân Nặng</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.weight || "N/A"} kg</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6B7280", marginBottom: "16px" }}>Vui lòng đăng nhập để xem thông tin sức khỏe của bạn.</p>
                <button
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleGoogleLogin}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                >
                  Đăng Nhập Ngay
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </Box>
  );
};

export default HomePage;