import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import AdminPage from "../pages/Admin/AdminPage";
import UsersPage from "../pages/Admin/UsersPage";
import NutritionPlansPage from "../pages/Admin/NutritionPlansPage";
import MealsPage from "../pages/Admin/MealsPage";
import ReportsPage from "../pages/Admin/ReportsPage";
import SettingsPage from "../pages/Admin/SettingsPage";

// Component dummy để xử lý redirect đến Google Login
const RedirectToGoogleLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect trực tiếp đến URL backend
    window.location.href = "https://nutriwise.azurewebsites.net/api/Account/google-login"; // Thay bằng endpoint thực tế từ Swagger
  }, []);

  return null; // Không render gì
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nutriwise/dashboard" element={<AdminPage />} /> {/* Chỉ giữ một route */}
        <Route path="/nutriwise/users" element={<UsersPage />} />
        <Route path="/nutriwise/nutrition-plans" element={<NutritionPlansPage />} />
        <Route path="/nutriwise/meals" element={<MealsPage />} />
        <Route path="/nutriwise/reports" element={<ReportsPage />} />
        <Route path="/nutriwise/settings" element={<SettingsPage />} />
        {/* Route dummy để xử lý redirect đến Google Login */}
        <Route path="/api/auth/google-login" element={<RedirectToGoogleLogin />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;