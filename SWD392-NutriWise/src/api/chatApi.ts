import apiClient from "./apiClient";
import {
  ChatConversationDTO,
  ChatMessageDTO,
  CreateConversationDTO,
  CreateChatMessageDTO,
  MenuSuggestionDTO,
} from "../types/types";

export const getConversationsByUserId = async (
  userId: number,
  pageNumber?: number,
  pageSize?: number,
  orderBy?: string
): Promise<ChatConversationDTO[]> => {
  try {
    const response = await apiClient.get(`/api/Chat/user/${userId}`, {
      params: { PageNumber: pageNumber, PageSize: pageSize, OrderBy: orderBy },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversations for user ${userId}`);
  }
};

export const getConversationById = async (chatSessionId: number): Promise<ChatConversationDTO> => {
  try {
    const response = await apiClient.get(`/api/Chat/session/${chatSessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversation with id ${chatSessionId}`);
  }
};

export const deleteConversation = async (chatSessionId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/Chat/session/${chatSessionId}`);
  } catch (error) {
    throw new Error(`Failed to delete conversation with id ${chatSessionId}`);
  }
};

export const createConversation = async (data: CreateConversationDTO): Promise<ChatConversationDTO> => {
  try {
    const response = await apiClient.post("/api/Chat/session", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create conversation");
  }
};

export const sendMessage = async (message: CreateChatMessageDTO): Promise<ChatMessageDTO> => {
  try {
    const response = await apiClient.post("/api/Chat/message", message);
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const getMenuSuggestion = async (chatSessionId: number): Promise<MenuSuggestionDTO> => {
  try {
    const response = await apiClient.post("/api/Chat/menu-suggestion", { chatSessionId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get menu suggestion");
  }
};