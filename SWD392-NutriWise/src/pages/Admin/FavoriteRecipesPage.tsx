import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getAllFavorites } from "../../api/favoriteRecipeApi";
import { FavoriteRecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const FavoriteRecipesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipeDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllFavorites({
          PageNumber: pageNumber,
          PageSize: pageSize,
          OrderBy: "addedDate",
        });
        console.log("Processed API response:", response);
        setFavorites(response.data || []);
        setTotalItems(response.total || 0);
      } catch (error: any) {
        setError("Không thể tải danh sách công thức yêu thích: " + (error.message || "Lỗi không xác định"));
        console.error("Error fetching favorites:", error);
        setFavorites([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [pageNumber, pageSize]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Math.min(parseInt(e.target.value) || 5, 20);
    setPageSize(size);
    setPageNumber(1);
  };

  return (
    <Layout title="Quản lý công thức yêu thích" subtitle="Xem và quản lý các công thức yêu thích">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý công thức yêu thích
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Xem và quản lý danh sách công thức yêu thích của người dùng.
        </Typography>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số bản ghi mỗi trang"
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

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên công thức</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Ngày thêm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favorites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có công thức yêu thích nào để hiển thị.
                    </TableCell>
                  </TableRow>
                ) : (
                  favorites.map((fav) => (
                    <TableRow key={fav.favoriteRecipeId}>
                      <TableCell>{fav.favoriteRecipeId}</TableCell>
                      <TableCell>{fav.recipeName || "Không có tên công thức"}</TableCell>
                      <TableCell>{fav.userId}</TableCell>
                      <TableCell>{fav.userName || "Không có tên người dùng"}</TableCell>
                      <TableCell>
                        {fav.addedDate ? new Date(fav.addedDate).toLocaleString() : "Không có ngày"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default FavoriteRecipesPage;