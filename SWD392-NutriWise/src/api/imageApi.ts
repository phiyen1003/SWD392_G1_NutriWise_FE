// src/api/imageApi.ts
import apiClient from "./apiClient";

export const getMenuRecipeImage = async (fileName: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/Image/all-menu-recipe-images/${fileName}`, {
      responseType: "blob", // Đảm bảo response là Blob cho hình ảnh
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe image ${fileName}`);
  }
};