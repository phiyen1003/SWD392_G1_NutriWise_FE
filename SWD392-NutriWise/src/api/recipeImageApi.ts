import apiClient from "./apiClient";

export interface RecipeImage {
  id: string;
  recipeId: string;
  fileName: string;
  url: string;
}

export const getAllRecipeImages = async (): Promise<RecipeImage[]> => {
  try {
    const response = await apiClient.get("/RecipeImage/GetAllRecipeImages");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recipe images");
  }
};

export const getRecipeImagesByRecipeId = async (recipeId: string): Promise<RecipeImage[]> => {
  try {
    const response = await apiClient.get(`/RecipeImage/GetRecipeImagesByRecipeId/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch images for recipe ${recipeId}`);
  }
};

export const getRecipeImageById = async (id: string): Promise<RecipeImage> => {
  try {
    const response = await apiClient.get(`/RecipeImage/GetRecipeImageById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe image with id ${id}`);
  }
};

export const uploadRecipeImage = async (recipeId: string, file: File): Promise<RecipeImage> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("recipeId", recipeId);
    const response = await apiClient.post("/RecipeImage/UploadRecipeImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload recipe image");
  }
};

export const uploadRecipeImages = async (recipeId: string, files: File[]): Promise<RecipeImage[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("recipeId", recipeId);
    const response = await apiClient.post("/RecipeImage/UploadRecipeImages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload recipe images");
  }
};

export const updateRecipeImage = async (id: string, file: File): Promise<RecipeImage> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.put(`/RecipeImage/UpdateRecipeImage/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe image with id ${id}`);
  }
};

export const deleteRecipeImage = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/RecipeImage/DeleteRecipeImage/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe image with id ${id}`);
  }
};