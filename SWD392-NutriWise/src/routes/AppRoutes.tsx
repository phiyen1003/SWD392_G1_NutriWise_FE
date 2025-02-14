import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "../pages/Home/HomePage";
import AdminPage from "../pages/Admin/AdminPage";
{
  /* Đảm bảo dùng đúng trang này */
}


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdminPage/>} />
        <Route path='/admin' element={<AdminPage/>} />

        
                </Routes>
    </Router>
  );
};

export default AppRoutes;
