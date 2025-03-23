import apiClient from "../../api/apiClient";
import { ChatMessageDTO, ChatSessionDTO } from "../../types/types";
import { Stack, Button, Text, Textarea, Box } from "@chakra-ui/react";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import dayjs from "dayjs";
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../ToastComponent";

interface ChatProps {
    setSessions: React.Dispatch<React.SetStateAction<ChatSessionDTO[]>>
}

const initialState: ChatMessageDTO = {
    chatMessageId: 0,
    chatSessionId: 0,
    isUserMessage: false,
    sentTime: '',
    content: ''
}

export const Chat = ({ setSessions }: ChatProps) => {
    const userId = localStorage.getItem('userId');
    // const userId = 1;
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { sessionId } = useParams();
    
    const [messages, setMessages] = useState<ChatMessageDTO[]>([initialState]);
    const [prompt, setPrompt] = useState<string>('');
    const [toastInfo, setToastInfo] = useState<{ open: boolean; message: string }>({
        open: false,
        message: "",
    });

    const fetchMessages = useCallback(async () => {
        if (sessionId) {
            try {
                const response = await apiClient.get(`/Chat/session/${sessionId}?includeMessages=true`);
                console.log('session chat component: ', response.data);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }

        } else {
            setMessages([]);
        }
    }, [sessionId])


    useEffect(() => {
        if (sessionId) {
            fetchMessages();
            console.log('messages sent chat component: ', messages);
        }
    }, [sessionId, fetchMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!prompt.trim()) return;
        const content = prompt;
        console.log(content);
        setPrompt(() => '');
        try {
            let newSessionId = Number(sessionId ?? 0);

            if (!sessionId) {
                const response = await apiClient.post(`/Chat/session`, {
                    userId: userId,
                    title: `New chat ${dayjs(new Date())}`
                })
                setSessions((prev) => [response.data, ...prev]);
                newSessionId = response.data.chatSessionId;

                navigate(`${newSessionId}`);
            }

            const responseMessage = await apiClient.post(`/Chat/message?userId=${userId}`, {
                chatSessionId: newSessionId,
                content: content
            })

            // if (responseMessage.status === 200) {
            const userMessage = responseMessage.data.userMessage;
            const aiMessage = responseMessage.data.aiResponse;

            setMessages([...messages, {
                chatSessionId: newSessionId,
                chatMessageId: userMessage.chatMessageId,
                isUserMessage: userMessage.isUserMessage,
                sentTime: userMessage.sentTime,
                content: userMessage.content

            }, {
                chatSessionId: newSessionId,
                chatMessageId: aiMessage.chatMessageId,
                isUserMessage: aiMessage.isUserMessage,
                sentTime: aiMessage.sentTime,
                content: aiMessage.content

            }]);
            // }
        } catch (err) {
            setToastInfo({ open: true, message: "NutriWise AI đang có lỗi ><" });
        }
    }, [prompt, sessionId, setSessions, navigate])

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
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                        >
                            {msg.content}
                        </Box>
                    ))
                ) : null}
                <div ref={messagesEndRef} />
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
                    <Textarea
                        value={prompt}
                        autoresize maxH="40"
                        placeholder="Hỏi bất kì điều gì về thực đơn..."
                        variant={"flushed"}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Prevents new line
                                handleSend(); // Calls the send method
                            }
                        }} />
                    <Button bgColor={"blue.700"} borderRadius={15} onClick={handleSend}>
                        <ArrowUpwardOutlinedIcon fontSize="medium" />
                    </Button>
                </Stack>
            </Stack>
            <Toast
                open={toastInfo.open}
                onClose={() => setToastInfo({ open: false, message: "" })}
                information={toastInfo.message}
                statusCode={500}
            />
        </Stack >
    );
};