import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Apple, HeartPulse, Users, Heart, Menu, X, Mail, Phone, MapPin, MessageSquare, Home, BookOpen, Sprout, Info } from 'lucide-react';
import { Box } from "@mui/material";

import AIChat from "../../components/Home/AIChat";
import AuthModal from "../../components/Home/AuthModal";
import Footer from "../../layout/Footer";
import { 
  CompleteProfileRequest, 
  googleLogin, 
  googleCallback, 
  signOut, 
  completeProfile 
} from "../../api/accountApi";
import { getAllRecipes } from "../../api/recipeApi";
import { getAllIngredients } from "../../api/ingredientApi";
import { getAllHealthProfiles } from "../../api/healthProfileApi";
import { addFavorite } from "../../api/favoriteRecipeApi";
import { GoogleCallbackResponse } from "../../api/accountApi";
import { 
  RecipeDTO, 
  IngredientDTO, 
  HealthProfileDTO, 
  CreateFavoriteRecipeDTO 
} from "../../types/types";
import { JSX } from "react/jsx-runtime";

// Define interfaces for TypeScript
interface AppUser {
  email: string;
  token?: string;
  userId?: string;
}

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  exp: number;
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
  const [tempUserId, setTempUserId] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tempShowAIChat = localStorage.getItem("tempShowAIChat") === "true";
    if (tempShowAIChat) setShowAIChat(true);
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      if (location.pathname === "/auth/callback") {
        try {
          const data: GoogleCallbackResponse = await googleCallback();
          const { token, email, isRegistered } = data;

          if (token && email) {
            const decoded: JwtPayload = JSON.parse(atob(token.split('.')[1]));
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            if (!isRegistered) {
              localStorage.setItem("tempToken", token);
              localStorage.setItem("tempEmail", email);
              localStorage.setItem("tempUserId", userId);
              setTempUserId(userId);
              setTempEmail(email);
              setOpenAuthModal(true);
              navigate("/", { replace: true });
            } else {
              localStorage.setItem("token", token);
              localStorage.setItem("email", email);
              localStorage.setItem("userId", userId);
              setUser({ email, token, userId });
              setShowAIChat(true);
              navigate("/", { replace: true });
            }
          }
        } catch (err) {
          setError("Failed to process Google callback.");
        }
      }
    };
    handleCallback();
  }, [location, navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedEmail && storedUserId) {
      setUser({ email: storedEmail, token: storedToken, userId: storedUserId });
      setShowAIChat(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesData, ingredientsData, healthProfiles] = await Promise.all([
        getAllRecipes(),
        getAllIngredients(),
        getAllHealthProfiles(),
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
      setHealthProfile(healthProfiles[0] || null);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      setError("Failed to initiate Google login.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowAIChat(false);
      localStorage.removeItem("tempShowAIChat");
      alert("Logged out successfully!");
    } catch (err) {
      setError("Failed to sign out.");
    }
  };

  const handleCompleteProfile = async (data: CompleteProfileRequest) => {
    try {
      const response = await completeProfile(data);
      alert(response.message || "Profile completed successfully!");
      setShowAIChat(true);
      localStorage.setItem("token", localStorage.getItem("tempToken") || "");
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.userId);
      localStorage.removeItem("tempToken");
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempUserId");
      setUser({ email: data.email, token: localStorage.getItem("tempToken") || "", userId: data.userId });
      setOpenAuthModal(false);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Failed to complete profile.");
    }
  };

  const handleAddFavorite = async (recipeId: number) => {
    try {
      if (!user?.token || !user.userId) throw new Error("Please login to add favorites");
      const favoriteData: CreateFavoriteRecipeDTO = {
        userId: parseInt(user.userId),
        recipeId: recipeId,
      };
      await addFavorite(favoriteData);
      alert(`Added recipe ${recipeId} to favorites!`);
    } catch (err) {
      alert("Failed to add favorite.");
    }
  };

  const handleToggleAIChatTemporarily = () => {
    const shouldShow = !showAIChat;
    setShowAIChat(shouldShow);
    localStorage.setItem("tempShowAIChat", shouldShow.toString());
  };

  const features: Feature[] = [
    { title: "Diverse Menu", description: `Over ${recipes.length}+ healthy recipes`, icon: <ChefHat style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Nutrition Advice", description: "Expert nutritionists at your service", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Health Tracking", description: `Track your stats (Weight: ${healthProfile?.weight || "N/A"}kg)`, icon: <HeartPulse style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
    { title: "Community", description: "Connect with a health-focused community", icon: <Users style={{ height: "48px", width: "48px", color: "#3B82F6" }} /> },
  ];

  // Menu data with icons
  const menuItems = [
    { label: "Home", icon: <Home style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Recipes", icon: <BookOpen style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "Ingredients", icon: <Sprout style={{ height: "18px", width: "18px", color: "inherit" }} /> },
    { label: "About Us", icon: <Info style={{ height: "18px", width: "18px", color: "inherit" }} /> },
  ];

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontSize: "18px", color: "#333" }}>Loading...</div>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* AI Chat Floating Window */}
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
            border: "1px solid #DBEAFE"
          }}
        >
          <AIChat />
        </motion.div>
      )}

      {/* Error Alert */}
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
            justifyContent: "center"
          }}
        >
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#DC2626",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            maxWidth: "320px"
          }}>
            {error}
          </div>
        </motion.div>
      )}

      {/* Header/Navbar */}
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
          width: "100%"
        }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <HeartPulse style={{ height: "28px", width: "28px", color: "#3B82F6" }} />
            <span style={{ fontWeight: "700", fontSize: "26px", color: "#1F2937" }}>NutriWise</span>
          </motion.div>

          {/* Desktop Menu */}
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
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* AI Chat Button on Desktop */}
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
              {showAIChat ? "Hide AI Chat" : "Show AI Chat"}
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
                  {user.email?.[0].toUpperCase()}
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
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "none",
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
                Login
              </motion.button>
            )}

            {/* Menu Button on Mobile */}
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

      {/* Mobile Menu */}
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
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
            {/* AI Chat Button on Mobile */}
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
              {showAIChat ? "Hide AI Chat" : "Show AI Chat"}
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
                Logout
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
                Login
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
        userId={tempUserId}
        email={tempEmail}
      />

      {/* Hero Section */}
      <section style={{
        position: "relative",
        padding: "96px 0",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(to right, #3B82F6, rgba(59, 130, 246, 0.2))",
        color: "#FFFFFF"
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
          opacity: 0.2
        }} />
        <div style={{
          margin: "0 auto",
          textAlign: "center",
          padding: "0 16px",
          maxWidth: "1280px",
          position: "relative",
          zIndex: 10
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              marginBottom: "24px",
              letterSpacing: "-0.5px"
            }}
          >
            Live Healthier Every Day with NutriWise
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
              marginRight: "auto"
            }}
          >
            Smart nutrition solutions for a healthier lifestyle
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: "flex", justifyContent: "center", gap: "20px" }} // Tăng khoảng cách giữa 2 nút
          >
            {/* Nút Get Started */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 28px", // Tăng padding để nút rộng rãi hơn
                background: "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)", // Gradient nhẹ cho nút
                color: "#3B82F6",
                borderRadius: "12px", // Bo tròn mềm mại hơn
                fontFamily: "'Poppins', sans-serif", // Đồng bộ font
                fontSize: "18px", // Tăng kích thước chữ
                fontWeight: "600", // Tăng độ đậm
                letterSpacing: "0.5px", // Thêm khoảng cách chữ
                cursor: "pointer",
                transition: "all 0.3s ease", // Hiệu ứng mượt mà
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ
                display: "flex",
                alignItems: "center",
                gap: "8px", // Khoảng cách giữa chữ và biểu tượng
                border: "none"
              }}
              onClick={handleGoogleLogin}
              onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #F3F4F6 0%, #FFFFFF 100%)")} // Đổi hướng gradient khi hover
              onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #FFFFFF 0%, #F3F4F6 100%)")}
            >
              Get Started
              <ArrowRight style={{ height: "22px", width: "22px" }} /> {/* Tăng kích thước biểu tượng */}
            </motion.button>

            {/* Nút Learn More */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 28px", // Tăng padding để nút rộng rãi hơn
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255, 255, 255, 0.8)", // Viền trắng nhẹ
                borderRadius: "12px", // Bo tròn mềm mại hơn
                fontFamily: "'Poppins', sans-serif", // Đồng bộ font
                fontSize: "18px", // Tăng kích thước chữ
                fontWeight: "600", // Tăng độ đậm
                letterSpacing: "0.5px", // Thêm khoảng cách chữ
                cursor: "pointer",
                transition: "all 0.3s ease", // Hiệu ứng mượt mà
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" // Thêm bóng đổ
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"; // Hiệu ứng hover sáng nhẹ
                e.currentTarget.style.border = "2px solid #FFFFFF"; // Viền trắng đậm hơn
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.border = "2px solid rgba(255, 255, 255, 0.8)";
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              color: "#1F2937"
            }}
          >
            Key Features
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
                  border: "2px solid #DBEAFE"
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

      {/* Popular Ingredients Section */}
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
              gap: "8px"
            }}
          >
            <Apple style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Popular Ingredients
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
                key={index}
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
                    alt={ingredient.name ? `Ingredient: ${ingredient.name}` : `Ingredient ${index + 1}`}
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
                    {ingredient.name || "No Name"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ingredient.description || "No Description"}
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
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                  >
                    View Details
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
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                View More <ArrowRight style={{ display: "inline-block", marginLeft: "8px", height: "20px", width: "20px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Recipes Section */}
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
              gap: "8px"
            }}
          >
            <ChefHat style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Featured Recipes
          </motion.h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 6).map((recipe, index) => (
              <motion.div
                key={index}
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
                  border: "2px solid #DBEAFE"
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)")}
              >
                <img
                  src="https://images.unsplash.com/photo-1504672281656-e4981d704151?q=80&w=2070&auto=format&fit=crop"
                  alt={recipe.name ? `Recipe: ${recipe.name}` : `Recipe ${index + 1}`}
                  style={{ width: "100%", height: "192px", objectFit: "cover" }}
                />
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937" }}>{recipe.name || "No Name"}</h3>
                    <button
                      onClick={() => handleAddFavorite(recipe.recipeId)}
                      disabled={!user}
                      style={{
                        color: "#6B7280",
                        transition: "color 0.3s",
                        cursor: user ? "pointer" : "not-allowed"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = user ? "#3B82F6" : "#6B7280")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
                    >
                      <Heart style={{ height: "20px", width: "20px" }} />
                    </button>
                  </div>
                  <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "16px" }}>{recipe.description || "No Description"}</p>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                  >
                    View Details
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
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
              >
                View More <ArrowRight style={{ display: "inline-block", marginLeft: "8px", height: "20px", width: "20px" }} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Health Profile Section */}
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
              gap: "8px"
            }}
          >
            <HeartPulse style={{ height: "32px", width: "32px", color: "#3B82F6" }} /> Health Information
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
              border: "2px solid #DBEAFE"
            }}
          >
            {healthProfile ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="sm:grid-cols-2">
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Full Name</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.fullName || "N/A"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Gender</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.gender || "N/A"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Height</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.height || "N/A"} cm</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>Weight</p>
                  <p style={{ fontWeight: "500", color: "#1F2937" }}>{healthProfile.weight || "N/A"} kg</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6B7280", marginBottom: "16px" }}>Please login to view your health information.</p>
                <button
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={handleGoogleLogin}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3B82F6")}
                >
                  Login Now
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;