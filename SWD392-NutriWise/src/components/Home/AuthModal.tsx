import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { googleLogin, googleCallback } from "../../api/accountApi";
import { CompleteProfileRequest } from "../../api/accountApi";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, email: string) => void; // Cập nhật để nhận token và email
  onCompleteProfile: (data: CompleteProfileRequest) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLoginSuccess, onCompleteProfile }) => {
  const [error, setError] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState<CompleteProfileRequest>({
    userId: "",
    fullName: "",
    email: "",
  });

  // Xử lý callback từ Google OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    if (token && email) {
      onLoginSuccess(token, email); // Gọi onLoginSuccess với token và email
      setShowProfileForm(true);
      window.history.replaceState({}, document.title, window.location.pathname); // Xóa query string
    }
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin(); // Redirect đến trang đăng nhập Google qua backend
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please check API configuration."
      );
    }
  };

  const handleProfileSubmit = () => {
    if (!profileData.userId || !profileData.fullName || !profileData.email) {
      setError("Please fill in all required fields.");
      return;
    }
    onCompleteProfile(profileData);
    setShowProfileForm(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đăng nhập</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {showProfileForm ? (
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="User ID"
              value={profileData.userId}
              onChange={(e) => setProfileData({ ...profileData, userId: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Vui lòng đăng nhập bằng tài khoản Google của bạn.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        {showProfileForm ? (
          <Button onClick={handleProfileSubmit}>Hoàn thiện profile</Button>
        ) : (
          <Button onClick={handleGoogleLogin}>Đăng nhập với Google</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;