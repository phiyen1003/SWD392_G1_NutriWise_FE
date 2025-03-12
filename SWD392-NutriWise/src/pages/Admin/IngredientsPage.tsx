import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllIngredients } from "../../api/ingredientApi";
import { IngredientDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const IngredientsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getAllIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <Layout title="Quản lý nguyên liệu" subtitle="Xem và quản lý các nguyên liệu">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý nguyên liệu
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý danh sách nguyên liệu trong hệ thống.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Là chất gây dị ứng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.ingredientId}>
                <TableCell>{ingredient.ingredientId}</TableCell>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.isAllergen ? "Có" : "Không"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default IngredientsPage;