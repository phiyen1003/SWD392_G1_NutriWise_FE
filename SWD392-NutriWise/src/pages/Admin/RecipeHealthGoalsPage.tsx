import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllRecipeHealthGoals } from "../../api/recipeHealthGoalApi";
import { RecipeHealthGoalDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const RecipeHealthGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<RecipeHealthGoalDTO[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getAllRecipeHealthGoals();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching recipe health goals:", error);
      }
    };
    fetchGoals();
  }, []);

  return (
    <Layout title="Quản lý mục tiêu sức khỏe công thức" subtitle="Xem và quản lý các mục tiêu sức khỏe công thức">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý mục tiêu sức khỏe công thức
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý liên kết giữa công thức và mục tiêu sức khỏe.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên công thức</TableCell>
              <TableCell>Tên mục tiêu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.recipeHealthGoalId}>
                <TableCell>{goal.recipeHealthGoalId}</TableCell>
                <TableCell>{goal.recipeName}</TableCell>
                <TableCell>{goal.healthGoalName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default RecipeHealthGoalsPage;