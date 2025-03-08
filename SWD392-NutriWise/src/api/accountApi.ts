// accountApi.ts
import apiClient from "./apiClient";

export interface GoogleLoginResponse {
  token: string;
  email: string;
}

export interface CompleteProfileRequest {
  userId: string;
  fullName: string;
  email: string;
}

export interface CompleteProfileResponse {
  message: string;
}

export const googleLogin = async (): Promise<void> => {
  try {
    // Redirect trực tiếp đến endpoint Google OAuth (dựa trên Swagger)
    window.location.href = `${apiClient.defaults.baseURL}/Account/google-login`;
  } catch (error) {
    throw new Error("Failed to initiate Google login");
  }
};

export const googleCallback = async (token: string, email: string): Promise<GoogleLoginResponse> => {
  try {
    // Backend đã gửi token và email qua URL, không cần gọi API thêm
    return { token, email }; // Trả về dữ liệu trực tiếp
  } catch (error) {
    throw new Error("Failed to handle Google callback");
  }
};

export const completeProfile = async (data: CompleteProfileRequest): Promise<CompleteProfileResponse> => {
  try {
    const response = await apiClient.post("/Account/complete-profile", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to complete profile");
  }
};