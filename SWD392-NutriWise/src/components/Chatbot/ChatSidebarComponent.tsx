import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, VStack, Collapsible, Stack, Text, Spacer, Spinner } from "@chakra-ui/react";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { HeartPulse, Trash } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { Box, Divider, Modal } from "@mui/material";
import { ChatSessionDTO } from "../../types/types";

interface ChatSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    loading: boolean
    hasMore: boolean
    sessions: ChatSessionDTO[],
    handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export const ChatSidebar = ({
    isOpen,
    setIsOpen,
    loading,
    sessions,
    handleScroll }: ChatSidebarProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<number>();

    const navigate = useNavigate();
    console.log('Sessions chat sidebar: ',sessions);

    return (
        <>
            <Collapsible.Root
                position={"absolute"}
                open={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Collapsible.Trigger paddingX={isOpen ? 255 : 0} cursor="button">
                    <AutoAwesomeMosaicIcon
                        color="primary"
                        fontSize={"large"} />
                </Collapsible.Trigger>
                <Collapsible.Content onClick={(e) => e.stopPropagation()}>
                    <VStack
                        // ref={listRef}
                        align="stretch"
                        position="fixed"
                        left={0}
                        top={0}
                        height="full"
                        width={isOpen ? "250px" : "0px"}
                        bg="whiteAlpha.600"
                        color="black"
                        p={isOpen ? 4 : 0}
                        shadow="md"
                        overflowY="auto"
                        onScroll={handleScroll}
                    >
                        <Stack direction="column" gap={10}>
                            <Stack direction="row" justifyContent="flex-end" onClick={() => navigate(`/`)}>
                                <Button variant={"ghost"} color="blue" size={"lg"}>
                                    <HeartPulse />
                                    NutriWise
                                </Button>
                                <Button variant="ghost" width={45} height={45} borderRadius={40}>
                                    <SearchOutlinedIcon />
                                </Button>
                            </Stack>
                            <Button variant="ghost" onClick={() => {
                                navigate(`/nutriwise/chats`);
                            }}>Tạo đoạn chat mới</Button>
                            <Stack>
                                {sessions.map((session) => (
                                    <>
                                        <Button
                                            key={session.chatSessionId}
                                            variant="ghost"
                                            onClick={() => navigate(`/nutriwise/chats/${session.chatSessionId}`)}
                                            display="flex"
                                            justifyContent="space-between"
                                            width="100%"
                                        >
                                            <Text color="blackAlpha.800"
                                                whiteSpace="nowrap"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                                maxWidth="80%"
                                            >
                                                {session.title}
                                            </Text>
                                            <Spacer />
                                            <Trash color="red" onClick={(e) => {
                                                e.stopPropagation();
                                                setSessionId(session.chatSessionId);
                                                setOpen(true);
                                            }} />
                                        </Button>

                                    </>
                                ))}
                                {loading && (
                                    <Box display="flex" justifyContent="center" my={4}>
                                        <Spinner
                                            borderWidth="4px"
                                            alignSelf="center"
                                            color="blue.500"
                                            animationDuration="0.8s"
                                            size="lg"
                                        />
                                    </Box>
                                )}
                            </Stack>
                        </Stack>
                    </VStack>
                </Collapsible.Content>
            </Collapsible.Root>
            <DeleteModal
                open={open}
                title={sessions.find(s => (s.chatSessionId === sessionId))?.title || ''}
                handleClose={() => setOpen(!open)}
                sessionId={sessionId!} />
        </>
    );
}

interface DeleteModalProps {
    open: boolean,
    title: string,
    sessionId: number,
    handleClose: () => void
}
const DeleteModal = ({ open, title, sessionId, handleClose }: DeleteModalProps) => {
    const navigate = useNavigate();

    const onDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiClient.delete(`/Chat/session/${sessionId}`);
            console.log('delete response', response);
            if (response.status === 200) {
                handleClose();
                navigate(`/nutriwise/chats`);
                setTimeout(() => {
                    window.location.reload(); // Force reload after navigating
                }, 100);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Centers the modal
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 3, // Padding inside the modal
                    minWidth: 400, // Ensures the modal is wide enough for the form
                    maxWidth: 600, // Prevents it from being too large
                    borderRadius: 2, // Adds rounded corners
                }}
            >
                <Text fontSize={"large"} fontWeight={"bold"}>
                    Xóa đoạn chat?
                </Text>
                <Divider />
                <Stack marginTop={15}>
                    <form onSubmit={onDelete}>
                        <Text>
                            Hành động này sẽ xóa {title}.
                        </Text>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button variant="surface" onClick={handleClose}>Hủy</Button>
                            <Button type="submit" variant="solid" colorPalette={"red"}>Xóa</Button>
                        </Box>
                    </form>
                </Stack>
            </Box>
        </Modal>
    )
}