import apiClient from "./apiClient";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/Category/GetAllCategories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await apiClient.get(`/Category/GetCategoryById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch category with id ${id}`);
  }
};

export const createCategory = async (category: Category): Promise<Category> => {
  try {
    const response = await apiClient.post("/Category/CreateCategory", category);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create category");
  }
};

export const updateCategory = async (id: string, category: Category): Promise<Category> => {
  try {
    const response = await apiClient.put(`/Category/UpdateCategory/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update category with id ${id}`);
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/Category/DeleteCategory/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete category with id ${id}`);
  }
};

export const searchCategory = async (query: string): Promise<Category[]> => {
  try {
    const response = await apiClient.get(`/Category/SearchCategory?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to search categories");
  }
};