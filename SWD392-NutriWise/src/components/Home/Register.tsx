import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, RegisterRequest } from "../../api/accountApi";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
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
    email: localStorage.getItem("tempEmail") || "",
    username: localStorage.getItem("tempEmail")?.split("@")[0] || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/home");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Registration</h2>
      <input
        type="email"
        value={formData.email}
        disabled
        placeholder="Email"
      />
      <input
        type="text"
        value={formData.username}
        disabled
        placeholder="Username"
      />
      <input
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        placeholder="Full Name"
      />
      <input
        type="text"
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        placeholder="Gender"
      />
      <input
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
      />
      <input
        type="number"
        value={formData.height}
        onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
        placeholder="Height"
      />
      <input
        type="number"
        value={formData.weight}
        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
        placeholder="Weight"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;