import apiClient from "./apiClient";
import { HealthGoalDTO } from "../types/types";

interface GetAllHealthGoalsParams {
  PageNumber?: number;
  PageSize?: number;
  OrderBy?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const getAllHealthGoals = async (params: GetAllHealthGoalsParams = {}): Promise<PaginatedResponse<HealthGoalDTO>> => {
  try {
    const response = await apiClient.get<HealthGoalDTO[]>("/HealthGoal/all-health-goals", {
      params: {
        PageNumber: params.PageNumber,
        PageSize: params.PageSize,
        OrderBy: params.OrderBy,
      },
    });
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error) {
    throw new Error("Failed to fetch health goals");
  }
};

export const searchHealthGoal = async (query: string): Promise<PaginatedResponse<HealthGoalDTO>> => {
  try {
    const response = await apiClient.get<HealthGoalDTO[]>("/HealthGoal/search", {
      params: { query },
    });
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error) {
    throw new Error("Failed to search health goals");
  }
};

export const createHealthGoal = async (data: HealthGoalDTO): Promise<HealthGoalDTO> => {
  const response = await apiClient.post("/HealthGoal/create", data);
  return response.data;
};

export const updateHealthGoal = async (id: number, data: Partial<HealthGoalDTO>): Promise<HealthGoalDTO> => {
  const response = await apiClient.put(`/HealthGoal/update/${id}`, data);
  return response.data;
};

export const deleteHealthGoal = async (id: number): Promise<void> => {
  await apiClient.delete(`/HealthGoal/delete/${id}`);
};

// API mới: Lấy HealthGoal theo id
export const getHealthGoalById = async (id: number): Promise<HealthGoalDTO> => {
  try {
    const response = await apiClient.get<HealthGoalDTO>(`/HealthGoal/health-goal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health goal with id ${id}`);
  }
};