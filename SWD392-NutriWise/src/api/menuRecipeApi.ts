import apiClient from "./apiClient";
import { MenuRecipeDTO, UpdateMenuRecipeDTO } from "../types/types"; // Import từ types.ts

// Interface để định nghĩa các query parameters cho getAllMenuRecipes
interface GetAllMenuRecipesParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  servingSizeMin?: number; // Sử dụng camelCase cho consistency
  servingSizeMax?: number; // Sử dụng camelCase cho consistency
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

// Hàm getAllMenuRecipes với các query parameters tùy chọn
export const getAllMenuRecipes = async (params: GetAllMenuRecipesParams = {}): Promise<MenuRecipeDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, servingSizeMin, servingSizeMax, combineWith } = params;

    // Tạo object chứa các query parameters, chỉ thêm những tham số có giá trị
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (pageNumber !== undefined) queryParams.PageNumber = pageNumber;
    if (pageSize !== undefined) queryParams.PageSize = pageSize;
    if (orderBy !== undefined) queryParams.OrderBy = orderBy;
    if (servingSizeMin !== undefined) queryParams["ServingSize.Min"] = servingSizeMin; // Đảm bảo key đúng với API
    if (servingSizeMax !== undefined) queryParams["ServingSize.Max"] = servingSizeMax; // Đảm bảo key đúng với API
    if (combineWith !== undefined) queryParams.CombineWith = combineWith;

    const response = await apiClient.get("/MenuRecipe/all-menu-recipes", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch menu recipes");
  }
};

export const getMenuRecipeById = async (id: number): Promise<MenuRecipeDTO> => {
  try {
    const response = await apiClient.get(`/MenuRecipe/menu-recipe-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipe with id ${id}`);
  }
};

export const getMenuRecipesByMenuHistoryId = async (menuHistoryId: number): Promise<MenuRecipeDTO[]> => {
  try {
    // Sửa endpoint để đúng với ngữ cảnh: lấy danh sách menu recipes theo menuHistoryId
    const response = await apiClient.get(`/MenuRecipe/menu-recipes-by-menu-history-id/${menuHistoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu recipes for menu history with id ${menuHistoryId}`);
  }
};

export const createMenuRecipe = async (menuRecipe: MenuRecipeDTO): Promise<MenuRecipeDTO> => {
  try {
    const response = await apiClient.post("/MenuRecipe/menu-recipe-creation", menuRecipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create menu recipe");
  }
};

export const updateMenuRecipe = async (id: number, menuRecipe: UpdateMenuRecipeDTO): Promise<MenuRecipeDTO> => {
  try {
    const response = await apiClient.put(`/MenuRecipe/menu-recipe-updation/${id}`, menuRecipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu recipe with id ${id}`);
  }
};

export const deleteMenuRecipe = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/MenuRecipe/menu-recipe-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu recipe with id ${id}`);
  }
};