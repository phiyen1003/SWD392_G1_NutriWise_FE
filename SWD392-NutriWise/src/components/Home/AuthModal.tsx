import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

interface CompleteProfileRequest {
  userId: string;
  email: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  allergenId: number;
  healthGoalId: number;
  bmi: number;
  bloodPressure: string;
  cholesterol: string;
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onCompleteProfile: (data: CompleteProfileRequest) => Promise<void>;
  isNewUser: boolean;
  email: string;
  userId: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onCompleteProfile, isNewUser, email, userId }) => {
  const [formData, setFormData] = useState<CompleteProfileRequest>({
    userId,
    email,
    fullName: "",
    gender: "",
    dateOfBirth: "",
    height: 0,
    weight: 0,
    allergenId: 0,
    healthGoalId: 0,
    bmi: 0,
    bloodPressure: "",
    cholesterol: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const heightInMeters = formData.height / 100;
    const calculatedBmi = heightInMeters > 0 ? formData.weight / (heightInMeters * heightInMeters) : 0;
    console.log(`Height: ${formData.height}, Weight: ${formData.weight}, Calculated BMI: ${calculatedBmi}`);
    setFormData((prev) => ({ ...prev, bmi: Number(calculatedBmi.toFixed(2)) }));
  }, [formData.height, formData.weight]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (formData.height <= 0) newErrors.height = "Height must be greater than 0";
    if (formData.weight <= 0) newErrors.weight = "Weight must be greater than 0";
    if (formData.allergenId <= 0) newErrors.allergenId = "Allergen ID must be greater than 0";
    if (formData.healthGoalId <= 0) newErrors.healthGoalId = "Health Goal ID must be greater than 0";
    if (!formData.bloodPressure) newErrors.bloodPressure = "Blood Pressure is required";
    if (!formData.cholesterol) newErrors.cholesterol = "Cholesterol is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newValue =
        name === "height" || name === "weight" || name === "allergenId" || name === "healthGoalId"
          ? parseFloat(value) || 0
          : value;
      return {
        ...prev,
        [name]: newValue,
      };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitError(null);
      await onCompleteProfile(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete profile";
      setSubmitError(errorMessage);
      console.error("Error completing profile:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {isNewUser ? "Complete Your Profile" : "Update Profile"}
        </Typography>
        {submitError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {submitError}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="User ID"
            name="userId"
            value={formData.userId}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          <TextField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.gender}
            helperText={errors.gender}
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
          />
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height === 0 ? "" : formData.height}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.height}
            helperText={errors.height}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight === 0 ? "" : formData.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.weight}
            helperText={errors.weight}
          />
          <TextField
            label="BMI"
            name="bmi"
            type="number"
            value={formData.bmi}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
            helperText="Calculated automatically"
          />
          <TextField
            label="Allergen ID"
            name="allergenId"
            type="number"
            value={formData.allergenId === 0 ? "" : formData.allergenId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.allergenId}
            helperText={errors.allergenId}
          />
          <TextField
            label="Health Goal ID"
            name="healthGoalId"
            type="number"
            value={formData.healthGoalId === 0 ? "" : formData.healthGoalId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.healthGoalId}
            helperText={errors.healthGoalId}
          />
          <TextField
            label="Blood Pressure"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.bloodPressure}
            helperText={errors.bloodPressure}
          />
          <TextField
            label="Cholesterol"
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.cholesterol}
            helperText={errors.cholesterol}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AuthModal;