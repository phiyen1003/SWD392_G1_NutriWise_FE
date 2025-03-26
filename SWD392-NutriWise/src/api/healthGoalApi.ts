// src/api/healthGoalApi.ts
import apiClient from "./apiClient";
import { HealthGoalDTO, UpdateHealthGoalDTO } from "../types/types";

// Lấy tất cả HealthGoal với phân trang
export const getAllHealthGoals = async (params: {
  PageNumber: number;
  PageSize: number;
  OrderBy?: string;
}): Promise<HealthGoalDTO[]> => {
  try {
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get("/HealthGoal/all-health-goal", { params });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch health goals";
    throw new Error(errorMessage);
  }
};

// Lấy HealthGoal theo ID
export const getHealthGoalById = async (id: number): Promise<HealthGoalDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    const response = await apiClient.get(`/HealthGoal/health-goal-by-id/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Tạo mới HealthGoal
export const createHealthGoal = async (healthGoal: HealthGoalDTO): Promise<HealthGoalDTO> => {
  try {
    if (!healthGoal.name || !healthGoal.description) {
      throw new Error("Name and Description are required");
    }
    const response = await apiClient.post("/HealthGoal/health-goal-creation", healthGoal);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create health goal";
    throw new Error(errorMessage);
  }
};

// Cập nhật HealthGoal
export const updateHealthGoal = async (
  id: number,
  healthGoal: UpdateHealthGoalDTO
): Promise<HealthGoalDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    if (!healthGoal.name || !healthGoal.description) {
      throw new Error("Name and Description are required");
    }
    const response = await apiClient.put(`/HealthGoal/health-goal-updation/${id}`, healthGoal);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to update health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Xóa HealthGoal
export const deleteHealthGoal = async (id: number): Promise<void> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    await apiClient.delete(`/HealthGoal/health-goal-deletion/${id}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to delete health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Tìm kiếm HealthGoal
export const searchHealthGoal = async (query: string): Promise<HealthGoalDTO[]> => {
  try {
    if (!query || query.trim() === "") {
      throw new Error("Query cannot be empty");
    }
    const response = await apiClient.get("/HealthGoal/health-goal-search", {
      params: { name: query },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to search health goals";
    throw new Error(errorMessage);
  }
};