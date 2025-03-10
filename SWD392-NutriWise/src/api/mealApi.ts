// src/api/mealApi.ts
import apiClient from "./apiClient";
import { MealDTO, UpdateMealDTO } from "../types/types"; // Import từ types.ts

export const getAllMeals = async (): Promise<MealDTO[]> => {
  try {
    const response = await apiClient.get("/Meal/all-meals");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch meals");
  }
};

export const getMealById = async (id: number): Promise<MealDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/Meal/meal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meal with id ${id}`);
  }
};

export const getMealsByHealthProfile = async (healthProfileId: number): Promise<MealDTO[]> => { // healthProfileId: string -> number
  try {
    const response = await apiClient.get(`/Meal/meal-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meals for health profile ${healthProfileId}`);
  }
};

export const getMealsByDateRange = async (startDate: string, endDate: string): Promise<MealDTO[]> => {
  try {
    const response = await apiClient.get(`/Meal/meal-by-date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch meals by date range");
  }
};

export const createMeal = async (meal: MealDTO): Promise<MealDTO> => { // Sử dụng MealDTO
  try {
    const response = await apiClient.post("/Meal/meal-creation", meal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create meal");
  }
};

export const updateMeal = async (id: number, meal: UpdateMealDTO): Promise<MealDTO> => { // id: string -> number, dùng UpdateMealDTO
  try {
    const response = await apiClient.put(`/Meal/meal-updation/${id}`, meal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update meal with id ${id}`);
  }
};

export const deleteMeal = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/Meal/meal-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete meal with id ${id}`);
  }
};