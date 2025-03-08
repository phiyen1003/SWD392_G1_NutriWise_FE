import apiClient from "./apiClient";

export const getMenuRecipeImage = async (fileName: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/Image/menu-recipe/${fileName}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch image ${fileName}`);
  }
};