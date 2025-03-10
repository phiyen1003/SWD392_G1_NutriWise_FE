// src/api/recipeHealthGoalApi.ts
import apiClient from "./apiClient";
import { RecipeHealthGoalDTO, UpdateRecipeHealthGoalDTO } from "../types/types"; // Import từ types.ts

export const getAllRecipeHealthGoals = async (): Promise<RecipeHealthGoalDTO[]> => {
  try {
    const response = await apiClient.get("/RecipeHealthGoal/all-recipe-health-goals");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recipe health goals");
  }
};

export const getById = async (id: number): Promise<RecipeHealthGoalDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/recipe-health-goal-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe health goal with id ${id}`);
  }
};

export const getByRecipeId = async (recipeId: number): Promise<RecipeHealthGoalDTO[]> => { // recipeId: string -> number
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/recipe-health-goal-by-recipe-id/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health goals for recipe ${recipeId}`);
  }
};

export const getByHealthGoalId = async (healthGoalId: number): Promise<RecipeHealthGoalDTO[]> => { // healthGoalId: string -> number
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/recipe-health-goal-by-health-goal-id/${healthGoalId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for health goal ${healthGoalId}`);
  }
};

export const createRecipeHealthGoal = async (recipeHealthGoal: RecipeHealthGoalDTO): Promise<RecipeHealthGoalDTO> => { // Sử dụng RecipeHealthGoalDTO
  try {
    const response = await apiClient.post("/RecipeHealthGoal/recipe-health-goal-creation", recipeHealthGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create recipe health goal");
  }
};

export const updateRecipeHealthGoal = async (id: number, recipeHealthGoal: UpdateRecipeHealthGoalDTO): Promise<RecipeHealthGoalDTO> => { // id: string -> number, dùng UpdateRecipeHealthGoalDTO
  try {
    const response = await apiClient.put(`/RecipeHealthGoal/recipe-health-goal-updation/${id}`, recipeHealthGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe health goal with id ${id}`);
  }
};

export const deleteRecipeHealthGoal = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/RecipeHealthGoal/recipe-health-goal-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe health goal with id ${id}`);
  }
};