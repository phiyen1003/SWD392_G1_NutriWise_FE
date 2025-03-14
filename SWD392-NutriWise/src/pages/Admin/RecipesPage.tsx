// src/pages/RecipePage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Container,
  Typography,
  Card,
  Grid,
  CardContent,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Layout from "../../components/Admin/Layout";
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../../api/recipeApi";
import { RecipeDTO, UpdateRecipeDTO } from "../../types/types";

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [newRecipe, setNewRecipe] = useState<Partial<RecipeDTO>>({
    name: "",
    description: "",
    categoryId: 0,
    cookingTime: 0,
    servings: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter và pagination state với giá trị mặc định
  const [filters, setFilters] = useState<{
    PageNumber: number;
    PageSize: number;
    OrderBy?: string;
    Description?: string;
    CategoryId?: number;
    "CookingTime.Min"?: number;
    "CookingTime.Max"?: number;
    "Servings.Min"?: number;
    "Servings.Max"?: number;
    CombineWith?: number;
  }>({
    PageNumber: 1,
    PageSize: 6,
    Description: "",
    CategoryId: undefined,
    "CookingTime.Min": undefined,
    "CookingTime.Max": undefined,
    "Servings.Min": undefined,
    "Servings.Max": undefined,
    CombineWith: undefined,
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  // State tạm để lưu giá trị bộ lọc trước khi áp dụng
  const [tempFilters, setTempFilters] = useState<{
    OrderBy?: string;
    Description?: string;
    CategoryId?: number;
    "CookingTime.Min"?: number;
    "CookingTime.Max"?: number;
    "Servings.Min"?: number;
    "Servings.Max"?: number;
    CombineWith?: number;
  }>({
    OrderBy: "",
    Description: "",
    CategoryId: undefined,
    "CookingTime.Min": undefined,
    "CookingTime.Max": undefined,
    "Servings.Min": undefined,
    "Servings.Max": undefined,
    CombineWith: undefined,
  });

  // Chỉ gọi fetchRecipes lần đầu tiên khi component mount
  useEffect(() => {
    fetchRecipes();
  }, []); // Không phụ thuộc vào filters.PageNumber, filters.PageSize

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const recipesData = await getAllRecipes(filters);
      setRecipes(recipesData);
      const totalRecipes = 100; // Giả định, thay bằng giá trị thực từ API
      setTotalPages(Math.ceil(totalRecipes / filters.PageSize));
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách công thức");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async () => {
    if (!newRecipe.name || newRecipe.categoryId === 0 || newRecipe.cookingTime === 0 || newRecipe.servings === 0) {
      alert("Vui lòng điền đầy đủ thông tin: Tên, Category ID, Thời gian nấu, và Số khẩu phần");
      return;
    }

    try {
      if (isEditing && currentRecipeId !== null) {
        const updateData: UpdateRecipeDTO = {
          name: newRecipe.name,
          description: newRecipe.description,
          categoryId: newRecipe.categoryId,
          cookingTime: newRecipe.cookingTime,
          servings: newRecipe.servings,
        };
        const updatedRecipe = await updateRecipe(currentRecipeId, updateData);
        setRecipes(recipes.map((recipe) => (recipe.recipeId === updatedRecipe.recipeId ? updatedRecipe : recipe)));
        setIsEditing(false);
        setCurrentRecipeId(null);
      } else {
        const createdRecipe = await createRecipe(newRecipe as RecipeDTO);
        setRecipes([...recipes, createdRecipe]);
      }
      setNewRecipe({ name: "", description: "", categoryId: 0, cookingTime: 0, servings: 0 });
      fetchRecipes();
    } catch (err) {
      alert(isEditing ? "Không thể cập nhật công thức" : "Không thể thêm công thức");
      console.error(err);
    }
  };

  const deleteRecipeHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      try {
        await deleteRecipe(id);
        fetchRecipes();
      } catch (err) {
        alert("Không thể xóa công thức");
        console.error(err);
      }
    }
  };

  const editRecipe = (recipe: RecipeDTO) => {
    setNewRecipe({ ...recipe });
    setIsEditing(true);
    setCurrentRecipeId(recipe.recipeId);
  };

  // Cập nhật tempFilters khi người dùng thay đổi giá trị
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name!]: value === "" ? undefined : typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
    }));
  };

  // Áp dụng bộ lọc khi nhấn nút
  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...tempFilters,
      PageNumber: 1, // Reset về trang 1 khi áp dụng bộ lọc
    }));
    fetchRecipes(); // Gọi lại API với bộ lọc mới
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
    fetchRecipes(); // Gọi lại API khi chuyển trang
  };

  return (
    <Layout title="Quản lý công thức" subtitle="Xem và quản lý các công thức">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Thêm hoặc Cập nhật Công thức
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Tên công thức"
              value={newRecipe.name || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mô tả"
              value={newRecipe.description || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Category ID"
              type="number"
              value={newRecipe.categoryId || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, categoryId: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Thời gian nấu (phút)"
              type="number"
              value={newRecipe.cookingTime || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, cookingTime: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              label="Số khẩu phần"
              type="number"
              value={newRecipe.servings || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, servings: Number(e.target.value) })}
            />
          </Grid>
        </Grid>
        <Button
          onClick={addRecipe}
          variant="contained"
          color="primary"
          sx={{ mb: 4, width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
        >
          {isEditing ? "Cập nhật công thức" : "Thêm công thức"}
        </Button>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Bộ lọc
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Mô tả"
              name="Description"
              value={tempFilters.Description || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Category ID"
              name="CategoryId"
              type="number"
              value={tempFilters.CategoryId || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Order By</InputLabel>
              <Select
                name="OrderBy"
                value={tempFilters.OrderBy || ""}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Không sắp xếp</MenuItem>
                <MenuItem value="name">Theo tên</MenuItem>
                <MenuItem value="cookingTime">Theo thời gian nấu</MenuItem>
                <MenuItem value="servings">Theo khẩu phần</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Thời gian nấu tối thiểu"
              name="CookingTime.Min"
              type="number"
              value={tempFilters["CookingTime.Min"] || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Thời gian nấu tối đa"
              name="CookingTime.Max"
              type="number"
              value={tempFilters["CookingTime.Max"] || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Khẩu phần tối thiểu"
              name="Servings.Min"
              type="number"
              value={tempFilters["Servings.Min"] || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Khẩu phần tối đa"
              name="Servings.Max"
              type="number"
              value={tempFilters["Servings.Max"] || ""}
              onChange={handleFilterChange}
              // Bỏ disabled để người dùng có thể nhập
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Combine With</InputLabel>
              <Select
                name="CombineWith"
                value={tempFilters.CombineWith ?? ""}
                onChange={handleFilterChange}
                // Bỏ disabled để người dùng có thể nhập
              >
                <MenuItem value="">Không chọn</MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={applyFilters}
              variant="contained"
              color="primary"
              sx={{ width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
            >
              Áp dụng bộ lọc
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {recipes.length === 0 ? (
                <Typography>Không có công thức nào để hiển thị.</Typography>
              ) : (
                recipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.recipeId}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#424242" }}>
                          {recipe.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                          {recipe.description || "Không có mô tả"}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                          Thời gian nấu: {recipe.cookingTime} phút
                        </Typography>
                        <Chip label={`Khẩu phần: ${recipe.servings}`} color="primary" size="small" />
                        <Chip
                          label={`Category ID: ${recipe.categoryId}`}
                          color="secondary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                        <Grid container spacing={1} sx={{ mt: 2 }}>
                          <Grid item>
                            <Button
                              onClick={() => editRecipe(recipe)}
                              color="primary"
                              variant="outlined"
                            >
                              Chỉnh sửa
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              onClick={() => deleteRecipeHandler(recipe.recipeId)}
                              color="secondary"
                              variant="outlined"
                            >
                              Xóa
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={filters.PageNumber}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default RecipePage;