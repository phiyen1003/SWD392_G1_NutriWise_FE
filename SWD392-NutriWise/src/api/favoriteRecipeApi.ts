// src/api/favoriteRecipeApi.ts
import apiClient from "./apiClient";
import { FavoriteRecipeDTO, UpdateFavoriteRecipeDTO, CreateFavoriteRecipeDTO } from "../types/types"; // Import từ types.ts

export const getAllFavorites = async (): Promise<FavoriteRecipeDTO[]> => {
  try {
    const response = await apiClient.get("/FavoriteRecipe/all-favorites");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch all favorites");
  }
};

export const getUserFavorites = async (userId: number): Promise<FavoriteRecipeDTO[]> => { // userId: string -> number
  try {
    const response = await apiClient.get(`/FavoriteRecipe/user-favorites/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch favorites for user ${userId}`);
  }
};

export const getFavoriteById = async (id: number): Promise<FavoriteRecipeDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/FavoriteRecipe/favorite-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch favorite with id ${id}`);
  }
};

export const checkFavorite = async (userId: number, recipeId: number): Promise<boolean> => { // userId, recipeId: string -> number
  try {
    const response = await apiClient.get(`/FavoriteRecipe/favorite-check?userId=${userId}&recipeId=${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to check favorite");
  }
};

export const addFavorite = async (favorite: CreateFavoriteRecipeDTO): Promise<FavoriteRecipeDTO> => { // Sử dụng CreateFavoriteRecipeDTO
  try {
    const response = await apiClient.post("/FavoriteRecipe/favorite-add", favorite);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add favorite");
  }
};

export const updateFavorite = async (id: number, favorite: UpdateFavoriteRecipeDTO): Promise<FavoriteRecipeDTO> => { // id: string -> number, dùng UpdateFavoriteRecipeDTO
  try {
    const response = await apiClient.put(`/FavoriteRecipe/favorite-updation/${id}`, favorite);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update favorite with id ${id}`);
  }
};

export const removeFavorite = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/FavoriteRecipe/favorite-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to remove favorite with id ${id}`);
  }
};

export const removeFavoriteByUserAndRecipe = async (userId: number, recipeId: number): Promise<void> => { // userId, recipeId: string -> number
  try {
    await apiClient.delete(`/FavoriteRecipe/favorite-by-user-and-recipe-deletion?userId=${userId}&recipeId=${recipeId}`);
  } catch (error) {
    throw new Error("Failed to remove favorite by user and recipe");
  }
};

export const toggleFavorite = async (userId: number, recipeId: number): Promise<FavoriteRecipeDTO> => { // userId, recipeId: string -> number
  try {
    const response = await apiClient.post("/FavoriteRecipe/favorite-add-button", { userId, recipeId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to toggle favorite");
  }
};