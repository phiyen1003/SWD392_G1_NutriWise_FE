// src/api/menuRecipeImageApi.ts
import apiClient from "./apiClient";
import { MenuRecipeImageDTO } from "../types/types"; // Import từ types.ts

export const getAllMenuRecipeImages = async (): Promise<MenuRecipeImageDTO[]> => {
  try {
    const response = await apiClient.get("/MenuRecipeImage/all-menu-recipe-images");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch menu recipe images");
  }
};

export const getMenuRecipeImageByMenuRecipeId = async (menuRecipeId: number): Promise<MenuRecipeImageDTO[]> => { // menuRecipeId: string -> number
  try {
    const response = await apiClient.get(`/MenuRecipeImage/menu-recipe-image-by-menu-recipe-id/${menuRecipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe images for menuRecipeId ${menuRecipeId}`);
  }
};

export const getMenuRecipeImageById = async (id: number): Promise<MenuRecipeImageDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/MenuRecipeImage/menu-recipe-image-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe image with id ${id}`);
  }
};

export const uploadMenuRecipeImage = async (formData: FormData): Promise<MenuRecipeImageDTO> => {
  try {
    const response = await apiClient.post("/MenuRecipeImage/menu-recipe-image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload menu recipe image");
  }
};

export const uploadMenuRecipeImages = async (formData: FormData): Promise<MenuRecipeImageDTO[]> => {
  try {
    const response = await apiClient.post("/MenuRecipeImage/menu-recipe-images-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload menu recipe images");
  }
};

export const updateMenuRecipeImage = async (id: number, imageData: MenuRecipeImageDTO): Promise<MenuRecipeImageDTO> => { // id: string -> number
  try {
    const response = await apiClient.put(`/MenuRecipeImage/menu-recipe-image-updation/${id}`, imageData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu recipe image with id ${id}`);
  }
};

export const deleteMenuRecipeImage = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/MenuRecipeImage/menu-recipe-image-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu recipe image with id ${id}`);
  }
};