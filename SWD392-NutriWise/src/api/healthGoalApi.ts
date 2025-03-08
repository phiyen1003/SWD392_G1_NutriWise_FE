import apiClient from "./apiClient";

export interface HealthGoal {
  id: string;
  name: string;
  description?: string;
}

export const getAllHealthGoals = async (): Promise<HealthGoal[]> => {
  try {
    const response = await apiClient.get("/HealthGoal/GetAllHealthGoals");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health goals");
  }
};

export const getHealthGoalById = async (id: string): Promise<HealthGoal> => {
  try {
    const response = await apiClient.get(`/HealthGoal/GetHealthGoalById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health goal with id ${id}`);
  }
};

export const createHealthGoal = async (healthGoal: HealthGoal): Promise<HealthGoal> => {
  try {
    const response = await apiClient.post("/HealthGoal/CreateHealthGoal", healthGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create health goal");
  }
};

export const updateHealthGoal = async (id: string, healthGoal: HealthGoal): Promise<HealthGoal> => {
  try {
    const response = await apiClient.put(`/HealthGoal/UpdateHealthGoal/${id}`, healthGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update health goal with id ${id}`);
  }
};

export const deleteHealthGoal = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/HealthGoal/DeleteHealthGoal/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete health goal with id ${id}`);
  }
};

export const searchHealthGoal = async (query: string): Promise<HealthGoal[]> => {
  try {
    const response = await apiClient.get(`/HealthGoal/SearchHealthGoal?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search health goals");
  }
};