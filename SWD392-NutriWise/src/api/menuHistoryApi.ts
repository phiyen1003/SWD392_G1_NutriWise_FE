import apiClient from "./apiClient";

export interface MenuHistory {
  id: string;
  healthProfileId: string;
  menuId: string;
  date: string;
}

export const getAllMenuHistories = async (): Promise<MenuHistory[]> => {
  try {
    const response = await apiClient.get("/MenuHistory/GetAllMenuHistories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch menu histories");
  }
};

export const getByHealthProfileId = async (healthProfileId: string): Promise<MenuHistory[]> => {
  try {
    const response = await apiClient.get(`/MenuHistory/GetByHealthProfileId/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu histories for health profile ${healthProfileId}`);
  }
};

export const getMenuHistoryById = async (id: string): Promise<MenuHistory> => {
  try {
    const response = await apiClient.get(`/MenuHistory/GetMenuHistoryById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch menu history with id ${id}`);
  }
};

export const createMenuHistory = async (menuHistory: MenuHistory): Promise<MenuHistory> => {
  try {
    const response = await apiClient.post("/MenuHistory/CreateMenuHistory", menuHistory);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create menu history");
  }
};

export const updateMenuHistory = async (id: string, menuHistory: MenuHistory): Promise<MenuHistory> => {
  try {
    const response = await apiClient.put(`/MenuHistory/UpdateMenuHistory/${id}`, menuHistory);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update menu history with id ${id}`);
  }
};

export const deleteMenuHistory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/MenuHistory/DeleteMenuHistory/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete menu history with id ${id}`);
  }
};

export const searchByDateRange = async (healthProfileId: string, startDate: string, endDate: string): Promise<MenuHistory[]> => {
  try {
    const response = await apiClient.get(`/MenuHistory/SearchByDateRange?healthProfileId=${healthProfileId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search menu histories by date range");
  }
};