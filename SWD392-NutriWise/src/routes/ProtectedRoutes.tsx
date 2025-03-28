import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Thư viện để giải mã JWT token

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  roleID: number; // Thêm roleId vào payload (đảm bảo token từ server có trường này)
  exp: number;
}

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Giải mã token để lấy thông tin
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra token có hết hạn không
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("userId");
          setIsAuthenticated(false);
          return;
        }

        // Kiểm tra roleId
        if (decoded.roleID === 1) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};