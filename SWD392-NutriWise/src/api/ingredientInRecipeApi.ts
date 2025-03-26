import apiClient from "./apiClient";
import { IngredientInRecipeDTO, UpdateIngredientInRecipeDTO } from "../types/types"; // Import từ types.ts

// Interface để định nghĩa các query parameters cho getAllIngredientInRecipes
interface GetAllIngredientInRecipesParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  quantityMin?: number; // Sử dụng camelCase cho consistency
  quantityMax?: number; // Sử dụng camelCase cho consistency
  unit?: string;
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

// Hàm getAllIngredientInRecipes với các query parameters tùy chọn
export const getAllIngredientInRecipes = async (params: GetAllIngredientInRecipesParams = {}): Promise<IngredientInRecipeDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, quantityMin, quantityMax, unit, combineWith } = params;

    // Tạo object chứa các query parameters, chỉ thêm những tham số có giá trị
    const queryParams: Record<string, string | number | boolean> = {};
    if (pageNumber !== undefined) queryParams.PageNumber = pageNumber;
    if (pageSize !== undefined) queryParams.PageSize = pageSize;
    if (orderBy !== undefined) queryParams.OrderBy = orderBy;
    if (quantityMin !== undefined) queryParams["Quantity.Min"] = quantityMin; // Đảm bảo key đúng với API
    if (quantityMax !== undefined) queryParams["Quantity.Max"] = quantityMax; // Đảm bảo key đúng với API
    if (unit !== undefined) queryParams.Unit = unit;
    if (combineWith !== undefined) queryParams.CombineWith = combineWith;

    const response = await apiClient.get("/IngredientInRecipe/all-ingredient-in-recipe", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch ingredient in recipes");
  }
};

export const getById = async (id: number): Promise<IngredientInRecipeDTO> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredient in recipe with id ${id}`);
  }
};

export const getByRecipeId = async (recipeId: number): Promise<IngredientInRecipeDTO[]> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-recipe-id/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredients for recipe ${recipeId}`);
  }
};

export const getByIngredientId = async (ingredientId: number): Promise<IngredientInRecipeDTO[]> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-ingredient-id/${ingredientId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for ingredient ${ingredientId}`);
  }
};

export const createIngredientInRecipe = async (ingredientInRecipe: IngredientInRecipeDTO): Promise<IngredientInRecipeDTO> => {
  try {
    const response = await apiClient.post("/IngredientInRecipe/ingredient-in-recipe-creation", ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ingredient in recipe");
  }
};

export const updateIngredientInRecipe = async (id: number, ingredientInRecipe: UpdateIngredientInRecipeDTO): Promise<IngredientInRecipeDTO> => {
  try {
    const response = await apiClient.put(`/IngredientInRecipe/ingredient-in-recipe-updation/${id}`, ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ingredient in recipe with id ${id}`);
  }
};

export const deleteIngredientInRecipe = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/IngredientInRecipe/ingredient-in-recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredient in recipe with id ${id}`);
  }
};

export const deleteByRecipeId = async (recipeId: number): Promise<void> => {
  try {
    await apiClient.delete(`/IngredientInRecipe/ingredient-in-recipe-deletion-by-recipe-id/${recipeId}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredients for recipe ${recipeId}`);
  }
};