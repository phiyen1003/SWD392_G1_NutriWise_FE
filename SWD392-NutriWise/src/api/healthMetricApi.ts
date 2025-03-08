import apiClient from "./apiClient";

export interface HealthMetric {
  id: string;
  healthProfileId: string;
  metricType: string;
  value: number;
  date: string;
}

export const getAllHealthMetrics = async (): Promise<HealthMetric[]> => {
  try {
    const response = await apiClient.get("/HealthMetric/GetAllHealthMetrics");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health metrics");
  }
};

export const getByHealthProfileId = async (healthProfileId: string): Promise<HealthMetric[]> => {
  try {
    const response = await apiClient.get(`/HealthMetric/GetByHealthProfileId/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health metrics for health profile ${healthProfileId}`);
  }
};

export const getHealthMetricById = async (id: string): Promise<HealthMetric> => {
  try {
    const response = await apiClient.get(`/HealthMetric/GetHealthMetricById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health metric with id ${id}`);
  }
};

export const createHealthMetric = async (healthMetric: HealthMetric): Promise<HealthMetric> => {
  try {
    const response = await apiClient.post("/HealthMetric/CreateHealthMetric", healthMetric);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create health metric");
  }
};

export const updateHealthMetric = async (id: string, healthMetric: HealthMetric): Promise<HealthMetric> => {
  try {
    const response = await apiClient.put(`/HealthMetric/UpdateHealthMetric/${id}`, healthMetric);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update health metric with id ${id}`);
  }
};

export const deleteHealthMetric = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/HealthMetric/DeleteHealthMetric/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete health metric with id ${id}`);
  }
};

export const getByDateRange = async (healthProfileId: string, startDate: string, endDate: string): Promise<HealthMetric[]> => {
  try {
    const response = await apiClient.get(`/HealthMetric/GetByDateRange/${healthProfileId}?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health metrics by date range");
  }
};