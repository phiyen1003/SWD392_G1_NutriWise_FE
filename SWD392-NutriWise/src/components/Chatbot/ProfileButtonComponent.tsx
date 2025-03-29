import { Avatar, Button, Menu, Portal, Stack, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../ToastComponent";
import { useState } from "react";
import { signOut } from "../../api/accountApi";

export const ProfileButton = ({ userId }: { userId: Number }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/");
            alert("Đăng xuất thành công!");
        } catch (err) {
            setOpen(true);
        }
    }

    return (
        <>
            <Toast information="Không thể đăng xuất" statusCode={500} onClose={() => false} open={open} />
            <Stack position="absolute" top={4} right={4}>
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Box cursor="pointer" display="inline-block">
                            <Avatar.Root size="xl">
                                <Avatar.Image src="https://i.pravatar.cc/150?img=7" />
                            </Avatar.Root>
                        </Box>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="profile" onClick={() => navigate(`/nutriwise/profile`)}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item value="logout" color="red.500" onClick={handleLogout}>
                                    Logout
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Stack>
        </>
    );
}
