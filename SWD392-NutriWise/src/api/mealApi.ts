import apiClient from "./apiClient";

export interface Meal {
  id: string;
  healthProfileId: string;
  recipeId: string;
  date: string;
}

export const getAllMeals = async (): Promise<Meal[]> => {
  try {
    const response = await apiClient.get("/Meal/GetAllMeals");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch meals");
  }
};

export const getMealById = async (id: string): Promise<Meal> => {
  try {
    const response = await apiClient.get(`/Meal/GetMealById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meal with id ${id}`);
  }
};

export const getMealsByHealthProfile = async (healthProfileId: string): Promise<Meal[]> => {
  try {
    const response = await apiClient.get(`/Meal/GetMealsByHealthProfile/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meals for health profile ${healthProfileId}`);
  }
};

export const getMealsByDateRange = async (startDate: string, endDate: string): Promise<Meal[]> => {
  try {
    const response = await apiClient.get(`/Meal/GetMealsByDateRange?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch meals by date range");
  }
};

export const createMeal = async (meal: Meal): Promise<Meal> => {
  try {
    const response = await apiClient.post("/Meal/CreateMeal", meal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create meal");
  }
};

export const updateMeal = async (id: string, meal: Meal): Promise<Meal> => {
  try {
    const response = await apiClient.put(`/Meal/UpdateMeal/${id}`, meal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update meal with id ${id}`);
  }
};

export const deleteMeal = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/Meal/DeleteMeal/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete meal with id ${id}`);
  }
};