import apiClient from "./apiClient";
import { IngredientDTO, UpdateIngredientDTO } from "../types/types"; // Import từ types.ts

// Interface để định nghĩa các query parameters cho getAllIngredients
interface GetAllIngredientsParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  isAllergen?: boolean;
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

// Hàm getAllIngredients với các query parameters tùy chọn
export const getAllIngredients = async (params: GetAllIngredientsParams = {}): Promise<IngredientDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, isAllergen, combineWith } = params;

    // Tạo object chứa các query parameters, chỉ thêm những tham số có giá trị
    const queryParams: Record<string, string | number | boolean> = {};
    if (pageNumber !== undefined) queryParams.PageNumber = pageNumber;
    if (pageSize !== undefined) queryParams.PageSize = pageSize;
    if (orderBy !== undefined) queryParams.OrderBy = orderBy;
    if (isAllergen !== undefined) queryParams.IsAllergen = isAllergen;
    if (combineWith !== undefined) queryParams.CombineWith = combineWith;

    const response = await apiClient.get("/Ingredient/all-ingredients", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch ingredients");
  }
};

export const getIngredientById = async (id: number): Promise<IngredientDTO> => {
  try {
    const response = await apiClient.get(`/Ingredient/ingredient-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredient with id ${id}`);
  }
};

export const createIngredient = async (ingredient: IngredientDTO): Promise<IngredientDTO> => {
  try {
    const response = await apiClient.post("/Ingredient/ingredient-creation", ingredient);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ingredient");
  }
};

export const updateIngredient = async (id: number, ingredient: UpdateIngredientDTO): Promise<IngredientDTO> => {
  try {
    const response = await apiClient.put(`/Ingredient/ingredient-updation/${id}`, ingredient);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ingredient with id ${id}`);
  }
};

export const deleteIngredient = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Ingredient/ingredient-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredient with id ${id}`);
  }
};

export const searchIngredient = async (query: string): Promise<IngredientDTO[]> => {
  try {
    const response = await apiClient.get(`/Ingredient/ingredient-search?name=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search ingredients");
  }
};