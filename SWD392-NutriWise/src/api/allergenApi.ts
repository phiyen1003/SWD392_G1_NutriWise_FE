import apiClient from "./apiClient";

export interface Allergen {
  id: string;
  name: string;
  description?: string;
}

export const getAllAllergens = async (): Promise<Allergen[]> => {
  try {
    const response = await apiClient.get("/Allergen/GetAllAllergens");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch allergens");
  }
};

export const getAllergenById = async (id: string): Promise<Allergen> => {
  try {
    const response = await apiClient.get(`/Allergen/GetAllergenById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch allergen with id ${id}`);
  }
};

export const createAllergen = async (allergen: Allergen): Promise<Allergen> => {
  try {
    const response = await apiClient.post("/Allergen/CreateAllergen", allergen);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create allergen");
  }
};

export const updateAllergen = async (id: string, allergen: Allergen): Promise<Allergen> => {
  try {
    const response = await apiClient.put(`/Allergen/UpdateAllergen/${id}`, allergen);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update allergen with id ${id}`);
  }
};

export const deleteAllergen = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/Allergen/DeleteAllergen/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete allergen with id ${id}`);
  }
};

export const searchAllergen = async (query: string): Promise<Allergen[]> => {
  try {
    const response = await apiClient.get(`/Allergen/SearchAllergen?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search allergens");
  }
};