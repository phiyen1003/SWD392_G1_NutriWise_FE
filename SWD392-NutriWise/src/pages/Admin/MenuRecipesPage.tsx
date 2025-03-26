import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getAllMenuRecipes } from "../../api/menuRecipeApi";
import { getRecipeById } from "../../api/recipeApi"; // Import API mới
import { MenuRecipeDTO, RecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const MenuRecipesPage: React.FC = () => {
  const [menuRecipes, setMenuRecipes] = useState<MenuRecipeDTO[]>([]);
  const [recipes, setRecipes] = useState<{ [key: number]: RecipeDTO }>({}); // Lưu trữ thông tin Recipe theo recipeId
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    fetchMenuRecipes();
  }, [pageNumber, pageSize]);

  const fetchMenuRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuRecipes({
        pageNumber,
        pageSize,
        orderBy: "recipeId",
      });
      setMenuRecipes(data);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0);

      // Lấy thông tin chi tiết của Recipe cho từng MenuRecipe
      const recipePromises = data.map(async (menuRecipe) => {
        try {
          const recipe = await getRecipeById(menuRecipe.recipeId);
          return { recipeId: menuRecipe.recipeId, recipe };
        } catch (err) {
          console.error(`Error fetching recipe with id ${menuRecipe.recipeId}:`, err);
          return { recipeId: menuRecipe.recipeId, recipe: null };
        }
      });
      const recipesData = await Promise.all(recipePromises);
      const recipesMap = recipesData.reduce((acc, { recipeId, recipe }) => {
        if (recipe) {
          acc[recipeId] = recipe;
        }
        return acc;
      }, {} as { [key: number]: RecipeDTO });
      setRecipes(recipesMap);
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải danh sách công thức trong thực đơn");
      console.error("Error fetching menu recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 10;
    setPageSize(size);
    setPageNumber(1);
  };

  return (
    <Layout title="Quản lý công thức trong thực đơn" subtitle="Xem và quản lý các công thức trong thực đơn">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý công thức trong thực đơn
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý liên kết giữa công thức và thực đơn.
        </Typography>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số công thức mỗi trang"
              type="number"
              value={pageSize}
              onChange={handlePageSizeChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)}
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        </Grid>

        {/* Bảng danh sách công thức */}
        <Paper sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 3 }}>
              {error}
            </Typography>
          ) : menuRecipes.length === 0 ? (
            <Typography sx={{ p: 3 }}>Không có công thức nào trong thực đơn để hiển thị.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Menu History ID</TableCell>
                  <TableCell>Recipe ID</TableCell>
                  <TableCell>Tên công thức</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Thời gian nấu (phút)</TableCell>
                  <TableCell>Kích thước khẩu phần</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuRecipes.map((item) => {
                  const recipe = recipes[item.recipeId];
                  return (
                    <TableRow key={item.menuRecipeId}>
                      <TableCell>{item.menuRecipeId}</TableCell>
                      <TableCell>{item.menuHistoryId}</TableCell>
                      <TableCell>{item.recipeId}</TableCell>
                      <TableCell>{recipe ? recipe.name : "Đang tải..."}</TableCell>
                      <TableCell>{recipe ? recipe.description : "Đang tải..."}</TableCell>
                      <TableCell>{recipe ? recipe.cookingTime : "Đang tải..."}</TableCell>
                      <TableCell>{item.servingSize}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default MenuRecipesPage;