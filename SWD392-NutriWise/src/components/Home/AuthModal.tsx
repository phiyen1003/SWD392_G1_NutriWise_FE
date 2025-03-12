import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { CompleteProfileRequest, completeProfile } from "../../api/accountApi";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onCompleteProfile: (data: CompleteProfileRequest) => void;
  isNewUser?: boolean;
  userId?: string;
  email?: string;
}

const AuthModal = ({ open, onClose, onCompleteProfile, isNewUser, userId, email }: AuthModalProps) => {
  const [profileData, setProfileData] = useState<CompleteProfileRequest>({
    userId: userId || "",
    fullName: "",
    email: email || "",
    gender: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
    allergenId: 0,
    bmi: 0,
    bloodPressure: "",
    cholesterol: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (!profileData.userId || !profileData.fullName || !profileData.email) {
        throw new Error("Vui lòng điền đầy đủ các trường bắt buộc (userId, fullName, email)");
      }

      if (profileData.height && profileData.weight) {
        const heightInMeters = profileData.height / 100;
        const bmi = profileData.weight / (heightInMeters * heightInMeters);
        setProfileData((prev) => ({ ...prev, bmi: parseFloat(bmi.toFixed(2)) }));
      }

      await completeProfile(profileData);
      onCompleteProfile(profileData);
    } catch (err) {
      setError("Failed to complete profile: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  if (!isNewUser) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          width: 400,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hoàn thành hồ sơ sức khỏe
        </Typography>
        <TextField
          label="User ID"
          value={profileData.userId}
          disabled
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Họ và tên"
          value={profileData.fullName}
          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Giới tính"
          value={profileData.gender || ""}
          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Ngày sinh (YYYY-MM-DD)"
          value={profileData.dateOfBirth || ""}
          onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Chiều cao (cm)"
          type="number"
          value={profileData.height || ""}
          onChange={(e) => setProfileData({ ...profileData, height: parseFloat(e.target.value) || 0 })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cân nặng (kg)"
          type="number"
          value={profileData.weight || ""}
          onChange={(e) => setProfileData({ ...profileData, weight: parseFloat(e.target.value) || 0 })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Allergen ID"
          type="number"
          value={profileData.allergenId || ""}
          onChange={(e) => setProfileData({ ...profileData, allergenId: parseInt(e.target.value) || 0 })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Huyết áp (mmHg)"
          value={profileData.bloodPressure || ""}
          onChange={(e) => setProfileData({ ...profileData, bloodPressure: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cholesterol (mg/dL)"
          value={profileData.cholesterol || ""}
          onChange={(e) => setProfileData({ ...profileData, cholesterol: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="BMI"
          type="number"
          value={profileData.bmi || ""}
          disabled
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Hoàn thành
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal;