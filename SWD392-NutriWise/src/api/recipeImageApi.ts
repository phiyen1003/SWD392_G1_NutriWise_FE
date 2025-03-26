// src/api/recipeImageApi.ts
import apiClient from "./apiClient";
import { RecipeImageDTO } from "../types/types";

// Lấy tất cả RecipeImage với phân trang và lọc
export const getAllRecipeImages = async (
  pageNumber?: number,
  pageSize?: number,
  orderBy?: string,
  uploadedDateMin?: string,
  uploadedDateMax?: string,
  combineWith?: number
): Promise<RecipeImageDTO[]> => {
  try {
    const params: any = {};
    if (pageNumber) {
      if (pageNumber < 1) throw new Error("PageNumber must be greater than 0");
      params["PageNumber"] = pageNumber;
    }
    if (pageSize) {
      if (pageSize < 1) throw new Error("PageSize must be greater than 0");
      params["PageSize"] = pageSize;
    }
    if (orderBy) params["OrderBy"] = orderBy;
    if (uploadedDateMin) params["UploadedDate.Min"] = uploadedDateMin;
    if (uploadedDateMax) params["UploadedDate.Max"] = uploadedDateMax;
    if (combineWith !== undefined) {
      if (combineWith !== 0 && combineWith !== 1) {
        throw new Error("CombineWith must be either 0 or 1");
      }
      params["CombineWith"] = combineWith;
    }

    const response = await apiClient.get("/RecipeImage/all-recipe-images", { params });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch recipe images";
    throw new Error(errorMessage);
  }
};

// Lấy danh sách RecipeImage theo RecipeId với phân trang
export const getRecipeImagesByRecipeId = async (
  recipeId: number,
  params?: {
    PageNumber?: number;
    PageSize?: number;
    OrderBy?: string;
  }
): Promise<RecipeImageDTO[]> => {
  try {
    if (!recipeId || recipeId <= 0) {
      throw new Error("Invalid RecipeId: RecipeId must be a positive number");
    }
    if (params?.PageNumber && params.PageNumber < 1) {
      throw new Error("PageNumber must be greater than 0");
    }
    if (params?.PageSize && params.PageSize < 1) {
      throw new Error("PageSize must be greater than 0");
    }
    const response = await apiClient.get(`/RecipeImage/recipe-images-by-recipe-id/${recipeId}`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch images for recipe ${recipeId}`;
    throw new Error(errorMessage);
  }
};

// Lấy RecipeImage theo ID
export const getRecipeImageById = async (id: number): Promise<RecipeImageDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    const response = await apiClient.get(`/RecipeImage/recipe-image-by-id/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to fetch recipe image with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Upload một hình ảnh cho công thức
export const uploadRecipeImage = async (recipeId: number, file: File): Promise<RecipeImageDTO> => {
  try {
    if (!recipeId || recipeId <= 0) {
      throw new Error("Invalid RecipeId: RecipeId must be a positive number");
    }
    if (!file) {
      throw new Error("File is required");
    }
    const formData = new FormData();
    formData.append("recipeId", recipeId.toString());
    formData.append("imageFile", file); // Sử dụng "imageFile" theo định nghĩa API
    const response = await apiClient.post("/RecipeImage/recipe-image-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to upload recipe image with file";
    throw new Error(errorMessage);
  }
};

// Upload nhiều hình ảnh cho công thức
export const uploadRecipeImages = async (recipeId: number, files: File[]): Promise<RecipeImageDTO[]> => {
  try {
    if (!recipeId || recipeId <= 0) {
      throw new Error("Invalid RecipeId: RecipeId must be a positive number");
    }
    if (!files || files.length === 0) {
      throw new Error("At least one file is required");
    }
    const formData = new FormData();
    formData.append("recipeId", recipeId.toString());
    files.forEach((file) => {
      formData.append("files", file); // Đảm bảo tên trường là "files"
    });

    const response = await apiClient.post("/RecipeImage/recipe-images-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to upload recipe images";
    throw new Error(errorMessage);
  }
};

// Cập nhật hình ảnh công thức
export const updateRecipeImage = async (id: number, file: File): Promise<RecipeImageDTO> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    if (!file) {
      throw new Error("File is required");
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.put(`/RecipeImage/recipe-image-updation/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to update recipe image with id ${id}`;
    throw new Error(errorMessage);
  }
};

// Xóa hình ảnh công thức
export const deleteRecipeImage = async (id: number): Promise<void> => {
  try {
    if (!id || id <= 0) {
      throw new Error("Invalid ID: ID must be a positive number");
    }
    await apiClient.delete(`/RecipeImage/recipe-image-deletion/${id}`);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || `Failed to delete recipe image with id ${id}`;
    throw new Error(errorMessage);
  }
};