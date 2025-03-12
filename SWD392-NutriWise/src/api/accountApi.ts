import apiClient from "./apiClient";

export interface GoogleLoginResponse {
  token: string;
  email: string;
  userId?: string;
}

export interface CompleteProfileRequest {
  userId: string;
  fullName: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  allergenId?: number;
  bmi?: number;
  bloodPressure?: string;
  cholesterol?: string;
}

export interface CompleteProfileResponse {
  message: string;
}

export interface GoogleCallbackResponse {
  message: string;
  token: string;
  email: string;
  givenName: string;
  surname: string | null;
  isRegistered: boolean; // Thay profileComplete bằng isRegistered
  profileComplete: boolean;
}

export interface GoogleMobileRequest {
  idToken: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface UpdateProfileRequest {
  userId: string;
  fullName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  allergenId?: number;
  bmi?: number;
  bloodPressure?: string;
  cholesterol?: string;
}

export const googleLogin = async (): Promise<void> => {
  try {
    const returnUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    window.location.href = `${apiClient.defaults.baseURL}/Account/google-login?returnUrl=${returnUrl}`;
  } catch (error) {
    throw new Error("Failed to initiate Google login: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const googleCallback = async (): Promise<GoogleCallbackResponse> => {
  try {
    const response = await apiClient.get("/Account/google-callback");
    if (response.status !== 200 || !response.data) {
      throw new Error("Invalid response from google-callback");
    }
    return response.data;
  } catch (error) {
    console.error("Google callback error:", error);
    throw new Error("Failed to fetch Google callback data: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const googleMobileLogin = async (data: GoogleMobileRequest): Promise<GoogleCallbackResponse> => {
  try {
    const response = await apiClient.post("/Account/google-mobile", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to login with Google on mobile: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const register = async (data: RegisterRequest): Promise<GoogleLoginResponse> => {
  try {
    const response = await apiClient.post("/Account/register", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to register user: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const completeProfile = async (data: CompleteProfileRequest): Promise<CompleteProfileResponse> => {
  try {
    const response = await apiClient.post("/Account/complete-profile", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to complete profile: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<CompleteProfileResponse> => {
  try {
    const response = await apiClient.put("/Account/update-profile", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update profile: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post("/Account/sign-out");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("tempToken");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("tempUserId");
  } catch (error) {
    throw new Error("Failed to sign out: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};