import { Box, Container, Grid, Typography, Button, AppBar, Toolbar, Avatar } from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Copyright,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  LocalDining as LocalDiningIcon,
  Healing as HealingIcon,
  RestaurantMenu as RestaurantMenuIcon,
} from "@mui/icons-material";
import {
  Paper,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
} from "@mui/material";
import AIChat from "../../components/Home/AIChat";
import { useState, useEffect } from "react";
import AuthModal from "../../components/Home/AuthModal";
import { motion } from "framer-motion";
import { CompleteProfileRequest, googleLogin, googleCallback, signOut, completeProfile } from "../../api/accountApi";
import { getAllRecipes,  } from "../../api/recipeApi";
import { getAllIngredients,  } from "../../api/ingredientApi";
import { getAllHealthProfiles,  } from "../../api/healthProfileApi";
import { addFavorite,  } from "../../api/favoriteRecipeApi";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleCallbackResponse } from "../../api/accountApi";
import { RecipeDTO, IngredientDTO, HealthProfileDTO, CreateFavoriteRecipeDTO} from "../../types/types";
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

const HomePage = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfileDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [tempUserId, setTempUserId] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  // Xử lý callback từ Google OAuth
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
              // Đăng nhập thành công, lưu thông tin và redirect về trang chủ
              localStorage.setItem("token", token);
              localStorage.setItem("email", email);
              localStorage.setItem("userId", userId);
              setUser({ email, token, userId });
              setShowAIChat(true); // Bật AIChat
              navigate("/", { replace: true }); // Đảm bảo redirect
              // Force re-render to update UI
              setTimeout(() => {
                window.location.reload(); // Tạm thời reload để đảm bảo UI cập nhật
              }, 100);
            }
          } else {
            setError("No token or email in callback response.");
          }
        } catch (err) {
          setError("Failed to process Google callback: " + (err instanceof Error ? err.message : "Unknown error"));
          console.error("Callback error details:", err);
        }
      }
    };

    handleCallback();
  }, [location, navigate]);

  // Kiểm tra user đã đăng nhập chưa
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
      setError(null);
      const [recipesData, ingredientsData, healthProfiles] = await Promise.all([
        getAllRecipes(),
        getAllIngredients(),
        getAllHealthProfiles(),
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
      setHealthProfile(healthProfiles[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      setError("Failed to initiate Google login: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowAIChat(false);
      alert("Đăng xuất thành công!");
    } catch (err) {
      setError("Failed to sign out: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleCompleteProfile = async (data: CompleteProfileRequest) => {
    try {
      if (!data.userId || !data.fullName || !data.email) {
        throw new Error("Missing required fields in profile data");
      }
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
      navigate("/", { replace: true }); // Redirect về trang chủ sau khi hoàn tất profile
      setTimeout(() => {
        window.location.reload(); // Tạm thời reload để đảm bảo UI cập nhật
      }, 100);
    } catch (err) {
      setError("Failed to complete profile: " + (err instanceof Error ? err.message : "Unknown error"));
      console.error(err);
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
      alert("Failed to add favorite: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const features = [
    {
      title: "Thực đơn đa dạng",
      description: `Hơn ${recipes.length}+ công thức nấu ăn lành mạnh`,
      icon: <MenuBookIcon sx={{ fontSize: 40 }} color="primary" />,
    },
    {
      title: "Tư vấn dinh dưỡng",
      description: "Đội ngũ chuyên gia dinh dưỡng hàng đầu",
      icon: <PeopleIcon sx={{ fontSize: 40 }} color="secondary" />,
    },
    {
      title: "Theo dõi sức khỏe",
      description: `Theo dõi chỉ số (Cân nặng: ${healthProfile?.weight || "N/A"}kg)`,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} color="success" />,
    },
    {
      title: "Cộng đồng",
      description: "Kết nối với cộng đồng người yêu sức khỏe",
      icon: <PeopleIcon sx={{ fontSize: 40 }} color="warning" />,
    },
  ];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return (
    <Box sx={{ position: "fixed", top: 80, width: "100%", zIndex: 1000, textAlign: "center" }}>
      <Typography color="error" variant="body1" sx={{ bgcolor: "rgba(255, 0, 0, 0.1)", p: 2 }}>
        {error}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {user && showAIChat && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: 400,
            height: 540,
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            transform: showAIChat ? "scale(1)" : "scale(0.95)",
            opacity: showAIChat ? 1 : 0,
          }}
        >
          <AIChat />
        </Box>
      )}

      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.1)", px: 2 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            NutriWise
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                {user.email?.[0].toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {user.email}
              </Typography>
              <Button
                color="error"
                variant="outlined"
                onClick={handleLogout}
                sx={{ borderColor: "white", color: "white", "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" } }}
              >
                Đăng xuất
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="info" onClick={handleGoogleLogin} sx={{ fontWeight: "bold" }}>
              Đăng nhập
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <AuthModal
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        onCompleteProfile={handleCompleteProfile}
        isNewUser={true}
        userId={tempUserId}
        email={tempEmail}
      />

      {error && (
        <Box sx={{ position: "fixed", top: 80, width: "100%", zIndex: 1000, textAlign: "center" }}>
          <Typography color="error" variant="body1" sx={{ bgcolor: "rgba(255, 0, 0, 0.1)", p: 2 }}>
            {error}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          p: 0,
          m: -1,
          position: "relative",
          top: 0,
          left: 0,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, mb: 3, display: "flex", gap: 1, justifyContent: "center" }}
            >
              {"Sống Khỏe Mỗi Ngày Cùng NutriWise".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.5, duration: 2 }}
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              ))}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Giải pháp dinh dưỡng thông minh giúp bạn có một lối sống lành mạnh
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          >
            <Button variant="contained" size="large" sx={{ mr: 2 }} onClick={handleGoogleLogin}>
              Bắt đầu ngay
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          Tính năng nổi bật
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Ingredients Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: "#f5f5f5" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <LocalDiningIcon sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Nguyên liệu phổ biến
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {loading ? (
            <Typography>Loading ingredients...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    bgcolor: "#fff3e0",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {ingredient.name || `Ingredient ${index + 1}`}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {ingredient.description || "No description available"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No ingredients available</Typography>
          )}
        </Grid>
      </Container>

      {/* Featured Recipes Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <RestaurantMenuIcon sx={{ fontSize: 40, color: "#ff9800", mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Công thức nổi bật
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {loading ? (
            <Typography>Loading recipes...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    bgcolor: "#e0f7fa",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {recipe.name || `Recipe ${index + 1}`}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {recipe.description || "No description available"}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FavoriteIcon />}
                      onClick={() => handleAddFavorite(recipe.recipeId)}
                      disabled={!user}
                      fullWidth
                    >
                      Thêm vào yêu thích
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No recipes available</Typography>
          )}
        </Grid>
      </Container>

      {/* Health Profile Section */}
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: "#f5f5f5" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <HealingIcon sx={{ fontSize: 40, color: "#2196f3", mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Thông tin sức khỏe của bạn
          </Typography>
        </Box>
        {loading ? (
          <Typography>Loading health profile...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : healthProfile ? (
          <Card
            sx={{
              p: 4,
              borderRadius: 8,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              maxWidth: 600,
              mx: "auto",
              bgcolor: "#eceff1",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Hồ sơ sức khỏe
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Health Profile ID: ${healthProfile.healthProfileId}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Full Name: ${healthProfile.fullName || "N/A"}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Gender: ${healthProfile.gender || "N/A"}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Height: ${healthProfile.height || "N/A"} cm`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Weight: ${healthProfile.weight || "N/A"} kg`} />
              </ListItem>
            </List>
          </Card>
        ) : (
          <Typography color="text.secondary">No health profile available. Please login to view.</Typography>
        )}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "white",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
                  NutriWise
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Giải pháp dinh dưỡng thông minh cho cuộc sống khỏe mạnh của bạn.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "#1877f2",
                    "&:hover": { backgroundColor: "rgba(24, 119, 242, 0.04)" },
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "#1da1f2",
                    "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.04)" },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "#0a66c2",
                    "&:hover": { backgroundColor: "rgba(10, 102, 194, 0.04)" },
                  }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "#e4405f",
                    "&:hover": { backgroundColor: "rgba(228, 64, 95, 0.04)" },
                  }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Liên kết nhanh
              </Typography>
              <Grid container spacing={1}>
                {["Trang chủ", "Về chúng tôi", "Dịch vụ", "Blog", "Liên hệ"].map((text) => (
                  <Grid item xs={6} key={text}>
                    <Link
                      href="#"
                      underline="hover"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        py: 0.5,
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {text}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin liên hệ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Email: contact@nutriwise.com
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Điện thoại: (84) 123 456 789
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Copyright sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                2024 NutriWise. Đã đăng ký bản quyền.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                Điều khoản sử dụng
              </Link>
              <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                Chính sách bảo mật
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;