import { ChatSidebar } from "../components/Chatbot/ChatSidebarComponent";
import { Chat } from "../components/Chatbot/ChatComponent";
import { Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { ProfileButton } from "../components/Chatbot/ProfileButtonComponent";
import { Link, useParams } from "react-router-dom";

export default function AIChatPage() {
    const { sessionId } = useParams();
    console.log(sessionId);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // const userId = localStorage.getItem('userId');
    const userId = 1;

    console.log('selected chat', sessionId)

    return (
        <>
            <Stack direction="row" width="full" height="full">
                {userId ? (
                    <>
                        <ChatSidebar
                            isOpen={isSidebarOpen}
                            setIsOpen={setIsSidebarOpen}
                            userId={userId}
                        />
                        <ProfileButton />
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
                    <Chat sessionId={parseInt(sessionId!)} />
                </Stack>
            </Stack>
        </>
    )
}