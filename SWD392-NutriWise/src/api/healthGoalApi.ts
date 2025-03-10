// src/api/healthGoalApi.ts
import apiClient from "./apiClient";
import { HealthGoalDTO, UpdateHealthGoalDTO } from "../types/types"; // Import từ types.ts

export const getAllHealthGoals = async (): Promise<HealthGoalDTO[]> => {
  try {
    const response = await apiClient.get("/HealthGoal/all-health-goal");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch health goals");
  }
};

export const getHealthGoalById = async (id: number): Promise<HealthGoalDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/HealthGoal/health-goal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health goal with id ${id}`);
  }
};

export const createHealthGoal = async (healthGoal: HealthGoalDTO): Promise<HealthGoalDTO> => { // Sử dụng HealthGoalDTO
  try {
    const response = await apiClient.post("/HealthGoal/health-goal-creation", healthGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create health goal");
  }
};

export const updateHealthGoal = async (id: number, healthGoal: UpdateHealthGoalDTO): Promise<HealthGoalDTO> => { // id: string -> number, dùng UpdateHealthGoalDTO
  try {
    const response = await apiClient.put(`/HealthGoal/health-goal-updation/${id}`, healthGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update health goal with id ${id}`);
  }
};

export const deleteHealthGoal = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/HealthGoal/health-goal-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete health goal with id ${id}`);
  }
};

export const searchHealthGoal = async (query: string): Promise<HealthGoalDTO[]> => {
  try {
    const response = await apiClient.get(`/HealthGoal/health-goal-search?name=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search health goals");
  }
};