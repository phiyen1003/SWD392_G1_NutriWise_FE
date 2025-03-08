import apiClient from "./apiClient";

export interface RecipeHealthGoal {
  id: string;
  recipeId: string;
  healthGoalId: string;
}

export const getAllRecipeHealthGoals = async (): Promise<RecipeHealthGoal[]> => {
  try {
    const response = await apiClient.get("/RecipeHealthGoal/GetAll");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch recipe health goals");
  }
};

export const getById = async (id: string): Promise<RecipeHealthGoal> => {
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/GetById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipe health goal with id ${id}`);
  }
};

export const getByRecipeId = async (recipeId: string): Promise<RecipeHealthGoal[]> => {
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/GetByRecipeId/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch health goals for recipe ${recipeId}`);
  }
};

export const getByHealthGoalId = async (healthGoalId: string): Promise<RecipeHealthGoal[]> => {
  try {
    const response = await apiClient.get(`/RecipeHealthGoal/GetByHealthGoalId/${healthGoalId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for health goal ${healthGoalId}`);
  }
};

export const createRecipeHealthGoal = async (recipeHealthGoal: RecipeHealthGoal): Promise<RecipeHealthGoal> => {
  try {
    const response = await apiClient.post("/RecipeHealthGoal/Create", recipeHealthGoal);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create recipe health goal");
  }
};

export const updateRecipeHealthGoal = async (id: string, recipeHealthGoal: RecipeHealthGoal): Promise<RecipeHealthGoal> => {
  try {
    const response = await apiClient.put(`/RecipeHealthGoal/Update/${id}`, recipeHealthGoal);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update recipe health goal with id ${id}`);
  }
};

export const deleteRecipeHealthGoal = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/RecipeHealthGoal/Delete/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe health goal with id ${id}`);
  }
};