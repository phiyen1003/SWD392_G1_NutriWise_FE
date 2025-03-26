// src/api/profileGoalApi.ts
import apiClient from "./apiClient";
import { ProfileGoalDTO, UpdateProfileGoalDTO } from "../types/types";

// Lấy tất cả ProfileGoal với phân trang
export const getAllProfileGoals = async (params: {
  PageNumber: number;
  PageSize: number;
  OrderBy?: string;
}): Promise<ProfileGoalDTO[]> => {
  try {
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get("/ProfileGoal/all-profile-goal", { params });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch profile goals";
    throw new Error(errorMessage);
  }
};

// Lấy ProfileGoal theo ID
export const getProfileGoalById = async (id: number): Promise<ProfileGoalDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    const response = await apiClient.get(`/ProfileGoal/profile-goal-by-id/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch profile goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Lấy danh sách ProfileGoal theo HealthProfileId với phân trang
export const getProfileGoalsByHealthProfileId = async (
  healthProfileId: number,
  params: {
    PageNumber: number;
    PageSize: number;
    OrderBy?: string;
  }
): Promise<ProfileGoalDTO[]> => {
  try {
    if (!healthProfileId || healthProfileId <= 0) {
      throw new Error("Invalid HealthProfileId: HealthProfileId must be a positive number");
    }
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get(
      `/ProfileGoal/profile-goals-by-health-profile-id/${healthProfileId}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      `Failed to fetch profile goals for health profile ${healthProfileId}`;
    throw new Error(errorMessage);
  }
};

// Lấy danh sách ProfileGoal theo HealthGoalId với phân trang
export const getProfileGoalsByHealthGoalId = async (
  healthGoalId: number,
  params: {
    PageNumber: number;
    PageSize: number;
    OrderBy?: string;
  }
): Promise<ProfileGoalDTO[]> => {
  try {
    if (!healthGoalId || healthGoalId <= 0) {
      throw new Error("Invalid HealthGoalId: HealthGoalId must be a positive number");
    }
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get(
      `/ProfileGoal/profile-goal-by-health-goal-id/${healthGoalId}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      `Failed to fetch profile goals for health goal ${healthGoalId}`;
    throw new Error(errorMessage);
  }
};

// Tạo mới ProfileGoal
export const createProfileGoal = async (profileGoal: ProfileGoalDTO): Promise<ProfileGoalDTO> => {
  try {
    if (!profileGoal.healthProfileId || !profileGoal.healthGoalId) {
      throw new Error("HealthProfileId and HealthGoalId are required");
    }
    if (!profileGoal.startDate || !profileGoal.endDate) {
      throw new Error("StartDate and EndDate are required");
    }
    const response = await apiClient.post("/ProfileGoal/profile-goal-creation", profileGoal);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create profile goal";
    throw new Error(errorMessage);
  }
};

// Cập nhật ProfileGoal
export const updateProfileGoal = async (
  id: number,
  profileGoal: UpdateProfileGoalDTO
): Promise<ProfileGoalDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    if (!profileGoal.healthProfileId || !profileGoal.healthGoalId) {
      throw new Error("HealthProfileId and HealthGoalId are required");
    }
    if (!profileGoal.startDate || !profileGoal.endDate) {
      throw new Error("StartDate and EndDate are required");
    }
    const response = await apiClient.put(`/ProfileGoal/profile-goal-updation/${id}`, profileGoal);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to update profile goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Xóa ProfileGoal
export const deleteProfileGoal = async (id: number): Promise<void> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    await apiClient.delete(`/ProfileGoal/profile-goal-deletion/${id}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to delete profile goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Tìm kiếm ProfileGoal (nếu backend hỗ trợ)
export const searchProfileGoal = async (query: string): Promise<ProfileGoalDTO[]> => {
  try {
    if (!query || query.trim() === "") {
      throw new Error("Query cannot be empty");
    }
    const response = await apiClient.get("/ProfileGoal/profile-goal-search", {
      params: { query },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to search profile goals";
    throw new Error(errorMessage);
  }
};