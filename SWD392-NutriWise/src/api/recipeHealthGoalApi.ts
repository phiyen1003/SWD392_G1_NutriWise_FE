import apiClient from "./apiClient";
import { RecipeHealthGoalDTO, UpdateRecipeHealthGoalDTO } from "../types/types";

interface GetAllRecipeHealthGoalsParams {
  PageNumber: number;
  PageSize: number;
  OrderBy?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// Helper function để kiểm tra số dương
const validatePositiveNumber = (value: number, name: string) => {
  if (!value || value <= 0) {
    throw new Error(`Invalid ${name}: ${name} must be a positive number`);
  }
};

// Lấy tất cả RecipeHealthGoals với phân trang
export const getAllRecipeHealthGoals = async (
  params: GetAllRecipeHealthGoalsParams
): Promise<PaginatedResponse<RecipeHealthGoalDTO>> => {
  try {
    const { PageNumber, PageSize, OrderBy } = params;
    validatePositiveNumber(PageNumber, "PageNumber");
    validatePositiveNumber(PageSize, "PageSize");

    const response = await apiClient.get<RecipeHealthGoalDTO[]>("/RecipeHealthGoal/all-recipe-health-goals", {
      params: { PageNumber, PageSize, OrderBy },
    });
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch recipe health goals";
    throw new Error(errorMessage);
  }
};

// Lấy RecipeHealthGoal theo ID
export const getById = async (id: number): Promise<RecipeHealthGoalDTO> => {
  try {
    validatePositiveNumber(id, "ID");
    const response = await apiClient.get(`/RecipeHealthGoal/recipe-health-goal-by-id/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch recipe health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Lấy danh sách RecipeHealthGoal theo RecipeId với phân trang
export const getByRecipeId = async (
  recipeId: number,
  params: { PageNumber: number; PageSize: number; OrderBy?: string }
): Promise<PaginatedResponse<RecipeHealthGoalDTO>> => {
  try {
    validatePositiveNumber(recipeId, "RecipeId");
    const { PageNumber, PageSize, OrderBy } = params;
    validatePositiveNumber(PageNumber, "PageNumber");
    validatePositiveNumber(PageSize, "PageSize");

    const response = await apiClient.get(
      `/RecipeHealthGoal/recipe-health-goal-by-recipe-id/${recipeId}`,
      { params }
    );
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch health goals for recipe ${recipeId}`;
    throw new Error(errorMessage);
  }
};

// Lấy danh sách RecipeHealthGoal theo HealthGoalId với phân trang
export const getByHealthGoalId = async (
  healthGoalId: number,
  params: { PageNumber: number; PageSize: number; OrderBy?: string }
): Promise<PaginatedResponse<RecipeHealthGoalDTO>> => {
  try {
    validatePositiveNumber(healthGoalId, "HealthGoalId");
    const { PageNumber, PageSize, OrderBy } = params;
    validatePositiveNumber(PageNumber, "PageNumber");
    validatePositiveNumber(PageSize, "PageSize");

    const response = await apiClient.get(
      `/RecipeHealthGoal/recipe-health-goal-by-health-goal-id/${healthGoalId}`,
      { params }
    );
    const total = parseInt(response.headers["x-total-count"] || "0", 10);
    return { data: response.data, total };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch recipes for health goal ${healthGoalId}`;
    throw new Error(errorMessage);
  }
};

// Tạo mới RecipeHealthGoal
export const createRecipeHealthGoal = async (
  recipeHealthGoal: RecipeHealthGoalDTO
): Promise<RecipeHealthGoalDTO> => {
  try {
    validatePositiveNumber(recipeHealthGoal.recipeId, "RecipeId");
    validatePositiveNumber(recipeHealthGoal.healthGoalId, "HealthGoalId");

    const response = await apiClient.post(
      "/RecipeHealthGoal/recipe-health-goal-creation",
      recipeHealthGoal
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create recipe health goal";
    throw new Error(errorMessage);
  }
};

// Cập nhật RecipeHealthGoal
export const updateRecipeHealthGoal = async (
  id: number,
  recipeHealthGoal: UpdateRecipeHealthGoalDTO
): Promise<RecipeHealthGoalDTO> => {
  try {
    validatePositiveNumber(id, "ID");
    validatePositiveNumber(recipeHealthGoal.recipeId, "RecipeId");
    validatePositiveNumber(recipeHealthGoal.healthGoalId, "HealthGoalId");

    const response = await apiClient.put(
      `/RecipeHealthGoal/recipe-health-goal-updation/${id}`,
      recipeHealthGoal
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to update recipe health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Xóa RecipeHealthGoal
export const deleteRecipeHealthGoal = async (id: number): Promise<void> => {
  try {
    validatePositiveNumber(id, "ID");
    await apiClient.delete(`/RecipeHealthGoal/recipe-health-goal-deletion/${id}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to delete recipe health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};