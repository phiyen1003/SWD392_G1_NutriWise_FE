import apiClient from "./apiClient";
import { auth } from "../firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Định nghĩa interface cho response từ BE
export interface GoogleLoginResponse {
  token: string;
  email: string | null;
  userId: string;
  isRegistered: boolean;
  roleID: number;
}

export interface GoogleCallbackResponse {
  userId: string;
  token: string;
  email: string | null;
  isRegistered: boolean;
  roleID: number;
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

// Đăng nhập bằng Firebase
export const firebaseLogin = async (): Promise<GoogleLoginResponse> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(true);
    console.log("Firebase ID Token:", idToken);

    const response = await apiClient.post<GoogleLoginResponse>("/Account/firebase-login", {
      idToken,
    });
    const data = response.data;

    // Nếu user đã đăng ký hoàn chỉnh, lưu token chính thức
    if (data.token && data.isRegistered) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("userId", data.userId);

      // Redirect nếu roleId = "1"
      if (data.roleID === 1) {
        window.location.href = "/nutriwise/dashboard";
      }
    } else {
      // Nếu user chưa đăng ký, lưu thông tin tạm
      localStorage.setItem("tempEmail", data.email || user.email || "");
      localStorage.setItem("tempUserId", data.userId || user.uid);
    }

    return data;
  } catch (error: any) {
    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(
        `Đăng nhập Firebase thất bại: ${error.response.data.message || "Lỗi không xác định"}`
      );
    } else {
      throw new Error(
        `Đăng nhập Firebase thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
      );
    }
  }
};

// Callback cho Google (nếu dùng redirect flow)
export const googleCallback = async (idToken: string): Promise<GoogleCallbackResponse> => {
  try {
    const response = await apiClient.post<GoogleCallbackResponse>("/Account/firebase-login", {
      idToken,
    });
    const data = response.data;
    console.log(`idToken : ${idToken}`)

    if (data.token && data.isRegistered) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("userId", data.userId);

      // Redirect nếu roleId = "1"
      if (data.roleID === 1) {
        window.location.href = "/nutriwise/dashboard";
      }
    } else {
      localStorage.setItem("tempEmail", data.email || "");
      localStorage.setItem("tempUserId", data.userId);
    }

    return data;
  } catch (error: any) {
    throw new Error(
      `Xử lý callback thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
    );
  }
};

// Đăng ký user với thông tin đầy đủ
export const register = async (data: RegisterRequest): Promise<GoogleLoginResponse> => {
  try {
    const response = await apiClient.post<GoogleLoginResponse>("/Account/register", data);
    const result = response.data;

    localStorage.setItem("token", result.token);
    localStorage.setItem("email", result.email || "");
    localStorage.setItem("userId", result.userId);
    localStorage.removeItem("tempToken");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("tempUserId");

    // Redirect nếu roleId = "1"
    if (result.roleID === 1) {
      window.location.href = "/nutriwise/dashboard";
    }

    return result;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Đăng ký thất bại: ${error.response.data.message || "Lỗi không xác định"}`
      );
    }
    throw new Error(
      `Đăng ký thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
    );
  }
};

// Hoàn thiện hồ sơ user
export const completeProfile = async (
  data: CompleteProfileRequest
): Promise<CompleteProfileResponse> => {
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

    const response = await apiClient.put<CompleteProfileResponse>(
      `/Account/update-profile/${data.userId}`,
      updateProfileData
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Hoàn thành hồ sơ thất bại: ${error.response.data.message || "Lỗi không xác định"}`
      );
    }
    throw new Error(
      `Hoàn thành hồ sơ thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
    );
  }
};

// Cập nhật hồ sơ user
export const updateProfile = async (
  data: UpdateProfileRequest,
  userId: string
): Promise<CompleteProfileResponse> => {
  try {
    const response = await apiClient.put<CompleteProfileResponse>(
      `/Account/update-profile/${userId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Cập nhật hồ sơ thất bại: ${error.response.data.message || "Lỗi không xác định"}`
      );
    }
    throw new Error(
      `Cập nhật hồ sơ thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
    );
  }
};

// Đăng xuất
export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post("/Account/sign-out");
    localStorage.removeItem("token");
    localStorage.removeItem("tempToken");
    localStorage.removeItem("email");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("tempUserId");
    await auth.signOut();
  } catch (error: any) {
    throw new Error(
      `Đăng xuất thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
    );
  }
};