import { Avatar, Button, Menu, Portal, Stack, Box } from "@chakra-ui/react";

export const ProfileButton = () => {
    return (
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
                            <Menu.Item value="profile">
                                Profile
                            </Menu.Item>
                            <Menu.Item value="settings">
                                Settings
                            </Menu.Item>
                            <Menu.Item value="logout" color="red.500">
                                Logout
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Stack>
    );
};
