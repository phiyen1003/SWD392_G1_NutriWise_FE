import { ChatSidebar } from "../components/Chatbot/ChatSidebarComponent";
import { Chat } from "../components/Chatbot/ChatComponent";
import { Button, Stack } from "@chakra-ui/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { ProfileButton } from "../components/Chatbot/ProfileButtonComponent";
import { Link, useParams } from "react-router-dom";
import { ChatSessionDTO } from "../types/types";
import apiClient from "../api/apiClient";

export default function AIChatPage() {
    const userId = localStorage.getItem('userId');
    const { sessionId } = useParams();
    
    const [sessions, setSessions] = useState<ChatSessionDTO[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(userId ? true : false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    
    console.log(sessionId);

    console.log('selected chat', sessionId)

    const fetchSessions = useCallback(async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const response = await apiClient.get(`/Chat/user/${userId}?PageNumber=${pageNumber}&PageSize=${15}&OrderBy=lastUpdatedDate desc`);
            const newSessions = response.data;
            console.log(response.data);

            if (newSessions.length === 0) {
                setHasMore(false);
            } else {
                setSessions([...sessions, ...newSessions]);
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }, [pageNumber]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        console.log('scroll start');
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
            console.log('cham day');
            setPageNumber(prev => prev + 1);
        }
    },[hasMore, loading]);

    useEffect(() => {
        fetchSessions();
        console.log(sessions);
    }, [fetchSessions, pageNumber])

    return (
        <>
            <Stack direction="row" width="full" height="full">
                {userId ? (
                    <>
                        <ChatSidebar
                            isOpen={isSidebarOpen}
                            setIsOpen={setIsSidebarOpen}
                            loading={loading}
                            hasMore={hasMore}
                            sessions={sessions}
                            handleScroll={handleScroll}
                        />
                        <ProfileButton userId={userId}/>
                    </>
                ) : (
                    <Stack direction="row" position="absolute" top={4} right={4}>
                        {/* <Button bgColor="blue.700" borderRadius="3xl">Đăng nhập</Button>
                        <Button borderRadius="3xl" variant="outline">Đăng ký</Button> */}
                        <Button bgColor="blue.700" borderRadius="3xl">
                            <Link to="/">
                                NutriWise
                            </Link>
                        </Button>
                    </Stack>
                )}
                <Stack
                    flex={1}
                    ml={isSidebarOpen ? "250px" : "0px"}
                    transition="margin 0.3s ease-in-out"
                >
                    <Chat key={sessionId} setSessions={setSessions} />
                </Stack>
            </Stack>
        </>
    )
}