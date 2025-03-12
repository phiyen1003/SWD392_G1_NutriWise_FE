import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllIngredientInRecipes } from "../../api/ingredientInRecipeApi";
import { IngredientInRecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const IngredientInRecipesPage: React.FC = () => {
  const [items, setItems] = useState<IngredientInRecipeDTO[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllIngredientInRecipes();
        setItems(data);
      } catch (error) {
        console.error("Error fetching ingredient-in-recipes:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <Layout title="Quản lý nguyên liệu trong công thức" subtitle="Xem và quản lý các nguyên liệu trong công thức">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý nguyên liệu trong công thức
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý liên kết giữa nguyên liệu và công thức.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Recipe ID</TableCell>
              <TableCell>Tên nguyên liệu</TableCell>
              <TableCell>Số lượng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.ingredientInRecipeId}>
                <TableCell>{item.ingredientInRecipeId}</TableCell>
                <TableCell>{item.recipeId}</TableCell>
                <TableCell>{item.ingredientName}</TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default IngredientInRecipesPage;