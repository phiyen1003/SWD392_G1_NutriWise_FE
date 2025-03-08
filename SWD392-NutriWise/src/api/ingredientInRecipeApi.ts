import apiClient from "./apiClient";

export interface IngredientInRecipe {
  id: string;
  recipeId: string;
  ingredientId: string;
  quantity: number;
}

export const getAllIngredientInRecipes = async (): Promise<IngredientInRecipe[]> => {
  try {
    const response = await apiClient.get("/IngredientInRecipe/GetAll");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch ingredient in recipes");
  }
};

export const getById = async (id: string): Promise<IngredientInRecipe> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/GetById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredient in recipe with id ${id}`);
  }
};

export const getByRecipeId = async (recipeId: string): Promise<IngredientInRecipe[]> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/GetByRecipeId/${recipeId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ingredients for recipe ${recipeId}`);
  }
};

export const getByIngredientId = async (ingredientId: string): Promise<IngredientInRecipe[]> => {
  try {
    const response = await apiClient.get(`/IngredientInRecipe/GetByIngredientId/${ingredientId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch recipes for ingredient ${ingredientId}`);
  }
};

export const createIngredientInRecipe = async (ingredientInRecipe: IngredientInRecipe): Promise<IngredientInRecipe> => {
  try {
    const response = await apiClient.post("/IngredientInRecipe/Create", ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ingredient in recipe");
  }
};

export const updateIngredientInRecipe = async (id: string, ingredientInRecipe: IngredientInRecipe): Promise<IngredientInRecipe> => {
  try {
    const response = await apiClient.put(`/IngredientInRecipe/Update/${id}`, ingredientInRecipe);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update ingredient in recipe with id ${id}`);
  }
};

export const deleteIngredientInRecipe = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/IngredientInRecipe/Delete/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredient in recipe with id ${id}`);
  }
};

export const deleteByRecipeId = async (recipeId: string): Promise<void> => {
  try {
    await apiClient.delete(`/IngredientInRecipe/DeleteByRecipeId/${recipeId}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredients for recipe ${recipeId}`);
  }
};