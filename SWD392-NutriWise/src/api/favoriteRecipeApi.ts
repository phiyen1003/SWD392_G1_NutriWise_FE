// import apiClient from "./apiClient";

// export interface FavoriteRecipe {
//   id: string;
//   userId: string;
//   recipeId: string;
//   createdAt: string;
// }

// export const getAllFavorites = async (): Promise<FavoriteRecipe[]> => {
//   try {
//     const response = await apiClient.get("/FavoriteRecipe/GetAllFavorites");
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch all favorites");
//   }
// };

// export const getUserFavorites = async (userId: string): Promise<FavoriteRecipe[]> => {
//   try {
//     const response = await apiClient.get(`/FavoriteRecipe/GetUserFavorites/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch favorites for user ${userId}`);
//   }
// };

// export const getFavoriteById = async (id: string): Promise<FavoriteRecipe> => {
//   try {
//     const response = await apiClient.get(`/FavoriteRecipe/GetFavoriteById/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch favorite with id ${id}`);
//   }
// };

// export const checkFavorite = async (userId: string, recipeId: string): Promise<boolean> => {
//   try {
//     const response = await apiClient.get(`/FavoriteRecipe/CheckFavorite?userId=${userId}&recipeId=${recipeId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to check favorite");
//   }
// };

// export const addFavorite = async (favorite: FavoriteRecipe): Promise<FavoriteRecipe> => {
//   try {
//     const response = await apiClient.post("/FavoriteRecipe/AddFavorite", favorite);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to add favorite");
//   }
// };

// export const updateFavorite = async (id: string, favorite: FavoriteRecipe): Promise<FavoriteRecipe> => {
//   try {
//     const response = await apiClient.put(`/FavoriteRecipe/UpdateFavorite/${id}`, favorite);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update favorite with id ${id}`);
//   }
// };

// export const removeFavorite = async (id: string): Promise<void> => {
//   try {
//     await apiClient.delete(`/FavoriteRecipe/RemoveFavorite/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to remove favorite with id ${id}`);
//   }
// };

// export const removeFavoriteByUserAndRecipe = async (userId: string, recipeId: string): Promise<void> => {
//   try {
//     await apiClient.delete(`FavoriteRecipe/RemoveFavoriteByUserAndRecipe?userId=${userId}&recipeId=${recipeId}`);
//   } catch (error) {
//     throw new Error("Failed to remove favorite by user and recipe");
//   }
// };

// export const toggleFavorite = async (userId: string, recipeId: string): Promise<FavoriteRecipe> => {
//   try {
//     const response = await apiClient.post("/FavoriteRecipe/ToggleFavorite", { userId, recipeId });
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to toggle favorite");
//   }
// };


import apiClient from "./apiClient";

export interface FavoriteRecipe {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
}

export const getAllFavorites = async (): Promise<FavoriteRecipe[]> => {
  try {
    return [
      { id: "1", userId: "user1", recipeId: "recipe1", createdAt: "2025-03-07" },
      { id: "2", userId: "user2", recipeId: "recipe2", createdAt: "2025-03-07" },
    ];
  } catch (error) {
    throw new Error("Failed to fetch all favorites");
  }
};

export const getUserFavorites = async (userId: string): Promise<FavoriteRecipe[]> => {
  try {
    return [
      { id: "1", userId, recipeId: "recipe1", createdAt: "2025-03-07" },
    ];
  } catch (error) {
    throw new Error(`Failed to fetch favorites for user ${userId}`);
  }
};

export const getFavoriteById = async (id: string): Promise<FavoriteRecipe> => {
  try {
    return { id, userId: "mock-user", recipeId: "mock-recipe", createdAt: "2025-03-07" };
  } catch (error) {
    throw new Error(`Failed to fetch favorite with id ${id}`);
  }
};

export const checkFavorite = async (userId: string, recipeId: string): Promise<boolean> => {
  try {
    return true; // Mock true
  } catch (error) {
    throw new Error("Failed to check favorite");
  }
};

export const addFavorite = async (favorite: FavoriteRecipe): Promise<FavoriteRecipe> => {
  try {
    return { ...favorite, id: "new-id" };
  } catch (error) {
    throw new Error("Failed to add favorite");
  }
};

export const updateFavorite = async (id: string, favorite: FavoriteRecipe): Promise<FavoriteRecipe> => {
  try {
    return { ...favorite, id };
  } catch (error) {
    throw new Error(`Failed to update favorite with id ${id}`);
  }
};

export const removeFavorite = async (id: string): Promise<void> => {
  try {
    console.log(`Removed favorite with id ${id}`);
  } catch (error) {
    throw new Error(`Failed to remove favorite with id ${id}`);
  }
};

export const removeFavoriteByUserAndRecipe = async (userId: string, recipeId: string): Promise<void> => {
  try {
    console.log(`Removed favorite for user ${userId} and recipe ${recipeId}`);
  } catch (error) {
    throw new Error("Failed to remove favorite by user and recipe");
  }
};

export const toggleFavorite = async (userId: string, recipeId: string): Promise<FavoriteRecipe> => {
  try {
    return { id: "new-id", userId, recipeId, createdAt: "2025-03-07" };
  } catch (error) {
    throw new Error("Failed to toggle favorite");
  }
};