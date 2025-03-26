import apiClient from "./apiClient";
import { MenuRecipeImageDTO } from "../types/types"; // Import từ types.ts

// Interface để định nghĩa các query parameters cho getAllMenuRecipeImages
interface GetAllMenuRecipeImagesParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  uploadedDateMin?: string; // Sử dụng camelCase cho consistency
  uploadedDateMax?: string; // Sử dụng camelCase cho consistency
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

// Hàm getAllMenuRecipeImages với các query parameters tùy chọn
export const getAllMenuRecipeImages = async (params: GetAllMenuRecipeImagesParams = {}): Promise<MenuRecipeImageDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, uploadedDateMin, uploadedDateMax, combineWith } = params;

    // Tạo object chứa các query parameters, chỉ thêm những tham số có giá trị
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (pageNumber !== undefined) queryParams.PageNumber = pageNumber;
    if (pageSize !== undefined) queryParams.PageSize = pageSize;
    if (orderBy !== undefined) queryParams.OrderBy = orderBy;
    if (uploadedDateMin !== undefined) queryParams["UploadedDate.Min"] = uploadedDateMin; // Đảm bảo key đúng với API
    if (uploadedDateMax !== undefined) queryParams["UploadedDate.Max"] = uploadedDateMax; // Đảm bảo key đúng với API
    if (combineWith !== undefined) queryParams.CombineWith = combineWith;

    const response = await apiClient.get("/MenuRecipeImage/all-menu-recipe-images", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch menu recipe images");
  }
};

export const getMenuRecipeImageByMenuRecipeId = async (menuRecipeId: number): Promise<MenuRecipeImageDTO[]> => {
  try {
    const response = await apiClient.get(`/MenuRecipeImage/menu-recipe-image-by-menu-recipe-id/${menuRecipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe images for menuRecipeId ${menuRecipeId}`);
  }
};

export const getMenuRecipeImageById = async (id: number): Promise<MenuRecipeImageDTO> => {
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

// src/api/menuRecipeImageApi.ts
export const updateMenuRecipeImage = async (id: number, formData: FormData): Promise<MenuRecipeImageDTO> => {
  try {
    const response = await apiClient.put(`/MenuRecipeImage/menu-recipe-image-updation/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu recipe image with id ${id}`);
  }
};

export const deleteMenuRecipeImage = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/MenuRecipeImage/menu-recipe-image-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu recipe image with id ${id}`);
  }
};