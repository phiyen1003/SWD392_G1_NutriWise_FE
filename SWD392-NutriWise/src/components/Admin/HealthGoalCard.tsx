import { useEffect, useState } from "react";
import { HealthGoalDTO } from "../../types/types";
import { Card, Stack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { getHealthGoalById } from "../../api/healthGoalApi";

export default function HealthGoalCard() {
    const [goal, setGoal] = useState<HealthGoalDTO>();

    const { profileId } = useParams();

    const fetchMetrics = async () => {
        if (!profileId) return;

        try {
            const data = await getHealthGoalById(parseInt(profileId));
            setGoal(data);
        } catch (error) {
            console.error("Error fetching health goal:", error);
        }
    };
    useEffect(() => {
        fetchMetrics();
    }, []);

    return (
        <>
            <Card.Body gap={5}>
                <Card.Title>
                    Mục tiêu
                </Card.Title>
                <Card.Description>
                    {goal ? (
                        <>
                            <Stack direction={'row'} justifyContent={'space-between'} align={'start'} fontSize={'md'}>
                                <VStack>
                                    <Text>
                                        Tên
                                        <Text fontWeight='bold'>
                                            {goal.name}
                                        </Text>
                                    </Text>
                                </VStack>
                                <VStack>
                                    <Text>
                                        Mô tả
                                        <Text fontWeight='bold'>
                                            {goal.description}
                                        </Text>
                                    </Text>
                                </VStack>
                            </Stack>
                        </>
                    ) : (<Text>Deo co gi</Text>)}
                </Card.Description>
            </Card.Body>
        </>
    )
}
