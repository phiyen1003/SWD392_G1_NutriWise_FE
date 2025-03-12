import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllProfileGoals } from "../../api/profileGoalApi";
import { ProfileGoalDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const ProfileGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<ProfileGoalDTO[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getAllProfileGoals();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching profile goals:", error);
      }
    };
    fetchGoals();
  }, []);

  return (
    <Layout title="Quản lý mục tiêu hồ sơ" subtitle="Xem và quản lý các mục tiêu hồ sơ">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý mục tiêu hồ sơ
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý mục tiêu sức khỏe liên kết với hồ sơ.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Health Profile ID</TableCell>
              <TableCell>Health Goal</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.profileGoalId}>
                <TableCell>{goal.profileGoalId}</TableCell>
                <TableCell>{goal.healthProfileId}</TableCell>
                <TableCell>{goal.healthGoalName}</TableCell>
                <TableCell>{goal.startDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default ProfileGoalsPage;