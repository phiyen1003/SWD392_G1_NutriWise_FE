'use client'

import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom'
import HealthProfileCard from '../../components/Admin/HealthProfileCard'
import {
    Box,
    Center,
    Heading,
    Text,
    Stack,
    Image,
} from '@chakra-ui/react'
import { HeartPulse, X } from "lucide-react";

const IMAGE =
    'https://images.unsplash.com/photo-1596367407372-96cb88503db6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function ProfilePage() {
    const navigate = useNavigate();

    return (
        <Center py={12}>
            <Box
                role={'group'}
                p={6}
                maxW={'1500px'}
                w={'full'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}
            >
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={'120px'}
                    _after={{
                        transition: 'all .3s ease',
                        content: '""',
                        w: 'full',
                        h: 'full',
                        pos: 'absolute',
                        top: 5,
                        left: 0, 
                        backgroundImage: `url(${IMAGE})`,
                        filter: 'blur(15px)',
                        zIndex: -1,
                    }}
                    _groupHover={{
                        _after: {
                            filter: 'blur(20px)',
                        },
                    }}
                >
                    <Stack direction={'row'} justifyContent={'center'} py={18}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                            >
                                <HeartPulse
                                    style={{
                                        height: "72px",
                                        width: "72px",
                                        color: "#3B82F6",
                                    }}
                                />
                            </motion.div>
                        </motion.button>
                    </Stack>
                </Box>
                <Stack pt={10} align={'center'}>
                    <HealthProfileCard />
                </Stack>
            </Box>
        </Center>
    )
}