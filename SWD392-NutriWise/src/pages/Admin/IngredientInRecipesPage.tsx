// src/pages/IngredientInRecipesPage.tsx
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
} from "@mui/material";
import Layout from "../../components/Admin/Layout";
import {
  getAllIngredientInRecipes,
  createIngredientInRecipe,
  updateIngredientInRecipe,
  deleteIngredientInRecipe,
} from "../../api/ingredientInRecipeApi";
import { IngredientInRecipeDTO, CreateIngredientInRecipeDTO, UpdateIngredientInRecipeDTO } from "../../types/types";

const IngredientInRecipesPage: React.FC = () => {
  const [items, setItems] = useState<IngredientInRecipeDTO[]>([]);
  const [newItem, setNewItem] = useState<CreateIngredientInRecipeDTO>({
    recipeId: 0,
    ingredientId: 0,
    quantity: 0,
    unit: null, // Sử dụng null thay vì chuỗi rỗng
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load danh sách liên kết nguyên liệu trong công thức
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getAllIngredientInRecipes();
      setItems(data);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách nguyên liệu trong công thức");
      console.error(err);
    }
  };

  const addOrUpdateItem = async () => {
    if (newItem.recipeId === 0 || newItem.ingredientId === 0 || newItem.quantity === 0) {
      alert("Vui lòng điền đầy đủ thông tin: Recipe ID, Ingredient ID, và Số lượng");
      return;
    }

    try {
      if (isEditing && currentItemId !== null) {
        const updateData: UpdateIngredientInRecipeDTO = {
          ingredientId: newItem.ingredientId,
          quantity: newItem.quantity,
          unit: newItem.unit,
        };
        const updatedItem = await updateIngredientInRecipe(currentItemId, updateData);
        setItems(
          items.map((item) =>
            item.ingredientInRecipeId === updatedItem.ingredientInRecipeId ? updatedItem : item
          )
        );
        setIsEditing(false);
        setCurrentItemId(null);
      } else {
        // Tạo mới liên kết với CreateIngredientInRecipeDTO
        const createdItem = await createIngredientInRecipe({
          recipeId: newItem.recipeId,
          ingredientId: newItem.ingredientId,
          quantity: newItem.quantity,
          unit: newItem.unit,
          ingredientInRecipeId: 0
        });
        // Kiểm tra và bổ sung dữ liệu nếu cần
        const fullCreatedItem: IngredientInRecipeDTO = {
          ...createdItem,
          ingredientInRecipeId: createdItem.ingredientInRecipeId || 0, // Đảm bảo có ingredientInRecipeId
          ingredientName: createdItem.ingredientName || "Không xác định", // Đảm bảo có ingredientName
        };
        setItems([...items, fullCreatedItem]);
      }
      setNewItem({ recipeId: 0, ingredientId: 0, quantity: 0, unit: null });
      fetchItems();
    } catch (err) {
      alert(isEditing ? "Không thể cập nhật liên kết" : "Không thể thêm liên kết");
      console.error(err);
    }
  };

  const deleteItemHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa liên kết này?")) {
      try {
        await deleteIngredientInRecipe(id);
        setItems(items.filter((item) => item.ingredientInRecipeId !== id));
      } catch (err) {
        alert("Không thể xóa liên kết");
        console.error(err);
      }
    }
  };

  const editItem = (item: IngredientInRecipeDTO) => {
    setNewItem({
      recipeId: item.recipeId,
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit ?? null,
    });
    setIsEditing(true);
    setCurrentItemId(item.ingredientInRecipeId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "recipeId" || name === "ingredientId" || name === "quantity" ? Number(value) : value || null,
    }));
  };

  return (
    <Layout title="Quản lý nguyên liệu trong công thức" subtitle="Xem và quản lý các nguyên liệu trong công thức">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý nguyên liệu trong công thức
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý liên kết giữa nguyên liệu và công thức.
        </Typography>

        {/* Form thêm hoặc cập nhật liên kết */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
          {isEditing ? "Cập nhật liên kết" : "Thêm liên kết mới"}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Recipe ID"
              name="recipeId"
              type="number"
              value={newItem.recipeId || ""}
              onChange={handleInputChange}
              disabled={isEditing} // Không cho phép chỉnh sửa Recipe ID khi cập nhật
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Ingredient ID"
              name="ingredientId"
              type="number"
              value={newItem.ingredientId || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Số lượng"
              name="quantity"
              type="number"
              value={newItem.quantity || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Đơn vị"
              name="unit"
              value={newItem.unit || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={addOrUpdateItem}
              variant="contained"
              color="primary"
              sx={{ width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
            >
              {isEditing ? "Cập nhật liên kết" : "Thêm liên kết"}
            </Button>
          </Grid>
        </Grid>

        {/* Bảng danh sách liên kết */}
        <Paper sx={{ mt: 2 }}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Recipe ID</TableCell>
                  <TableCell>Tên nguyên liệu</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>Không có liên kết nào để hiển thị.</TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.ingredientInRecipeId}>
                      <TableCell>{item.ingredientInRecipeId}</TableCell>
                      <TableCell>{item.recipeId}</TableCell>
                      <TableCell>{item.ingredientName || "Không xác định"}</TableCell>
                      <TableCell>{item.quantity} {item.unit || ""}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => editItem(item)}
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          onClick={() => deleteItemHandler(item.ingredientInRecipeId)}
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
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default IngredientInRecipesPage;