import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllHealthGoals } from "../../api/healthGoalApi";
import { HealthGoalDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const HealthGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<HealthGoalDTO[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getAllHealthGoals();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching health goals:", error);
      }
    };
    fetchGoals();
  }, []);

  return (
    <Layout title="Quản lý mục tiêu sức khỏe" subtitle="Xem và quản lý các mục tiêu sức khỏe">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý mục tiêu sức khỏe
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý các mục tiêu sức khỏe trong hệ thống.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.healthGoalId}>
                <TableCell>{goal.healthGoalId}</TableCell>
                <TableCell>{goal.name}</TableCell>
                <TableCell>{goal.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default HealthGoalsPage;