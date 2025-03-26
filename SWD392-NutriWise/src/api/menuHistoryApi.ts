import apiClient from "./apiClient";
import { MenuHistoryDTO, UpdateMenuHistoryDTO } from "../types/types"; // Import từ types.ts

// Interface để định nghĩa các query parameters cho getAllMenuHistories
interface GetAllMenuHistoriesParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  createdDateMin?: string; // Sử dụng camelCase cho consistency
  createdDateMax?: string; // Sử dụng camelCase cho consistency
  notes?: string;
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

// Hàm getAllMenuHistories với các query parameters tùy chọn
export const getAllMenuHistories = async (params: GetAllMenuHistoriesParams = {}): Promise<MenuHistoryDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, createdDateMin, createdDateMax, notes, combineWith } = params;

    // Tạo object chứa các query parameters, chỉ thêm những tham số có giá trị
    const queryParams: Record<string, string | number | boolean | undefined> = {};
    if (pageNumber !== undefined) queryParams.PageNumber = pageNumber;
    if (pageSize !== undefined) queryParams.PageSize = pageSize;
    if (orderBy !== undefined) queryParams.OrderBy = orderBy;
    if (createdDateMin !== undefined) queryParams["CreatedDate.Min"] = createdDateMin; // Đảm bảo key đúng với API
    if (createdDateMax !== undefined) queryParams["CreatedDate.Max"] = createdDateMax; // Đảm bảo key đúng với API
    if (notes !== undefined) queryParams.Notes = notes;
    if (combineWith !== undefined) queryParams.CombineWith = combineWith;

    const response = await apiClient.get("/MenuHistory/all-menu-histories", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch menu histories");
  }
};

export const getByHealthProfileId = async (healthProfileId: number): Promise<MenuHistoryDTO[]> => {
  try {
    const response = await apiClient.get(`/MenuHistory/menu-history-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu histories for health profile ${healthProfileId}`);
  }
};

export const getMenuHistoryById = async (id: number): Promise<MenuHistoryDTO> => {
  try {
    const response = await apiClient.get(`/MenuHistory/menu-history-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu history with id ${id}`);
  }
};

export const createMenuHistory = async (menuHistory: MenuHistoryDTO): Promise<MenuHistoryDTO> => {
  try {
    const response = await apiClient.post("/MenuHistory/menu-history-creation", menuHistory);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create menu history");
  }
};

export const updateMenuHistory = async (id: number, menuHistory: UpdateMenuHistoryDTO): Promise<MenuHistoryDTO> => {
  try {
    const response = await apiClient.put(`/MenuHistory/menu-history-updation/${id}`, menuHistory);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu history with id ${id}`);
  }
};

export const deleteMenuHistory = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/MenuHistory/menu-history-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu history with id ${id}`);
  }
};

export const searchByDateRange = async (healthProfileId: number, startDate: string, endDate: string): Promise<MenuHistoryDTO[]> => {
  try {
    const response = await apiClient.get(
      `/MenuHistory/menu-history-search-by-date-range?healthProfileId=${healthProfileId}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search menu histories by date range");
  }
};