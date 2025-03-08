import apiClient from "./apiClient";

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
}

export const getConversationsByUserId = async (userId: string): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get(`/Chat/conversations/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversations for user ${userId}`);
  }
};

export const getConversationById = async (conversationId: string): Promise<Conversation> => {
  try {
    const response = await apiClient.get(`/Chat/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch conversation with id ${conversationId}`);
  }
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    await apiClient.delete(`/Chat/conversation/${conversationId}`);
  } catch (error) {
    throw new Error(`Failed to delete conversation with id ${conversationId}`);
  }
};

export const createConversation = async (userId: string): Promise<Conversation> => {
  try {
    const response = await apiClient.post("/Chat/conversation", { userId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create conversation");
  }
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  try {
    const response = await apiClient.post("/Chat/message", { conversationId, content });
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const getMenuSuggestion = async (conversationId: string): Promise<any> => {
  try {
    const response = await apiClient.post("/Chat/menu-suggestion", { conversationId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get menu suggestion");
  }
};