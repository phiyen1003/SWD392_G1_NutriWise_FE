// src/api/allergenApi.ts
import apiClient from "./apiClient";
import { AllergenDTO, UpdateAllergenDTO } from "../types/types"; // Import từ types.ts

// Sử dụng AllergenDTO thay vì định nghĩa mới
// export interface Allergen {
//   id: string; // Sửa thành number để khớp với AllergenDTO
//   name: string; // Cần nullable
//   description?: string;
// }

export const getAllAllergens = async (): Promise<AllergenDTO[]> => {
  try {
    const response = await apiClient.get("/Allergen/all-allergens");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch allergens");
  }
};

export const getAllergenById = async (id: number): Promise<AllergenDTO> => { // id: string -> number
  try {
    const response = await apiClient.get(`/Allergen/allergen-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch allergen with id ${id}`);
  }
};

export const createAllergen = async (allergen: AllergenDTO): Promise<AllergenDTO> => { // Sử dụng AllergenDTO
  try {
    const response = await apiClient.post("/Allergen/allergen-creation", allergen);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create allergen");
  }
};

export const updateAllergen = async (id: number, allergen: UpdateAllergenDTO): Promise<AllergenDTO> => { // id: string -> number, dùng UpdateAllergenDTO
  try {
    const response = await apiClient.put(`/Allergen/allergen-updation/${id}`, allergen);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update allergen with id ${id}`);
  }
};

export const deleteAllergen = async (id: number): Promise<void> => { // id: string -> number
  try {
    await apiClient.delete(`/Allergen/allergen-deletion/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete allergen with id ${id}`);
  }
};

export const searchAllergen = async (query: string): Promise<AllergenDTO[]> => {
  try {
    const response = await apiClient.get(`/Allergen/allergen-search?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search allergens");
  }
};