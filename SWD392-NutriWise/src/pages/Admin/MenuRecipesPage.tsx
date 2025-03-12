import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllMenuRecipes } from "../../api/menuRecipeApi";
import { MenuRecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const MenuRecipesPage: React.FC = () => {
  const [menuRecipes, setMenuRecipes] = useState<MenuRecipeDTO[]>([]);

  useEffect(() => {
    const fetchMenuRecipes = async () => {
      try {
        const data = await getAllMenuRecipes();
        setMenuRecipes(data);
      } catch (error) {
        console.error("Error fetching menu recipes:", error);
      }
    };
    fetchMenuRecipes();
  }, []);

  return (
    <Layout title="Quản lý công thức trong thực đơn" subtitle="Xem và quản lý các công thức trong thực đơn">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý công thức trong thực đơn
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý liên kết giữa công thức và thực đơn.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Menu History ID</TableCell>
              <TableCell>Recipe ID</TableCell>
              <TableCell>Kích thước khẩu phần</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuRecipes.map((item) => (
              <TableRow key={item.menuRecipeId}>
                <TableCell>{item.menuRecipeId}</TableCell>
                <TableCell>{item.menuHistoryId}</TableCell>
                <TableCell>{item.recipeId}</TableCell>
                <TableCell>{item.servingSize}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default MenuRecipesPage;