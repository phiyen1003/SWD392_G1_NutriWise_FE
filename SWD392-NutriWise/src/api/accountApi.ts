// src/api/accountApi.ts
import apiClient from "./apiClient";
import { auth } from "../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export interface GoogleLoginResponse {
  token: string;
  email: string;
  userId: string;
  profileComplete: boolean;
}

export interface GoogleCallbackResponse {
  token: string;
  email: string;
  isRegistered: boolean;
  profileComplete: boolean;
}

export interface CompleteProfileRequest {
  userId: string;
  email?: string | null;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  height: number;
  weight: number;
  allergenId?: number;
  healthGoalId?: number;
  bmi?: number;
  bloodPressure?: string | null;
  cholesterol?: string | null;
}

export interface CompleteProfileResponse {
  message: string;
}

export interface RegisterRequest {
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
  email: string;
  username: string;
  password?: string;
}

export interface UpdateProfileRequest {
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  height?: number;
  weight?: number;
  allergenId?: number;
  healthGoalId?: number;
  bmi?: number;
  bloodPressure?: string | null;
  cholesterol?: string | null;
}

const provider = new GoogleAuthProvider();

export const firebaseLogin = async (): Promise<GoogleLoginResponse> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(true); // Làm mới idToken
    console.log("idToken:", idToken);

    const response = await apiClient.post<GoogleLoginResponse>("/Account/firebase-login", {
      idToken,
    });

    const data = response.data;

    if (data.profileComplete) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.userId);
    } else {
      localStorage.setItem("tempToken", data.token);
      localStorage.setItem("tempEmail", data.email);
      localStorage.setItem("tempUserId", data.userId);
    }

    return data;
  } catch (error:any) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(`Đăng nhập Firebase thất bại: ${error.response.data.message || "Lỗi không xác định"}`);
    } else {
      throw new Error(`Đăng nhập Firebase thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
    }
  }
};

export const googleCallback = async (idToken: string): Promise<GoogleCallbackResponse> => {
  try {
    const response = await apiClient.post<GoogleCallbackResponse>("/Account/firebase-login", {
      idToken,
    });

    const data = response.data;

    return data;
  } catch (error) {
    throw new Error(`Xử lý callback thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  }
};

export const register = async (data: RegisterRequest): Promise<GoogleLoginResponse> => {
  try {
    const response = await apiClient.post<GoogleLoginResponse>("/Account/register", data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("userId", response.data.userId);
    return response.data;
  } catch (error) {
    throw new Error(`Đăng ký thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  }
};

export const completeProfile = async (data: CompleteProfileRequest): Promise<CompleteProfileResponse> => {
  try {
    const updateProfileData: UpdateProfileRequest = {
      fullName: data.fullName ?? undefined,
      gender: data.gender ?? undefined,
      dateOfBirth: data.dateOfBirth ?? undefined,
      height: data.height,
      weight: data.weight,
      allergenId: data.allergenId ?? undefined,
      healthGoalId: data.healthGoalId ?? undefined,
      bmi: data.bmi ?? undefined,
      bloodPressure: data.bloodPressure ?? undefined,
      cholesterol: data.cholesterol ?? undefined,
    };

    const response = await apiClient.put<CompleteProfileResponse>("/Account/update-profile", updateProfileData);
    return response.data;
  } catch (error:any) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(`Hoàn thành hồ sơ thất bại: ${error.response.data.message || "Lỗi không xác định"}`);
    } else {
      throw new Error(`Hoàn thành hồ sơ thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
    }
  }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<CompleteProfileResponse> => {
  try {
    const response = await apiClient.put<CompleteProfileResponse>("/Account/update-profile", data);
    return response.data;
  } catch (error) {
    throw new Error(`Cập nhật hồ sơ thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post("/Account/sign-out");
    localStorage.clear();
    await auth.signOut();
  } catch (error) {
    throw new Error(`Đăng xuất thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  }
};