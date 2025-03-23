import apiClient from "../../api/apiClient";
import { ChatMessageDTO } from "../../types/types";
import { Stack, Button, Text, Textarea, Box } from "@chakra-ui/react";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import { useCallback, useEffect, useState } from "react";

interface ChatProps {
    sessionId: number
}

const initialState: ChatMessageDTO = {
    chatMessageId: 0,
    chatSessionId: 0,
    isUserMessage: false,
    sentTime: '',
    content: ''
}

export const Chat = ({ sessionId }: ChatProps) => {
    const [messages, setMessages] = useState<ChatMessageDTO[]>([initialState]);
    const [prompt, setPrompt] = useState<string>('');

    // const userId = localStorage.getItem('userId');
    const userId = 1;

    const fetchMessages = useCallback(async () => {
        if (sessionId) {
            try {
                const response = await apiClient.get(`/Chat/session/${sessionId}?includeMessages=true`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        } else {
            setMessages([]);
        }
    }, [sessionId])


    useEffect(() => {
        fetchMessages();
    }, [fetchMessages])

    const handleSend = async (content: string) => {
        try {
            if (!sessionId) {
                const response = await apiClient.post(`/Chat/session`, {
                    userId: userId,
                    title: 'New conversation'
                })

                sessionId = response.data.chatSessionId;
            }

            const responseMessage = await apiClient.post(`/Chat/message`, {
                chatSessionId: sessionId,
                content: content
            })

            if (responseMessage.status === 200) {
                const userMessage = responseMessage.data.userMessage;
                const aiMessage = responseMessage.data.aiResponse;

                setMessages([...messages, {
                    chatSessionId: sessionId,
                    chatMessageId: userMessage.chatMessageId,
                    isUserMessage: userMessage.isUserMessage,
                    sentTime: userMessage.sentTime,
                    content: userMessage.content
                },{
                    chatSessionId: sessionId,
                    chatMessageId: aiMessage.chatMessageId,
                    isUserMessage: aiMessage.isUserMessage,
                    sentTime: aiMessage.sentTime,
                    content: aiMessage.content
                }])
                
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Stack width="full" height="full" p={4}>
            <Stack
                maxWidth="768px"
                width="full"
                marginX="auto"
                height={messages.length > 1 ? '65vh' : '30ch'}
                overflowY="auto"
                p={4}
                bg="white"
            >
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <Box
                            key={index}
                            alignSelf={msg.isUserMessage ? 'flex-end' : 'flex-start'}
                            maxWidth="75%"
                            borderRadius={15}
                            p={3}
                            bg={msg.isUserMessage ? 'gray.100' : ''}
                        >
                            {msg.content}
                        </Box>
                    ))
                ) : null}
            </Stack>

            <Stack width="full"
                maxWidth="768px"
                marginX="auto"
                gap={5}
                flex={messages.length > 0 ? 1 : "initial"}
                justifyContent={messages.length > 0 ? "flex-end" : "center"}
            >
                {messages.length <= 1 && (
                    <Text
                        display={"flex"}
                        justifyContent={"center"}
                        textStyle={"3xl"}
                        fontWeight={"bold"}
                        color={"blue.600"}
                    >
                        Tôi có thể giúp gì cho bạn?
                    </Text>
                )}
                <Stack
                    direction="row"
                    width="full"
                    border={2.5}
                    borderRadius={20}
                    borderStyle={"groove"}
                    padding={"20px 20px 70px 20px"}
                >
                    <Textarea autoresize maxH="1hz" placeholder="Hỏi bất kì điều gì về thực đơn..." variant={"flushed"} onChange={(e) => setPrompt(e.target.value)} />
                    <Button bgColor={"blue.700"} borderRadius={15} onClick={() => handleSend(prompt)}>
                        <ArrowUpwardOutlinedIcon fontSize="medium" />
                    </Button>
                </Stack>
            </Stack>
        </Stack >
    );
};
