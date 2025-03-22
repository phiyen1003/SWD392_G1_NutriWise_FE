import { useState } from "react";
import { Button, VStack, Collapsible, Stack, Text } from "@chakra-ui/react";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { HeartPulse } from "lucide-react";

interface ChatSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const ChatSidebar = ({isOpen, setIsOpen} : ChatSidebarProps) => {
    return (
        <Collapsible.Root
            position={"absolute"}
            open={isOpen}
            onClick={() => setIsOpen(!isOpen)}>
            <Collapsible.Trigger paddingX={isOpen ? 255 : 0} cursor="button">
                <AutoAwesomeMosaicIcon
                    color="primary"
                    fontSize={"large"} />
            </Collapsible.Trigger>
            <Collapsible.Content onClick={(e) => e.stopPropagation()}>
                <VStack
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
                >
                    <Stack direction="column" gap={10}>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button variant={"ghost"} color="blue" size={"lg"}>
                                <HeartPulse />
                                NutriWise
                            </Button>
                            <Button variant="ghost" width={45} height={45} borderRadius={40}>
                                <SearchOutlinedIcon />
                            </Button>
                        </Stack>
                        <Button variant="ghost">Tạo đoạn chat mới</Button>
                        <Stack>
                            <Button variant="ghost">Chat 1</Button>
                            <Button variant="ghost">Chat 2</Button>
                            <Button variant="ghost">Chat 3</Button>
                        </Stack>
                    </Stack>
                </VStack>
            </Collapsible.Content>
        </Collapsible.Root>
    );
}
