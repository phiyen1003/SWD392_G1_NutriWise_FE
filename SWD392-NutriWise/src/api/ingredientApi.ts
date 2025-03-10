// src/api/ingredientApi.ts
import apiClient from "./apiClient";
import { IngredientDTO, UpdateIngredientDTO } from "../types/types"; // Import từ types.ts

export const getAllIngredients = async (): Promise<IngredientDTO[]> => {
  try {
    const response = await apiClient.get("/Ingredient/all-ingredients");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch ingredients");
  }
};

export const getIngredientById = async (id: number): Promise<IngredientDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/Ingredient/ingredient-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredient with id ${id}`);
  }
};

export const createIngredient = async (ingredient: IngredientDTO): Promise<IngredientDTO> => { // Sử dụng IngredientDTO
  try {
    const response = await apiClient.post("/Ingredient/ingredient-creation", ingredient);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ingredient");
  }
};

export const updateIngredient = async (id: number, ingredient: UpdateIngredientDTO): Promise<IngredientDTO> => { // id: string -> number, dùng UpdateIngredientDTO
  try {
    const response = await apiClient.put(`/Ingredient/ingredient-updation/${id}`, ingredient);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ingredient with id ${id}`);
  }
};

export const deleteIngredient = async (id: number): Promise<void> => { // id: string -> number
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