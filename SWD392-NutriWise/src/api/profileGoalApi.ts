import apiClient from "./apiClient";

export interface ProfileGoal {
  id: string;
  healthProfileId: string;
  healthGoalId: string;
  targetValue: number;
  achieved: boolean;
}

export const getAllProfileGoals = async (): Promise<ProfileGoal[]> => {
  try {
    const response = await apiClient.get("/ProfileGoal/GetAllProfileGoals");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch profile goals");
  }
};

export const getProfileGoalById = async (id: string): Promise<ProfileGoal> => {
  try {
    const response = await apiClient.get(`/ProfileGoal/GetProfileGoalById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goal with id ${id}`);
  }
};

export const getProfileGoalsByHealthProfileId = async (healthProfileId: string): Promise<ProfileGoal[]> => {
  try {
    const response = await apiClient.get(`/ProfileGoal/GetProfileGoalsByHealthProfileId/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goals for health profile ${healthProfileId}`);
  }
};

export const getProfileGoalsByHealthGoalId = async (healthGoalId: string): Promise<ProfileGoal[]> => {
  try {
    const response = await apiClient.get(`/ProfileGoal/GetProfileGoalsByHealthGoalId/${healthGoalId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile goals for health goal ${healthGoalId}`);
  }
};

export const createProfileGoal = async (profileGoal: ProfileGoal): Promise<ProfileGoal> => {
  try {
    const response = await apiClient.post("/ProfileGoal/CreateProfileGoal", profileGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create profile goal");
  }
};

export const updateProfileGoal = async (id: string, profileGoal: ProfileGoal): Promise<ProfileGoal> => {
  try {
    const response = await apiClient.put(`/ProfileGoal/UpdateProfileGoal/${id}`, profileGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile goal with id ${id}`);
  }
};

export const deleteProfileGoal = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/ProfileGoal/DeleteProfileGoal/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete profile goal with id ${id}`);
  }
};