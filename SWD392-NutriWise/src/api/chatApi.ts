// src/api/chatApi.ts
import apiClient from "./apiClient";
import { 
  ChatConversationDTO, 
  ChatMessageDTO, 
  CreateConversationDTO, 
  CreateChatMessageDTO, 
  MenuSuggestionDTO 
} from "../types/types"; // Import từ types.ts

export const getConversationsByUserId = async (userId: number): Promise<ChatConversationDTO[]> => { // userId: string -> number
  try {
    const response = await apiClient.get(`/Chat/userconversations/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversations for user ${userId}`);
  }
};

export const getConversationById = async (conversationId: number): Promise<ChatConversationDTO> => { // conversationId: string -> number
  try {
    const response = await apiClient.get(`/Chat/conversation-by-id/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversation with id ${conversationId}`);
  }
};

export const deleteConversation = async (conversationId: number): Promise<void> => { // conversationId: string -> number
  try {
    await apiClient.delete(`/Chat/conversation-delete/${conversationId}`);
  } catch (error) {
    throw new Error(`Failed to delete conversation with id ${conversationId}`);
  }
};

export const createConversation = async (data: CreateConversationDTO): Promise<ChatConversationDTO> => { // Sử dụng CreateConversationDTO
  try {
    const response = await apiClient.post("/Chat/conversation-creation", data); // Thêm prefix /Chat/
    return response.data;
  } catch (error) {
    throw new Error("Failed to create conversation");
  }
};

export const sendMessage = async (message: CreateChatMessageDTO): Promise<ChatMessageDTO> => { // Sử dụng CreateChatMessageDTO
  try {
    const response = await apiClient.post("/Chat/message-send", message);
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const getMenuSuggestion = async (conversationId: number): Promise<MenuSuggestionDTO> => { // conversationId: string -> number, dùng MenuSuggestionDTO
  try {
    const response = await apiClient.post("/Chat/menu-suggestion", { conversationId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get menu suggestion");
  }
};