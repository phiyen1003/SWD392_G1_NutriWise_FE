// src/api/recipeApi.ts
import apiClient from "./apiClient";
import { RecipeDTO, UpdateRecipeDTO } from "../types/types";
import { AxiosResponse } from "axios";

// Lấy tất cả công thức với các tham số lọc
export const getAllRecipes = async (params?: {
  PageNumber?: number;
  PageSize?: number;
  OrderBy?: string;
  Description?: string;
  CategoryId?: number;
  "CookingTime.Min"?: number;
  "CookingTime.Max"?: number;
  "Servings.Min"?: number;
  "Servings.Max"?: number;
  CombineWith?: number;
}): Promise<AxiosResponse<RecipeDTO[]>> => {
  const response = await apiClient.get("/Recipe/all-recipes", { params });
  return response; // Trả về toàn bộ response để người dùng xử lý
};

// Lấy công thức theo ID
export const getRecipeById = async (id: number): Promise<RecipeDTO> => {
  try {
    const response = await apiClient.get(`/Recipe/recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }
};

// Tạo mới một công thức
export const createRecipe = async (recipe: RecipeDTO): Promise<RecipeDTO> => {
  try {
    const response = await apiClient.post("/Recipe/recipe-creation", recipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create recipe");
  }
};

// Cập nhật công thức
export const updateRecipe = async (id: number, recipe: UpdateRecipeDTO): Promise<RecipeDTO> => {
  try {
    const response = await apiClient.put(`/Recipe/recipe-updation/${id}`, recipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe with id ${id}`);
  }
};

// Xóa công thức
export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Recipe/recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe with id ${id}`);
  }
};

// Tìm kiếm công thức theo tên
export const searchRecipe = async (query: string): Promise<RecipeDTO[]> => {
  try {
    const response = await apiClient.get(`/Recipe/recipe-search?name=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search recipes");
  }
};

// Lấy công thức theo danh mục
export const getRecipesByCategory = async (categoryId: number): Promise<RecipeDTO[]> => {
  try {
    const response = await apiClient.get(`/Recipe/recipe-by-category-id/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for category ${categoryId}`);
  }
};