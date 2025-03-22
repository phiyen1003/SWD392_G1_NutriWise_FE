import { ChatSidebar } from "../components/Chatbot/ChatSidebarComponent";
import { Chat } from "../components/Chatbot/ChatComponent";
import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { ProfileButton } from "../components/Chatbot/ProfileButtonComponent";
export default function AIChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Stack direction="row" width="full" height="full">
                <ChatSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <Stack
                    flex={1}
                    ml={isSidebarOpen ? "250px" : "0px"}
                    transition="margin 0.3s ease-in-out"
                >
                    <Chat />
                </Stack>
                <ProfileButton />
            </Stack>
        </>
    )
}