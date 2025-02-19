import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import AdminPage from "../pages/Admin/AdminPage";
import UsersPage from '../pages/Admin/UsersPage';
import NutritionPlansPage from '../pages/Admin/NutritionPlansPage';
import MealsPage from '../pages/Admin/MealsPage';
import ReportsPage from '../pages/Admin/ReportsPage';
import SettingsPage from '../pages/Admin/SettingsPage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path="/nutriwise/dashboard" element={<AdminPage />} />
        <Route path="/nutriwise/dashboard" element={<AdminPage />} />
        <Route path="/nutriwise/users" element={<UsersPage />} />
        <Route path="/nutriwise/nutrition-plans" element={<NutritionPlansPage />} />
        <Route path="/nutriwise/meals" element={<MealsPage />} />
        <Route path="/nutriwise/reports" element={<ReportsPage />} />
        <Route path="/nutriwise/settings" element={<SettingsPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;

