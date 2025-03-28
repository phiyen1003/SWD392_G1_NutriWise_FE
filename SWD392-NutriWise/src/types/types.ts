// src/types.ts

// AllergenDTO
export interface AllergenDTO {
  allergenId?: number;
  name?: string | null;
  description?: string | null;
}

// CategoryDTO
export interface CategoryDTO {
  categoryId: number;
  name?: string | null;
  description?: string | null;
}

// ChatMessageDTO
export interface ChatMessageDTO {
  chatMessageId: number;
  chatSessionId: number;
  sentTime: string; // ISO date-time string, e.g., "2023-10-15T10:00:00Z"
  content?: string | null;
  isUserMessage: boolean;
}

// ChatConversationDTO
export interface ChatConversationDTO {
  chatSessionId: number;
  userId: number;
  startTime: string; // ISO date-time string
  lastMessageTime: string; // ISO date-time string
  title?: string | null;
  messages?: ChatMessageDTO[] | null;
}

// CreateChatMessageDTO
export interface CreateChatMessageDTO {
  chatSessionId: number;
  content?: string | null;
}

// CreateConversationDTO
export interface CreateConversationDTO {
  userId: number;
  initialMessage?: string | null;
  title?: string | null;
}

// CompleteProfileRequest
export interface CompleteProfileRequest {
  email?: string | null;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null; // ISO date string, e.g., "1990-01-01"
  height: number; // float
  weight: number; // float
}

// CreateAllergenDTO
export interface CreateAllergenDTO {
  allergenId: number;
  name?: string | null;
  description?: string | null;
}

// CreateCategoryDTO
export interface CreateCategoryDTO {
  categoryId: number;
  name?: string | null;
  description?: string | null;
}

// CreateChatMessageDTO
export interface CreateChatMessageDTO {
  conversationId: number;
  content?: string | null;
}

// CreateConversationDTO
export interface CreateConversationDTO {
  userId: number;
  initialMessage?: string | null;
  title?: string | null;
}

// CreateFavoriteRecipeDTO
export interface CreateFavoriteRecipeDTO {
  userId: number;
  recipeId: number;
}

// CreateHealthGoalDTO
export interface CreateHealthGoalDTO {
  name?: string | null;
  description?: string | null;
}

// CreateHealthMetricDTO
export interface CreateHealthMetricDTO {
  healthProfileId: number;
  measurementDate: string; // ISO date string
  bmi?: number | null; // double
  bloodPressure?: string | null;
  cholesterol?: string | null;
}

// CreateHealthProfileDTO
export interface CreateHealthProfileDTO {
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null; // ISO date string
  height: number; // double
  weight: number; // double
  allergenId?: number | null;
}

// CreateIngredientDTO
export interface CreateIngredientDTO {
  // ingredientId: number;
  name?: string | null;
  description?: string | null;
  isAllergen: boolean;
}

// CreateIngredientInRecipeDTO
export interface CreateIngredientInRecipeDTO {
  recipeId: number;
  ingredientId: number;
  quantity: number; // double
  unit?: string | null;
}

// CreateMealDTO
export interface CreateMealDTO {
  healthProfileId: number;
  mealDate: string; // ISO date string
  mealTime?: string | null;
  recipeId: number;
}

// CreateMenuHistoryDTO
export interface CreateMenuHistoryDTO {
  healthProfileId: number;
  createdDate?: string | null; // ISO date-time string
  notes?: string | null;
}

// CreateMenuRecipeDTO
export interface CreateMenuRecipeDTO {
  menuHistoryId: number;
  recipeId: number;
  servingSize: number;
}

// CreateProfileGoalDTO
export interface CreateProfileGoalDTO {
  healthProfileId: number;
  healthGoalId: number;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string
}

// CreateRecipeDTO
export interface CreateRecipeDTO {
  name?: string | null;
  description?: string | null;
  categoryId: number;
  cookingTime: number;
  servings: number;
}

// CreateRecipeHealthGoalDTO
export interface CreateRecipeHealthGoalDTO {
  recipeId: number;
  healthGoalId: number;
}

// FavoriteRecipeDTO
export interface FavoriteRecipeDTO {
  favoriteRecipeId: number;
  userId: number;
  recipeId: number;
  addedDate: string; // ISO date-time string
  recipeName?: string | null;
  userName?: string | null;
}

// HealthGoalDTO
export interface HealthGoalDTO {
  healthGoalId: number;
  name?: string | null;
  description?: string | null;
}

// HealthMetricDTO
export interface HealthMetricDTO {
  healthMetricId: number;
  healthProfileId: number;
  measurementDate: string; // ISO date string
  bmi?: number | null; // double
  bloodPressure?: string | null;
  cholesterol?: string | null;
}

// HealthProfileDTO
export interface HealthProfileDTO {
  healthProfileId: number;
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null; // ISO date string
  height: number; // double
  weight: number; // double
  allergenId?: number | null;
  allergen?: AllergenDTO;
}

// IngredientDTO
export interface IngredientDTO {
  ingredientId: number;
  name?: string | null;
  description?: string | null;
  isAllergen: boolean;
}

// IngredientInRecipeDTO
export interface IngredientInRecipeDTO {
  ingredientInRecipeId: number;
  recipeId: number;
  ingredientId: number;
  quantity: number; // double
  unit?: string | null;
  ingredientName?: string | null;
}

// MealDTO
export interface MealDTO {
  mealId: number;
  healthProfileId: number;
  mealDate: string; // ISO date string, e.g., "2023-10-15"
  mealTime?: string | null;
  recipeId: number;
}

// MenuHistoryDTO
export interface MenuHistoryDTO {
  menuHistoryId: number;
  healthProfileId: number;
  createdDate: string; // ISO date-time string, e.g., "2023-10-15T10:00:00Z"
  notes?: string | null;
}

// MenuRecipeDTO
export interface MenuRecipeDTO {
  menuRecipeId: number;
  menuHistoryId: number;
  recipeId: number;
  servingSize: number;
}

// MenuRecipeImageDTO
export interface MenuRecipeImageDTO {
  menuRecipeImageId: number;
  menuRecipeId: number;
  imageUrl?: string | null;
  uploadedDate: string; // ISO date-time string
}

// MenuSuggestionDTO
export interface MenuSuggestionDTO {
  suggestionId: number;
  conversationId: number;
  createdTime: string; // ISO date-time string
  requirements?: string | null;
  generatedMenu?: string | null;
}

// MenuSuggestionRequestDTO
export interface MenuSuggestionRequestDTO {
  conversationId: number;
  requirements?: string | null;
  dietaryRestrictions?: string[] | null; // Assuming it's an array of strings
  preferredIngredients?: string[] | null;
  excludedIngredients?: string[] | null; // Assuming it's an array of strings
  calorieTarget?: number | null;
}

// ProfileGoalDTO
export interface ProfileGoalDTO {
  profileGoalId: number;
  healthProfileId: number;
  healthGoalId: number;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string
  healthGoalName?: string | null;
  healthProfileName?: string | null;
}

// RecipeDTO
export interface RecipeDTO {
  recipeId: number;
  name?: string | null;
  description?: string | null;
  categoryId: number;
  categoryName?: string | null;
  cookingTime: number;
  servings: number;
}

// RecipeHealthGoalDTO
export interface RecipeHealthGoalDTO {
  recipeHealthGoalId: number;
  recipeId: number;
  healthGoalId: number;
  recipeName?: string | null;
  healthGoalName?: string | null;
}

// RecipeImageDTO
export interface RecipeImageDTO {
  recipeImageId: number;
  recipeId: number;
  imageUrl?: string | null;
  uploadedDate: string; // ISO date-time string
}

// UpdateAllergenDTO
export interface UpdateAllergenDTO {
  name?: string | null;
  description?: string | null;
}

// UpdateCategoryDTO
export interface UpdateCategoryDTO {
  name?: string | null;
  description?: string | null;
}

// UpdateFavoriteRecipeDTO
export interface UpdateFavoriteRecipeDTO {
  recipeId?: number | null;
}

// UpdateHealthGoalDTO
export interface UpdateHealthGoalDTO {
  name?: string | null;
  description?: string | null;
}

// UpdateHealthMetricDTO
export interface UpdateHealthMetricDTO {
  measurementDate?: string | null; // ISO date string
  bmi?: number | null; // double
  bloodPressure?: string | null;
  cholesterol?: string | null;
}

// UpdateHealthProfileDTO
export interface UpdateHealthProfileDTO {
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null; // ISO date string
  height?: number | null; // double
  weight?: number | null; // double
  allergenId?: number | null;
}

// UpdateIngredientDTO
export interface UpdateIngredientDTO {
  name?: string | null;
  description?: string | null;
  isAllergen?: boolean | null;
}

// UpdateIngredientInRecipeDTO
export interface UpdateIngredientInRecipeDTO {
  ingredientId?: number | null;
  quantity?: number | null; // double
  unit?: string | null;
}

// UpdateMealDTO
export interface UpdateMealDTO {
  mealDate?: string | null; // ISO date string
  mealTime?: string | null;
  recipeId?: number | null;
}

// UpdateMenuHistoryDTO
export interface UpdateMenuHistoryDTO {
  healthProfileId?: number | null;
  createdDate?: string | null; // ISO date-time string
  notes?: string | null;
}

// UpdateMenuRecipeDTO
export interface UpdateMenuRecipeDTO {
  menuHistoryId?: number | null;
  recipeId?: number | null;
  servingSize?: number | null;
}

// UpdateProfileGoalDTO
export interface UpdateProfileGoalDTO {
  healthProfileId: number;
  healthGoalId: number;
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string
}

// UpdateRecipeDTO
export interface UpdateRecipeDTO {
  name?: string | null;
  description?: string | null;
  categoryId?: number | null;
  cookingTime?: number | null;
  servings?: number | null;
}

// UpdateRecipeHealthGoalDTO
export interface UpdateRecipeHealthGoalDTO {
  recipeId: number;
  healthGoalId: number;
}

export interface ChatSessionDTO {
  chatSessionId: number,
  title: string,
  lastUpdatedDate: string,
}

// Định nghĩa kiểu cho PaginatedResponse
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// ProfileDTO
export interface ProfileDTO {
  userId: number;
  email: string;
  username: string;  
  fullName?: string | null;
  healthProfile: HealthProfileDTO
}