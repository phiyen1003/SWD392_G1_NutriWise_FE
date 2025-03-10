// src/api/healthMetricApi.ts
import apiClient from "./apiClient";
import { HealthMetricDTO, UpdateHealthMetricDTO } from "../types/types"; // Import từ types.ts

export const getAllHealthMetrics = async (): Promise<HealthMetricDTO[]> => {
  try {
    const response = await apiClient.get("/HealthMetric/all-health-metrics");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health metrics");
  }
};

export const getByHealthProfileId = async (healthProfileId: number): Promise<HealthMetricDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(`/HealthMetric/health-metric-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health metrics for health profile ${healthProfileId}`);
  }
};

export const getHealthMetricById = async (id: number): Promise<HealthMetricDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/HealthMetric/health-metric-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health metric with id ${id}`);
  }
};

export const createHealthMetric = async (healthMetric: HealthMetricDTO): Promise<HealthMetricDTO> => { // Sử dụng HealthMetricDTO
  try {
    const response = await apiClient.post("/HealthMetric/health-metric-creation", healthMetric);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create health metric");
  }
};

export const updateHealthMetric = async (id: number, healthMetric: UpdateHealthMetricDTO): Promise<HealthMetricDTO> => { // id: string -> number, dùng UpdateHealthMetricDTO
  try {
    const response = await apiClient.put(`/HealthMetric/health-metric-updation/${id}`, healthMetric);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update health metric with id ${id}`);
  }
};

export const deleteHealthMetric = async (id: number): Promise<void> => { // id: string -> number, sửa endpoint
  try {
    const response = await apiClient.delete(`/HealthMetric/health-metric-deletion/${id}`); // Xóa "/api" thừa
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete health metric with id ${id}`);
  }
};

export const getByDateRange = async (healthProfileId: number, startDate: string, endDate: string): Promise<HealthMetricDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(
      `/HealthMetric/health-metric-by-health-profile-id-date-range/${healthProfileId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health metrics by date range");
  }
};