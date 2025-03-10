// src/api/ingredientInRecipeApi.ts
import apiClient from "./apiClient";
import { IngredientInRecipeDTO, UpdateIngredientInRecipeDTO } from "../types/types"; // Import từ types.ts

export const getAllIngredientInRecipes = async (): Promise<IngredientInRecipeDTO[]> => {
  try {
    const response = await apiClient.get("/IngredientInRecipe/all-ingredient-in-recipe");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch ingredient in recipes");
  }
};

export const getById = async (id: number): Promise<IngredientInRecipeDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredient in recipe with id ${id}`);
  }
};

export const getByRecipeId = async (recipeId: number): Promise<IngredientInRecipeDTO[]> => { // recipeId: string -> number
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-recipe-id/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredients for recipe ${recipeId}`);
  }
};

export const getByIngredientId = async (ingredientId: number): Promise<IngredientInRecipeDTO[]> => { // ingredientId: string -> number
  try {
    const response = await apiClient.get(`/IngredientInRecipe/ingredient-in-recipe-by-ingredient-id/${ingredientId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for ingredient ${ingredientId}`);
  }
};

export const createIngredientInRecipe = async (ingredientInRecipe: IngredientInRecipeDTO): Promise<IngredientInRecipeDTO> => { // Sử dụng IngredientInRecipeDTO
  try {
    const response = await apiClient.post("/IngredientInRecipe/ingredient-in-recipe-creation", ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ingredient in recipe");
  }
};

export const updateIngredientInRecipe = async (id: number, ingredientInRecipe: UpdateIngredientInRecipeDTO): Promise<IngredientInRecipeDTO> => { // id: string -> number, dùng UpdateIngredientInRecipeDTO
  try {
    const response = await apiClient.put(`/IngredientInRecipe/ingredient-in-recipe-updation/${id}`, ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ingredient in recipe with id ${id}`);
  }
};

export const deleteIngredientInRecipe = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/IngredientInRecipe/ingredient-in-recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredient in recipe with id ${id}`);
  }
};

export const deleteByRecipeId = async (recipeId: number): Promise<void> => { // recipeId: string -> number
  try {
    await apiClient.delete(`/IngredientInRecipe/ingredient-in-recipe-deletion-by-recipe-id/${recipeId}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredients for recipe ${recipeId}`);
  }
};