// src/api/recipeApi.ts
import apiClient from "./apiClient";
import { RecipeDTO, UpdateRecipeDTO } from "../types/types"; // Import từ types.ts

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
  CombineWith?: number; // 0 hoặc 1
}): Promise<RecipeDTO[]> => {
  try {
    const response = await apiClient.get("/Recipe/all-recipes", { params });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recipes");
  }
};


export const getRecipeById = async (id: number): Promise<RecipeDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/Recipe/recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }
};

export const createRecipe = async (recipe: RecipeDTO): Promise<RecipeDTO> => { // Sử dụng RecipeDTO
  try {
    const response = await apiClient.post("/Recipe/recipe-creation", recipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create recipe");
  }
};

export const updateRecipe = async (id: number, recipe: UpdateRecipeDTO): Promise<RecipeDTO> => { // id: string -> number, dùng UpdateRecipeDTO
  try {
    const response = await apiClient.put(`/Recipe/recipe-updation/${id}`, recipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe with id ${id}`);
  }
};

export const deleteRecipe = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/Recipe/recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe with id ${id}`);
  }
};

export const searchRecipe = async (query: string): Promise<RecipeDTO[]> => {
  try {
    const response = await apiClient.get(`/Recipe/recipe-search?name=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search recipes");
  }
};

export const getRecipesByCategory = async (categoryId: number): Promise<RecipeDTO[]> => { // categoryId: string -> number
  try {
    const response = await apiClient.get(`/Recipe/recipe-by-category-id/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for category ${categoryId}`);
  }
};