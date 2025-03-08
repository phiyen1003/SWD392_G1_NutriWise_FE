// import apiClient from "./apiClient";

// export interface HealthProfile {
//   id: string;
//   userId: string;
//   age: number;
//   gender: string;
//   height: number;
//   weight: number;
// }

// export const getAllHealthProfiles = async (): Promise<HealthProfile[]> => {
//   try {
//     const response = await apiClient.get("/HealthProfile/GetAllHealthProfiles");
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch health profiles");
//   }
// };

// export const getHealthProfileById = async (id: string): Promise<HealthProfile> => {
//   try {
//     const response = await apiClient.get(`/HealthProfile/GetHealthProfileById/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch health profile with id ${id}`);
//   }
// };

// export const createHealthProfile = async (healthProfile: HealthProfile): Promise<HealthProfile> => {
//   try {
//     const response = await apiClient.post("/HealthProfile/CreateHealthProfile", healthProfile);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create health profile");
//   }
// };

// export const updateHealthProfile = async (id: string, healthProfile: HealthProfile): Promise<HealthProfile> => {
//   try {
//     const response = await apiClient.put(`/HealthProfile/UpdateHealthProfile/${id}`, healthProfile);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update health profile with id ${id}`);
//   }
// };

// export const deleteHealthProfile = async (id: string): Promise<void> => {
//   try {
//     await apiClient.delete(`/HealthProfile/DeleteHealthProfile/${id}`);
//   } catch (error) {
//     throw new Error(`Failed to delete health profile with id ${id}`);
//   }
// };

// export const searchHealthProfile = async (query: string): Promise<HealthProfile[]> => {
//   try {
//     const response = await apiClient.get(`/HealthProfile/SearchHealthProfile?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to search health profiles");
//   }
// };


import apiClient from "./apiClient";

export interface HealthProfile {
  id: string;
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
}

export const getAllHealthProfiles = async (): Promise<HealthProfile[]> => {
  try {
    return [
      { id: "1", userId: "user1", age: 30, gender: "Male", height: 175, weight: 70 },
      { id: "2", userId: "user2", age: 25, gender: "Female", height: 165, weight: 55 },
    ];
  } catch (error) {
    throw new Error("Failed to fetch health profiles");
  }
};

export const getHealthProfileById = async (id: string): Promise<HealthProfile> => {
  try {
    return { id, userId: "mock-user", age: 30, gender: "Male", height: 175, weight: 70 };
  } catch (error) {
    throw new Error(`Failed to fetch health profile with id ${id}`);
  }
};

export const createHealthProfile = async (healthProfile: HealthProfile): Promise<HealthProfile> => {
  try {
    return { ...healthProfile, id: "new-id" };
  } catch (error) {
    throw new Error("Failed to create health profile");
  }
};

export const updateHealthProfile = async (id: string, healthProfile: HealthProfile): Promise<HealthProfile> => {
  try {
    return { ...healthProfile, id };
  } catch (error) {
    throw new Error(`Failed to update health profile with id ${id}`);
  }
};

export const deleteHealthProfile = async (id: string): Promise<void> => {
  try {
    console.log(`Deleted health profile with id ${id}`);
  } catch (error) {
    throw new Error(`Failed to delete health profile with id ${id}`);
  }
};

export const searchHealthProfile = async (query: string): Promise<HealthProfile[]> => {
  try {
    return [
      { id: "1", userId: "user1", age: 30, gender: "Male", height: 175, weight: 70 },
    ].filter((p) => p.userId.toLowerCase().includes(query.toLowerCase()));
  } catch (error) {
    throw new Error("Failed to search health profiles");
  }
};