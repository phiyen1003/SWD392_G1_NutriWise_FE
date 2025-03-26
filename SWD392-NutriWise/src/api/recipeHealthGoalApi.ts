// src/api/recipeHealthGoalApi.ts
import apiClient from "./apiClient";
import { RecipeHealthGoalDTO, UpdateRecipeHealthGoalDTO } from "../types/types";

// Lấy tất cả RecipeHealthGoal với phân trang
export const getAllRecipeHealthGoals = async (params: {
  PageNumber: number;
  PageSize: number;
  OrderBy?: string;
}): Promise<RecipeHealthGoalDTO[]> => {
  try {
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get("/RecipeHealthGoal/all-recipe-health-goals", { params });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch recipe health goals";
    throw new Error(errorMessage);
  }
};

// Lấy RecipeHealthGoal theo ID
export const getById = async (id: number): Promise<RecipeHealthGoalDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
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
  params: {
    PageNumber: number;
    PageSize: number;
    OrderBy?: string;
  }
): Promise<RecipeHealthGoalDTO[]> => {
  try {
    if (!recipeId || recipeId <= 0) {
      throw new Error("Invalid RecipeId: RecipeId must be a positive number");
    }
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get(
      `/RecipeHealthGoal/recipe-health-goal-by-recipe-id/${recipeId}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch health goals for recipe ${recipeId}`;
    throw new Error(errorMessage);
  }
};

// Lấy danh sách RecipeHealthGoal theo HealthGoalId với phân trang
export const getByHealthGoalId = async (
  healthGoalId: number,
  params: {
    PageNumber: number;
    PageSize: number;
    OrderBy?: string;
  }
): Promise<RecipeHealthGoalDTO[]> => {
  try {
    if (!healthGoalId || healthGoalId <= 0) {
      throw new Error("Invalid HealthGoalId: HealthGoalId must be a positive number");
    }
    const { PageNumber, PageSize, OrderBy } = params;
    if (PageNumber < 1 || PageSize < 1) {
      throw new Error("PageNumber and PageSize must be greater than 0");
    }
    const response = await apiClient.get(
      `/RecipeHealthGoal/recipe-health-goal-by-health-goal-id/${healthGoalId}`,
      { params }
    );
    return response.data;
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
    if (!recipeHealthGoal.recipeId || !recipeHealthGoal.healthGoalId) {
      throw new Error("RecipeId and HealthGoalId are required");
    }
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
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    if (!recipeHealthGoal.recipeId || !recipeHealthGoal.healthGoalId) {
      throw new Error("RecipeId and HealthGoalId are required");
    }
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
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    await apiClient.delete(`/RecipeHealthGoal/recipe-health-goal-deletion/${id}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to delete recipe health goal with id ${id}`;
    throw new Error(errorMessage);
  }
};