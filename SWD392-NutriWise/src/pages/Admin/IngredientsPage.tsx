// src/pages/IngredientsPage.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Layout from "../../components/Admin/Layout";
import {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../../api/ingredientApi";
import { IngredientDTO, CreateIngredientDTO, UpdateIngredientDTO } from "../../types/types";
import apiClient from "../../api/apiClient";
import { CustomPagination } from "../../components/PagingComponent";

const IngredientsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [newIngredient, setNewIngredient] = useState<CreateIngredientDTO>({
    name: "",
    description: "",
    isAllergen: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentIngredientId, setCurrentIngredientId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof IngredientDTO>("ingredientId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  // Load danh sách nguyên liệu khi component mount
  useEffect(() => {
    fetchIngredients();
  }, [currentPage]);

  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get(`/Ingredient/all-ingredients?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`)
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setIngredients(response.data);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách nguyên liệu");
      console.error(err);
    }
  };

  const addOrUpdateIngredient = async () => {
    if (!newIngredient.name) {
      alert("Vui lòng điền tên nguyên liệu");
      return;
    }

    try {
      if (isEditing && currentIngredientId !== null) {
        const updateData: UpdateIngredientDTO = {
          name: newIngredient.name,
          description: newIngredient.description,
          isAllergen: newIngredient.isAllergen,
        };
        const updatedIngredient = await updateIngredient(currentIngredientId, updateData);
        setIngredients(
          ingredients.map((ingredient) =>
            ingredient.ingredientId === updatedIngredient.ingredientId ? updatedIngredient : ingredient
          )
        );
        setIsEditing(false);
        setCurrentIngredientId(null);
      } else {
        // Tạo mới nguyên liệu với CreateIngredientDTO
        const createdIngredient = await createIngredient({
          name: newIngredient.name,
          description: newIngredient.description,
          isAllergen: newIngredient.isAllergen,
          ingredientId: 0
        });
        setIngredients([...ingredients, createdIngredient]);
      }
      setNewIngredient({ name: "", description: "", isAllergen: false });
      fetchIngredients();
    } catch (err) {
      alert(isEditing ? "Không thể cập nhật nguyên liệu" : "Không thể thêm nguyên liệu");
      console.error(err);
    }
  };

  const deleteIngredientHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa nguyên liệu này?")) {
      try {
        await deleteIngredient(id);
        setIngredients(ingredients.filter((ingredient) => ingredient.ingredientId !== id));
      } catch (err) {
        alert("Không thể xóa nguyên liệu");
        console.error(err);
      }
    }
  };

  const editIngredient = (ingredient: IngredientDTO) => {
    setNewIngredient({
      name: ingredient.name ?? "",
      description: ingredient.description ?? "",
      isAllergen: ingredient.isAllergen,
    });
    setIsEditing(true);
    setCurrentIngredientId(ingredient.ingredientId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewIngredient((prev) => ({
      ...prev,
      isAllergen: e.target.checked,
    }));
  };

  return (
    <Layout title="Quản lý nguyên liệu" subtitle="Xem và quản lý các nguyên liệu">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý nguyên liệu
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý danh sách nguyên liệu trong hệ thống.
        </Typography>

        {/* Form thêm hoặc cập nhật nguyên liệu */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
          {isEditing ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu mới"}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Tên nguyên liệu"
              name="name"
              value={newIngredient.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={newIngredient.description || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={newIngredient.isAllergen}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Là chất gây dị ứng"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={addOrUpdateIngredient}
              variant="contained"
              color="primary"
              sx={{ width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
            >
              {isEditing ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu"}
            </Button>
          </Grid>
        </Grid>

        {/* Bảng danh sách nguyên liệu */}
        <Paper sx={{ mt: 2 }}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Là chất gây dị ứng</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ingredients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>Không có nguyên liệu nào để hiển thị.</TableCell>
                    </TableRow>
                  ) : (
                    ingredients.map((ingredient) => (
                      <TableRow key={ingredient.ingredientId}>
                        <TableCell>{ingredient.ingredientId}</TableCell>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.description || "Không có mô tả"}</TableCell>
                        <TableCell>{ingredient.isAllergen ? "Có" : "Không"}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => editIngredient(ingredient)}
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            onClick={() => deleteIngredientHandler(ingredient.ingredientId)}
                            color="secondary"
                            variant="outlined"
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default IngredientsPage;