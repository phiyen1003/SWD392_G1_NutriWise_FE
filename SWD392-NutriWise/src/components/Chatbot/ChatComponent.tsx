import { Stack, Input, Button, Text, Textarea } from "@chakra-ui/react";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';

export const Chat = () => {
    return (
        <Stack width="full" height="full" p={4}>
            <Stack
                maxWidth="768px"
                width="full"
                marginX="auto"
                height="30vh"
                overflowY="auto"
                p={4}
                bg="white"
            >
                {/* Chat messages would go here */}
            </Stack>
            {/* Move the text above the input field */}
            <Stack width="full" maxWidth="768px" marginX="auto" gap={5}>
                <Text
                    display={"flex"}
                    justifyContent={"center"}
                    textStyle={"3xl"}
                    fontWeight={"bold"}
                    color={"blue.600"}
                >
                    Tôi có thể giúp gì cho bạn?
                </Text>
                <Stack
                    direction="row"
                    width="full"
                    border={2.5}
                    borderRadius={20}
                    borderStyle={"groove"}
                    padding={"20px 20px 70px 20px"}
                >
                    <Textarea autoresize maxH="1hz" placeholder="Hỏi bất kì điều gì về thực đơn..." variant={"flushed"} />
                    <Button bgColor={"blue.700"} borderRadius={15}>
                        <ArrowUpwardOutlinedIcon fontSize="medium"/>
                    </Button>
                </Stack>
            </Stack>
        </Stack >
    );
};
