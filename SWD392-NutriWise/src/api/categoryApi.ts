// src/api/categoryApi.ts
import apiClient from "./apiClient";
import { CategoryDTO, UpdateCategoryDTO } from "../types/types"; // Import từ types.ts

// Sử dụng CategoryDTO thay vì định nghĩa mới
// export interface Category {
//   id: string; // Sửa thành number để khớp với CategoryDTO
//   name: string; // Cần nullable
//   description?: string;
// }

export const getAllCategories = async (): Promise<CategoryDTO[]> => {
  try {
    const response = await apiClient.get("/Category/all-categories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (id: number): Promise<CategoryDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/Category/category-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch category with id ${id}`);
  }
};

export const createCategory = async (category: CategoryDTO): Promise<CategoryDTO> => { // Sử dụng CategoryDTO
  try {
    const response = await apiClient.post("/Category/category-creation", category);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create category");
  }
};

export const updateCategory = async (id: number, category: UpdateCategoryDTO): Promise<CategoryDTO> => { // id: string -> number, dùng UpdateCategoryDTO
  try {
    const response = await apiClient.put(`/Category/category-updation/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update category with id ${id}`);
  }
};

export const deleteCategory = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/Category/category-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete category with id ${id}`);
  }
};

export const searchCategory = async (query: string): Promise<CategoryDTO[]> => {
  try {
    const response = await apiClient.get(`/Category/category-search?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search categories");
  }
};