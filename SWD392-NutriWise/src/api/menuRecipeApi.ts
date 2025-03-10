// src/api/menuRecipeApi.ts
import apiClient from "./apiClient";
import { MenuRecipeDTO, UpdateMenuRecipeDTO } from "../types/types"; // Import từ types.ts

export const getAllMenuRecipes = async (): Promise<MenuRecipeDTO[]> => {
  try {
    const response = await apiClient.get("/MenuRecipe/all-menu-recipes");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch menu recipes");
  }
};

export const getMenuRecipeById = async (id: number): Promise<MenuRecipeDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/MenuRecipe/menu-recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe with id ${id}`);
  }
};

export const getMenuRecipesByMenuHistoryId = async (menuHistoryId: number): Promise<MenuRecipeDTO[]> => { // menuHistoryId: string -> number, sửa tên hàm
  try {
    const response = await apiClient.get(`/MenuRecipe/menu-history-by-id/${menuHistoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipes for menu history with id ${menuHistoryId}`);
  }
};

export const createMenuRecipe = async (menuRecipe: MenuRecipeDTO): Promise<MenuRecipeDTO> => { // Sử dụng MenuRecipeDTO
  try {
    const response = await apiClient.post("/MenuRecipe/menu-recipe-creation", menuRecipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create menu recipe");
  }
};

export const updateMenuRecipe = async (id: number, menuRecipe: UpdateMenuRecipeDTO): Promise<MenuRecipeDTO> => { // id: string -> number, dùng UpdateMenuRecipeDTO
  try {
    const response = await apiClient.put(`/MenuRecipe/menu-recipe-updation/${id}`, menuRecipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu recipe with id ${id}`);
  }
};

export const deleteMenuRecipe = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/MenuRecipe/menu-recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu recipe with id ${id}`);
  }
};