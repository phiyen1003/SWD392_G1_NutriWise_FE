import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { Card, Avatar, Text, Tabs, Badge, Stack, HStack, VStack } from "@chakra-ui/react";
import { Box, TableSortLabel, Button } from "@mui/material";

import { getHealthProfileById } from "../../api/healthProfileApi";
import { HealthProfileDTO, ProfileDTO } from "../../types/types";
import HealthMetricCard from "../../components/Admin/HealthMetricCard";
import HealthGoalCard from "../../components/Admin/HealthGoalCard";
import HealthProfileModal from "./HealthProfileModal";
import apiClient from "../../api/apiClient";

export default function HealthProfileCard() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const { profileId } = useParams();

    const initialState: ProfileDTO = {
        userId: 0,
        email: '',
        username: '',
        healthProfile: {
            healthProfileId: 0,
            fullName: '',
            gender: '',
            dateOfBirth: null,
            height: 0,
            weight: 0
        }
    }

    const [profile, setProfile] = useState<ProfileDTO>();
    const [open, setOpen] = useState<boolean>(false);
    const [action, setAction] = useState<'create' | 'update'>();
    const [selectedProfile, setSelectedProfile] = useState<ProfileDTO>(initialState);

    const handleOpen = (action: 'create' | 'update', profile: ProfileDTO) => {
        setSelectedProfile(profile);
        setAction(action);
        setOpen(true);
    }

    const fetchProfiles = async () => {
        try {
            if (userId && !profileId) {
                const response = await apiClient.get(`/Account/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200) {
                    setProfile(response.data);
                } else {
                    console.error('unauthorized');
                }
            } else if (profileId) {
                const response = await apiClient.get(`/admin/Dashboard/profile/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setProfile(response.data);
            }
            console.log('userID: ', userId);
            console.log('profileId: ', profileId);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchProfiles();
    }, [open])

    return (
        <>
            <Card.Root width="full" mb={2} paddingTop={2}>
                <HStack gap={4} alignItems="center" ml={2}>
                    <Avatar.Root size="lg">
                        <Avatar.Image src="https://picsum.photos/200/300" />
                        <Avatar.Fallback name="user" />
                    </Avatar.Root>
                    <VStack align="start" gap={1}>
                        <Text fontSize="lg" fontWeight="bold">{profile?.fullName || "Unknown"}</Text>
                        <Badge colorPalette="green" fontSize="sm">Active</Badge>
                    </VStack>
                </HStack>
                <Tabs.Root lazyMount unmountOnExit defaultValue="info">
                    <Tabs.List>
                        <Tabs.Trigger value="info">
                            Thông tin
                        </Tabs.Trigger>
                        <Tabs.Trigger value="metric" >
                            Chỉ số
                        </Tabs.Trigger>
                        <Tabs.Trigger value="goal">
                            Mục tiêu
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="info"
                        _open={{
                            animationName: "fade-in, scale-in",
                            animationDuration: "300ms",
                        }}
                        _closed={{
                            animationName: "fade-out, scale-out",
                            animationDuration: "120ms",
                        }}>
                        <Card.Body gap={5}>
                            <Box>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={() => handleOpen('update', profile!)}>
                                    Cập nhật
                                </Button>
                            </Box>
                            <Card.Title>Thông tin cá nhân</Card.Title>
                            <Card.Description>
                                {profile ? (
                                    <>
                                        <Stack direction={'row'} justifyContent={'space-between'} align={'start'} fontSize={'md'}>
                                            <VStack>
                                                <Text fontWeight="medium">Họ và tên
                                                    <Text fontWeight="bold">{profile.fullName}</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Username
                                                    <Text fontWeight="bold">{profile.username} kg</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Email
                                                    <Text fontWeight="bold">{profile.email} kg</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Giới tính
                                                    <Text fontWeight="bold">{profile.healthProfile.gender}</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Chiều cao
                                                    <Text fontWeight="bold">{profile.healthProfile.height} cm</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Cân nặng
                                                    <Text fontWeight="bold">{profile.healthProfile.weight} kg</Text>
                                                </Text>
                                            </VStack>
                                        </Stack>
                                    </>
                                ) : (
                                    <Text>Ko co gi</Text>
                                )}
                            </Card.Description>
                        </Card.Body>
                    </Tabs.Content>
                    <Tabs.Content value="metric">
                        {<HealthMetricCard />}
                    </Tabs.Content>
                    <Tabs.Content value="goal">
                        {<HealthGoalCard />}
                    </Tabs.Content>
                </Tabs.Root>
                <HealthProfileModal
                    open={open}
                    action={action!}
                    profile={selectedProfile!}
                    title={action === 'create' ? 'Thêm hồ sơ sức khỏe' : 'Chỉnh sửa hồ sơ sức khỏe'}
                    setHealthProfiles={() => { }}
                    handleClose={() => setOpen(false)} />
            </Card.Root>
        </>
    )
}