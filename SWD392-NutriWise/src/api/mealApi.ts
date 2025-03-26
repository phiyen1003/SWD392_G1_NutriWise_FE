import apiClient from "./apiClient";
import { MealDTO, UpdateMealDTO } from "../types/types";

// Interface để định nghĩa các query parameters cho getAllMeals
interface GetAllMealsParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string; // Sửa typo từ "orderær" thành "orderBy"
  mealDateMin?: string; // Giữ nguyên tên trong code, sẽ ánh xạ đúng trong query
  mealDateMax?: string; // Giữ nguyên tên trong code, sẽ ánh xạ đúng trong query
  mealTime?: string;
  combineWith?: 0 | 1; // Chỉ cho phép giá trị 0 hoặc 1 theo API
}

export const getAllMeals = async (params: GetAllMealsParams = {}): Promise<MealDTO[]> => {
  try {
    const { pageNumber, pageSize, orderBy, mealDateMin, mealDateMax, mealTime, combineWith } = params;

    // Tạo object chứa các query parameters, ánh xạ tên đúng với API
    const queryParams: Record<string, string | number | boolean | undefined> = {
      PageNumber: pageNumber,
      PageSize: pageSize,
      OrderBy: orderBy,
      "MealDate.Min": mealDateMin, // Ánh xạ đúng tên API
      "MealDate.Max": mealDateMax, // Ánh xạ đúng tên API
      MealTime: mealTime,
      CombineWith: combineWith,
    };

    const response = await apiClient.get("/Meal/all-meals", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch meals");
  }
};

export const getMealById = async (id: number): Promise<MealDTO> => {
  try {
    const response = await apiClient.get(`/Meal/meal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meal with id ${id}`);
  }
};

export const getMealsByHealthProfile = async (healthProfileId: number): Promise<MealDTO[]> => {
  try {
    const response = await apiClient.get(`/Meal/meal-by-health-profile-id/${healthProfileId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meals for health profile ${healthProfileId}`);
  }
};

export const getMealsByDateRange = async (
  startDate: string,
  endDate: string,
  healthProfileId?: number,
  params?: { pageNumber?: number; pageSize?: number; orderBy?: string }
): Promise<MealDTO[]> => {
  try {
    const response = await apiClient.get(`/Meal/meal-by-date-range`, {
      params: { startDate, endDate, healthProfileId, ...params },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch meals by date range");
  }
};

export const createMeal = async (meal: MealDTO): Promise<MealDTO> => {
  try {
    const response = await apiClient.post("/Meal/meal-creation", meal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create meal");
  }
};

export const updateMeal = async (id: number, meal: UpdateMealDTO): Promise<MealDTO> => {
  try {
    const response = await apiClient.put(`/Meal/meal-updation/${id}`, meal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update meal with id ${id}`);
  }
};

export const deleteMeal = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Meal/meal-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete meal with id ${id}`);
  }
};