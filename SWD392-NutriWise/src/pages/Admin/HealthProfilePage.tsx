import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

import { Card, Avatar, Text, Tabs, Badge, Stack, HStack, VStack, Spacer } from "@chakra-ui/react";

import { getHealthProfileById } from "../../api/healthProfileApi";
import { HealthProfileDTO } from "../../types/types";

import Layout from "../../components/Admin/Layout";
import HealthMetricCard from "../../components/Admin/HealthMetricCard";
import HealthGoalCard from "../../components/Admin/HealthGoalCard";

export default function HealthProfilePage() {
    const initialState: HealthProfileDTO = {
        healthProfileId: 0,
        fullName: '',
        gender: '',
        dateOfBirth: null,
        height: 0,
        weight: 0
    }
    const { profileId } = useParams();
    const [profile, setProfile] = useState<HealthProfileDTO>();

    const navigate = useNavigate();

    const fetchProfiles = async () => {
        try {
            if (!profileId) return;

            const response = await getHealthProfileById(parseInt(profileId));
            setProfile(response);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchProfiles();
    }, [])

    return (
        <Layout title="Quản lý hồ sơ sức khỏe" subtitle="Xem và quản lý các hồ sơ sức khỏe">
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
                                                <Text fontWeight="medium">Giới tính
                                                    <Text fontWeight="bold">{profile.gender}</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Chiều cao
                                                    <Text fontWeight="bold">{profile.height} cm</Text>
                                                </Text>
                                            </VStack>
                                            <VStack>
                                                <Text fontWeight="medium">Cân nặng
                                                    <Text fontWeight="bold">{profile.weight} kg</Text>
                                                </Text>
                                            </VStack>
                                        </Stack>
                                    </>
                                ) : (
                                    <Text>Dell co gi</Text>
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
            </Card.Root>
        </Layout>
    )
}