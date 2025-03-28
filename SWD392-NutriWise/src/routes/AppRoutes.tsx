import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import AdminPage from "../pages/Admin/AdminPage";
import UsersPage from "../pages/Admin/UsersPage";
import NutritionPlansPage from "../pages/Admin/NutritionPlansPage";
import MealsPage from "../pages/Admin/MealsPage";
import ReportsPage from "../pages/Admin/ReportsPage";
import SettingsPage from "../pages/Admin/SettingsPage";
import RecipePage from "../pages/Admin/RecipesPage";
import AllergensPage from "../pages/Admin/AllergensPage";
import CategoriesPage from "../pages/Admin/CategoriesPage";
import FavoriteRecipesPage from "../pages/Admin/FavoriteRecipesPage";
import HealthGoalsPage from "../pages/Admin/HealthGoalsPage";
import HealthMetricsPage from "../pages/Admin/HealthMetricsPage";
import HealthProfilesPage from "../pages/Admin/HealthProfilesPage";
import IngredientsPage from "../pages/Admin/IngredientsPage";
import IngredientInRecipesPage from "../pages/Admin/IngredientInRecipesPage";
import MenuHistoriesPage from "../pages/Admin/MenuHistoriesPage";
import MenuRecipesPage from "../pages/Admin/MenuRecipesPage";
import MenuRecipeImagesPage from "../pages/Admin/MenuRecipeImagesPage";
import ProfileGoalsPage from "../pages/Admin/ProfileGoalsPage";
import RecipeHealthGoalsPage from "../pages/Admin/RecipeHealthGoalsPage";
import RecipeImagesPage from "../pages/Admin/RecipeImagesPage";
import AuthModal from "../components/Home/AuthModal";
import HealthProfilePage from "../pages/Admin/HealthProfilePage";
import { googleCallback, completeProfile } from "../api/accountApi";
import { CompleteProfileRequest, GoogleCallbackResponse } from "../api/accountApi";
import { auth } from "../firebase-config";
import AIChatPage from "../pages/AIChatPage";
import ProfilePage from "../pages/Admin/ProfilePage";

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

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempUserId, setTempUserId] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchCallbackData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        }

        const idToken = await user.getIdToken();
        const data: GoogleCallbackResponse = await googleCallback(idToken);
        const { token, email, isRegistered, userId } = data;

        if (!token || !email) {
          throw new Error("Không tìm thấy token hoặc email trong phản hồi từ server.");
        }

        if (!isRegistered) {
          localStorage.setItem("tempToken", token);
          localStorage.setItem("tempEmail", email || "");
          localStorage.setItem("tempUserId", userId);
          setTempUserId(userId);
          setTempEmail(email);
          setShowAuthModal(true);
        } else {
          // Lưu ý: Nên cân nhắc sử dụng HttpOnly cookie thay vì localStorage để tăng bảo mật
          localStorage.setItem("token", token);
          localStorage.setItem("email", email || "");
          localStorage.setItem("userId", userId);
          navigate("/");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi xử lý đăng nhập Google."
        );
        console.error("Callback error details:", err);
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchCallbackData();
  }, [navigate]);

  const handleCompleteProfile = useCallback(async (data: CompleteProfileRequest) => {
    try {
      setLoading(true);
      const response = await completeProfile(data);
      // Lưu ý: Nên cân nhắc sử dụng HttpOnly cookie thay vì localStorage
      localStorage.setItem("token", localStorage.getItem("tempToken") || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("userId", data.userId);
      localStorage.removeItem("tempToken");
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempUserId");
      setShowAuthModal(false);
      alert(response.message || "Hoàn thiện hồ sơ thành công!");
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Không thể hoàn thiện hồ sơ: ${err.message}`
          : "Đã xảy ra lỗi không xác định khi hoàn thiện hồ sơ."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Đang xử lý đăng nhập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <>
      <div>Đang xử lý đăng nhập Google...</div>
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onCompleteProfile={handleCompleteProfile}
        isNewUser={true}
        userId={tempUserId}
        email={tempEmail}
      />
    </>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
        <Route path="/nutriwise/dashboard" element={<AdminPage />} />
        <Route path="/nutriwise/users" element={<UsersPage />} />
        <Route path="/nutriwise/nutrition-plans" element={<NutritionPlansPage />} />
        <Route path="/nutriwise/meals" element={<MealsPage />} />
        <Route path="/nutriwise/recipes" element={<RecipePage />} />
        <Route path="/nutriwise/reports" element={<ReportsPage />} />
        <Route path="/nutriwise/settings" element={<SettingsPage />} />
        <Route path="/nutriwise/allergens" element={<AllergensPage />} />
        <Route path="/nutriwise/categories" element={<CategoriesPage />} />
        <Route path="/nutriwise/chats/:sessionId?" element={<AIChatPage />} />
        <Route path="/nutriwise/favorite-recipes" element={<FavoriteRecipesPage />} />
        <Route path="/nutriwise/health-goals" element={<HealthGoalsPage />} />
        <Route path="/nutriwise/health-metrics" element={<HealthMetricsPage />} />
        <Route path="/nutriwise/health-profiles" element={<HealthProfilesPage />} />
        <Route path="/nutriwise/health-profiles/:profileId" element={<HealthProfilePage />} />
        <Route path="/nutriwise/ingredients" element={<IngredientsPage />} />
        <Route path="/nutriwise/ingredient-in-recipes" element={<IngredientInRecipesPage />} />
        <Route path="/nutriwise/menu-histories" element={<MenuHistoriesPage />} />
        <Route path="/nutriwise/menu-recipes" element={<MenuRecipesPage />} />
        <Route path="/nutriwise/menu-recipe-images" element={<MenuRecipeImagesPage />} />
        <Route path="/nutriwise/profile-goals" element={<ProfileGoalsPage />} />
        <Route path="/nutriwise/recipe-health-goals" element={<RecipeHealthGoalsPage />} />
        <Route path="/nutriwise/recipe-images" element={<RecipeImagesPage />} />
        <Route path="/nutriwise/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;