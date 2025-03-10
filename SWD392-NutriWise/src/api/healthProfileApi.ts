// src/api/healthProfileApi.ts
import apiClient from "./apiClient";
import { HealthProfileDTO, UpdateHealthProfileDTO } from "../types/types"; // Import từ types.ts

export const getAllHealthProfiles = async (): Promise<HealthProfileDTO[]> => {
  try {
    const response = await apiClient.get("/HealthProfile/all-health-profiles");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health profiles");
  }
};

export const getHealthProfileById = async (id: number): Promise<HealthProfileDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/HealthProfile/health-profile-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health profile with id ${id}`);
  }
};

export const createHealthProfile = async (healthProfile: HealthProfileDTO): Promise<HealthProfileDTO> => { // Sử dụng HealthProfileDTO
  try {
    const response = await apiClient.post("/HealthProfile/health-profile-creation", healthProfile);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create health profile");
  }
};

export const updateHealthProfile = async (id: number, healthProfile: UpdateHealthProfileDTO): Promise<HealthProfileDTO> => { // id: string -> number, dùng UpdateHealthProfileDTO
  try {
    const response = await apiClient.put(`/HealthProfile/health-profile-updation/${id}`, healthProfile);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update health profile with id ${id}`);
  }
};

export const deleteHealthProfile = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/HealthProfile/health-profile-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete health profile with id ${id}`);
  }
};

export const searchHealthProfile = async (query: string): Promise<HealthProfileDTO[]> => {
  try {
    const response = await apiClient.get(`/HealthProfile/health-profile-search?name=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search health profiles");
  }
};