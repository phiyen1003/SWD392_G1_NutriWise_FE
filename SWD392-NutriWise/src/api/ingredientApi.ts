// import apiClient from "./apiClient";

// export interface Ingredient {
//   id: string;
//   name: string;
//   description?: string;
// }

// export const getAllIngredients = async (): Promise<Ingredient[]> => {
//   try {
//     const response = await apiClient.get("/Ingredient/GetAllIngredients");
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch ingredients");
//   }
// };

// export const getIngredientById = async (id: string): Promise<Ingredient> => {
//   try {
//     const response = await apiClient.get(`/Ingredient/GetIngredientById/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch ingredient with id ${id}`);
//   }
// };

// export const createIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
//   try {
//     const response = await apiClient.post("/Ingredient/CreateIngredient", ingredient);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create ingredient");
//   }
// };

// export const updateIngredient = async (id: string, ingredient: Ingredient): Promise<Ingredient> => {
//   try {
//     const response = await apiClient.put(`/Ingredient/UpdateIngredient/${id}`, ingredient);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update ingredient with id ${id}`);
//   }
// };

// export const deleteIngredient = async (id: string): Promise<void> => {
//   try {
//     await apiClient.delete(`/Ingredient/DeleteIngredient/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to delete ingredient with id ${id}`);
//   }
// };

// export const searchIngredient = async (query: string): Promise<Ingredient[]> => {
//   try {
//     const response = await apiClient.get(`/Ingredient/SearchIngredient?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to search ingredients");
//   }
// };


import apiClient from "./apiClient";

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
}

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  try {
    return [
      { id: "1", name: "Tomato", description: "Fresh red tomatoes" },
      { id: "2", name: "Chicken", description: "Lean chicken breast" },
    ];
  } catch (error) {
    throw new Error("Failed to fetch ingredients");
  }
};

export const getIngredientById = async (id: string): Promise<Ingredient> => {
  try {
    return { id, name: `Ingredient ${id}`, description: `Mock ingredient ${id}` };
  } catch (error) {
    throw new Error(`Failed to fetch ingredient with id ${id}`);
  }
};

export const createIngredient = async (ingredient: Ingredient): Promise<Ingredient> => {
  try {
    return { ...ingredient, id: "new-id" };
  } catch (error) {
    throw new Error("Failed to create ingredient");
  }
};

export const updateIngredient = async (id: string, ingredient: Ingredient): Promise<Ingredient> => {
  try {
    return { ...ingredient, id };
  } catch (error) {
    throw new Error(`Failed to update ingredient with id ${id}`);
  }
};

export const deleteIngredient = async (id: string): Promise<void> => {
  try {
    console.log(`Deleted ingredient with id ${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ingredient with id ${id}`);
  }
};

export const searchIngredient = async (query: string): Promise<Ingredient[]> => {
  try {
    return [
      { id: "1", name: "Tomato", description: "Fresh red tomatoes" },
    ].filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  } catch (error) {
    throw new Error("Failed to search ingredients");
  }
};