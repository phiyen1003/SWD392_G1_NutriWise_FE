import apiClient from "./apiClient";
import { RecipeImageDTO } from "../types/types"; // Import từ types.ts

export const getAllRecipeImages = async (): Promise<RecipeImageDTO[]> => {
  try {
    const response = await apiClient.get("/RecipeImage/all-recipe-images");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recipe images");
  }
};

export const getRecipeImagesByRecipeId = async (recipeId: number): Promise<RecipeImageDTO[]> => {
  try {
    const response = await apiClient.get(`/RecipeImage/recipe-images-by-recipe-id/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch images for recipe ${recipeId}`);
  }
};

export const getRecipeImageById = async (id: number): Promise<RecipeImageDTO> => {
  try {
    const response = await apiClient.get(`/RecipeImage/recipe-image-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe image with id ${id}`);
  }
};

export const uploadRecipeImage = async (recipeId: number, imageUrl: string): Promise<RecipeImageDTO> => {
  try {
    const formData = new FormData();
    formData.append("recipeId", recipeId.toString());
    formData.append("imageUrl", imageUrl); // Gửi imageUrl như một chuỗi
    const response = await apiClient.post("/RecipeImage/recipe-image-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload recipe image with URL");
  }
};

export const uploadRecipeImages = async (recipeId: number, files: File[]): Promise<RecipeImageDTO[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("recipeId", recipeId.toString());
    const response = await apiClient.post("/RecipeImage/recipe-images-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload recipe images");
  }
};

export const updateRecipeImage = async (id: number, file: File): Promise<RecipeImageDTO> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.put(`/RecipeImage/recipe-image-updation/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe image with id ${id}`);
  }
};

export const deleteRecipeImage = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/RecipeImage/recipe-image-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe image with id ${id}`);
  }
};