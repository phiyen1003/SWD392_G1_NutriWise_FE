import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, List, ListItem, ListItemText } from "@mui/material";
import { getConversationsByUserId } from "../../api/chatApi"; // Giả định tên hàm
import { ChatConversationDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const ChatsPage: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversationDTO[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversationsByUserId(1); // Thay userId thực tế
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  return (
    <Layout title="Quản lý đoạn chat" subtitle="Xem và quản lý các đoạn chat">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý trò chuyện
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Theo dõi và quản lý các cuộc trò chuyện của người dùng.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <List>
          {conversations.map((conv) => (
            <ListItem key={conv.conversationId}>
              <ListItemText
                primary={conv.title || `Cuộc trò chuyện ${conv.conversationId}`}
                secondary={`Last message: ${conv.lastMessageTime}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
    </Layout>
  );
};

export default ChatsPage;