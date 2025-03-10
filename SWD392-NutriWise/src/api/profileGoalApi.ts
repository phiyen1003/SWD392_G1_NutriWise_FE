// src/api/profileGoalApi.ts
import apiClient from "./apiClient";
import { ProfileGoalDTO, UpdateProfileGoalDTO } from "../types/types"; // Import từ types.ts

export const getAllProfileGoals = async (): Promise<ProfileGoalDTO[]> => {
  try {
    const response = await apiClient.get("/ProfileGoal/all-profile-goal");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch profile goals");
  }
};

export const getProfileGoalById = async (id: number): Promise<ProfileGoalDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/ProfileGoal/profile-goal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goal with id ${id}`);
  }
};

export const getProfileGoalsByHealthProfileId = async (healthProfileId: number): Promise<ProfileGoalDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(`/ProfileGoal/profile-goals-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goals for health profile ${healthProfileId}`);
  }
};

export const getProfileGoalsByHealthGoalId = async (healthGoalId: number): Promise<ProfileGoalDTO[]> => { // healthGoalId: string -> number
  try {
    const response = await apiClient.get(`/ProfileGoal/profile-goal-by-health-goal-id/${healthGoalId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goals for health goal ${healthGoalId}`);
  }
};

export const createProfileGoal = async (profileGoal: ProfileGoalDTO): Promise<ProfileGoalDTO> => { // Sử dụng ProfileGoalDTO
  try {
    const response = await apiClient.post("/ProfileGoal/profile-goal-creation", profileGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create profile goal");
  }
};

export const updateProfileGoal = async (id: number, profileGoal: UpdateProfileGoalDTO): Promise<ProfileGoalDTO> => { // id: string -> number, dùng UpdateProfileGoalDTO
  try {
    const response = await apiClient.put(`/ProfileGoal/profile-goal-updation/${id}`, profileGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile goal with id ${id}`);
  }
};

export const deleteProfileGoal = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/ProfileGoal/profile-goal-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete profile goal with id ${id}`);
  }
};