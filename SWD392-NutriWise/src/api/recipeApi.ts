// import apiClient from "./apiClient";

// export interface Recipe {
//   id: string;
//   title: string;
//   description?: string;
//   categoryId?: string;
// }

// export const getAllRecipes = async (): Promise<Recipe[]> => {
//   try {
//     const response = await apiClient.get("/Recipe/GetAllRecipes");
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch recipes");
//   }
// };

// export const getRecipeById = async (id: string): Promise<Recipe> => {
//   try {
//     const response = await apiClient.get(`/Recipe/GetRecipeById/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch recipe with id ${id}`);
//   }
// };

// export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
//   try {
//     const response = await apiClient.post("/Recipe/CreateRecipe", recipe);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create recipe");
//   }
// };

// export const updateRecipe = async (id: string, recipe: Recipe): Promise<Recipe> => {
//   try {
//     const response = await apiClient.put(`/Recipe/UpdateRecipe/${id}`, recipe);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update recipe with id ${id}`);
//   }
// };

// export const deleteRecipe = async (id: string): Promise<void> => {
//   try {
//     await apiClient.delete(`/Recipe/DeleteRecipe/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to delete recipe with id ${id}`);
//   }
// };

// export const searchRecipe = async (query: string): Promise<Recipe[]> => {
//   try {
//     const response = await apiClient.get(`/Recipe/SearchRecipe?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to search recipes");
//   }
// };

// export const getRecipesByCategory = async (categoryId: string): Promise<Recipe[]> => {
//   try {
//     const response = await apiClient.get(`/Recipe/GetRecipesByCategory/${categoryId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch recipes for category ${categoryId}`);
//   }
// };

import apiClient from "./apiClient";

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
}

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    return [
      { id: "1", title: "Healthy Salad", description: "A fresh and healthy salad recipe", categoryId: "1" },
      { id: "2", title: "Grilled Chicken", description: "A protein-packed grilled chicken recipe", categoryId: "2" },
      { id: "3", title: "Veggie Soup", description: "A warm and comforting veggie soup", categoryId: "3" },
    ];
  } catch (error) {
    throw new Error("Failed to fetch recipes");
  }
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  try {
    return { id, title: `Recipe ${id}`, description: `Mock recipe ${id}`, categoryId: "1" };
  } catch (error) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }
};

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
  try {
    return { ...recipe, id: "new-id" };
  } catch (error) {
    throw new Error("Failed to create recipe");
  }
};

export const updateRecipe = async (id: string, recipe: Recipe): Promise<Recipe> => {
  try {
    return { ...recipe, id };
  } catch (error) {
    throw new Error(`Failed to update recipe with id ${id}`);
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    console.log(`Deleted recipe with id ${id}`);
  } catch (error) {
    throw new Error(`Failed to delete recipe with id ${id}`);
  }
};

export const searchRecipe = async (query: string): Promise<Recipe[]> => {
  try {
    return [
      { id: "1", title: "Healthy Salad", description: "A fresh and healthy salad recipe", categoryId: "1" },
    ].filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  } catch (error) {
    throw new Error("Failed to search recipes");
  }
};

export const getRecipesByCategory = async (categoryId: string): Promise<Recipe[]> => {
  try {
    return [
      { id: "1", title: "Healthy Salad", description: "A fresh and healthy salad recipe", categoryId },
    ];
  } catch (error) {
    throw new Error(`Failed to fetch recipes for category ${categoryId}`);
  }
};