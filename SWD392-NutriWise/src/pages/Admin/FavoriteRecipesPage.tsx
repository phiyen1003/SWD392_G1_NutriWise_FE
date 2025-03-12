import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllFavorites } from "../../api/favoriteRecipeApi";
import { FavoriteRecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const FavoriteRecipesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipeDTO[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getAllFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <Layout title="Quản lý công thức yêu thích" subtitle="Xem và quản lý các công thức yêu thích">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý công thức yêu thích
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Xem và quản lý danh sách công thức yêu thích của người dùng.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên công thức</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Ngày thêm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favorites.map((fav) => (
              <TableRow key={fav.favoriteRecipeId}>
                <TableCell>{fav.favoriteRecipeId}</TableCell>
                <TableCell>{fav.recipeName}</TableCell>
                <TableCell>{fav.userId}</TableCell>
                <TableCell>{fav.addedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default FavoriteRecipesPage;