// src/api/menuHistoryApi.ts
import apiClient from "./apiClient";
import { MenuHistoryDTO, UpdateMenuHistoryDTO } from "../types/types"; // Import từ types.ts

export const getAllMenuHistories = async (): Promise<MenuHistoryDTO[]> => {
  try {
    const response = await apiClient.get("/MenuHistory/all-menu-histories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch menu histories");
  }
};

export const getByHealthProfileId = async (healthProfileId: number): Promise<MenuHistoryDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(`/MenuHistory/menu-history-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu histories for health profile ${healthProfileId}`);
  }
};

export const getMenuHistoryById = async (id: number): Promise<MenuHistoryDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/MenuHistory/menu-history-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu history with id ${id}`);
  }
};

export const createMenuHistory = async (menuHistory: MenuHistoryDTO): Promise<MenuHistoryDTO> => { // Sử dụng MenuHistoryDTO
  try {
    const response = await apiClient.post("/MenuHistory/menu-history-creation", menuHistory);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create menu history");
  }
};

export const updateMenuHistory = async (id: number, menuHistory: UpdateMenuHistoryDTO): Promise<MenuHistoryDTO> => { // id: string -> number, dùng UpdateMenuHistoryDTO
  try {
    const response = await apiClient.put(`/MenuHistory/menu-history-updation/${id}`, menuHistory);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu history with id ${id}`);
  }
};

export const deleteMenuHistory = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/MenuHistory/menu-history-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu history with id ${id}`);
  }
};

export const searchByDateRange = async (healthProfileId: number, startDate: string, endDate: string): Promise<MenuHistoryDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(
      `/MenuHistory/menu-history-search-by-date-range?healthProfileId=${healthProfileId}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search menu histories by date range");
  }
};