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
  ImageList,
  ImageListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import { AxiosResponse } from "axios";
import Layout from "../../components/Admin/Layout";
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../../api/recipeApi";
import {
  getRecipeImagesByRecipeId,
  uploadRecipeImages,
  deleteRecipeImage,
} from "../../api/recipeImageApi";
import { RecipeDTO, UpdateRecipeDTO, RecipeImageDTO } from "../../types/types";

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
  const [recipeImages, setRecipeImages] = useState<Record<number, RecipeImageDTO[]>>({});
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

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
    Description: undefined,
    CategoryId: undefined,
    "CookingTime.Min": undefined,
    "CookingTime.Max": undefined,
    "Servings.Min": undefined,
    "Servings.Max": undefined,
    CombineWith: undefined,
  });
  const [totalPages, setTotalPages] = useState<number>(1);

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
    Description: undefined,
    CategoryId: undefined,
    "CookingTime.Min": undefined,
    "CookingTime.Max": undefined,
    "Servings.Min": undefined,
    "Servings.Max": undefined,
    CombineWith: undefined,
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const buildParams = (filters: any): Record<string, any> => {
    const params: Record<string, any> = {};
    for (const key in filters) {
      const value = filters[key];
      if (value === undefined) continue;
      if (key === "Description" && value === "") continue;
      params[key] = value;
    }
    return params;
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = buildParams(filters);
      const response: AxiosResponse<RecipeDTO[]> = await getAllRecipes(params);
      setRecipes(response.data);
      const paginationHeader = response.headers["x-pagination"];
      if (paginationHeader) {
        const pagination = JSON.parse(paginationHeader);
        setTotalPages(pagination.TotalPages || 1);
      } else {
        setTotalPages(1);
      }
      await Promise.all(
        response.data.map(async (recipe: RecipeDTO) => {
          try {
            const images = await getRecipeImagesByRecipeId(recipe.recipeId);
            setRecipeImages((prev) => ({ ...prev, [recipe.recipeId]: images }));
          } catch (err) {
            console.error(`Failed to fetch images for recipe ${recipe.recipeId}`);
          }
        })
      );
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

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>
  ) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name!]: value === "" ? undefined : typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
    }));
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...tempFilters,
      PageNumber: 1,
    }));
    fetchRecipes();
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, PageNumber: page }));
    fetchRecipes();
  };

  const validateFiles = (files: File[]) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return "Chỉ chấp nhận file hình ảnh (jpg, png, gif).";
      }
      if (file.size > maxSize) {
        return `Kích thước file vượt quá 5MB.`;
      }
    }
    return null;
  };

  const handleImageUpload = async () => {
    if (!selectedRecipeId || filesToUpload.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh để tải lên.");
      return;
    }

    if (!recipes.some((recipe) => recipe.recipeId === selectedRecipeId)) {
      alert("Recipe ID không hợp lệ. Vui lòng thử lại.");
      return;
    }

    const validationError = validateFiles(filesToUpload);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      console.log("Uploading files for recipeId:", selectedRecipeId);
      console.log("Files to upload:", filesToUpload);

      const formData = new FormData();
      formData.append("recipeId", selectedRecipeId.toString());
      filesToUpload.forEach((file, index) => {
        formData.append("files", file);
        console.log(`Appending file ${index + 1}:`, file.name, file.type, file.size);
      });

      for (let pair of (formData as any).entries()) {
        console.log(`FormData entry: ${pair[0]}`, pair[1]);
      }

      const response = await uploadRecipeImages(selectedRecipeId, filesToUpload);
      console.log("Upload successful, response:", response);

      setRecipeImages((prev) => ({
        ...prev,
        [selectedRecipeId]: [...(prev[selectedRecipeId] || []), ...response],
      }));
      setOpenUploadDialog(false);
      setFilesToUpload([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải lên hình ảnh";
      console.error("Upload error:", err);
      alert(`Lỗi: ${errorMessage}. Vui lòng kiểm tra console và network tab để biết thêm chi tiết.`);
    }
  };

  const handleDeleteImage = async (recipeId: number, imageId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa hình ảnh này?")) {
      try {
        await deleteRecipeImage(imageId);
        setRecipeImages((prev) => ({
          ...prev,
          [recipeId]: prev[recipeId]?.filter((image) => image.recipeImageId !== imageId) || [],
        }));
      } catch (err) {
        alert("Không thể xóa hình ảnh");
        console.error(err);
      }
    }
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
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Combine With</InputLabel>
              <Select
                name="CombineWith"
                value={tempFilters.CombineWith ?? ""}
                onChange={handleFilterChange}
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
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Hình ảnh:</Typography>
                          <ImageList sx={{ width: 300, height: 150 }} cols={3} rowHeight={100}>
                            {recipeImages[recipe.recipeId]?.map((image) => (
                              <ImageListItem key={image.recipeImageId}>
                                <img
                                  src={image.imageUrl || ""}
                                  alt={recipe.name ?? ""}
                                  loading="lazy"
                                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                                <Button
                                  onClick={() => handleDeleteImage(recipe.recipeId, image.recipeId)}
                                  color="secondary"
                                  variant="outlined"
                                  size="small"
                                  sx={{ mt: 1 }}
                                >
                                  Xóa
                                </Button>
                              </ImageListItem>
                            ))}
                          </ImageList>
                          <Button
                            onClick={() => {
                              setSelectedRecipeId(recipe.recipeId);
                              setOpenUploadDialog(true);
                            }}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                          >
                            Tải Lên Hình Ảnh
                          </Button>
                        </Box>
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

        <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
          <DialogTitle>Tải Lên Hình Ảnh Cho Công Thức</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <input
                type="file"
                multiple
                onChange={(e) => setFilesToUpload(Array.from(e.target.files || []))}
                accept="image/*"
                style={{ marginBottom: "16px" }}
              />
              {filesToUpload.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Đã chọn {filesToUpload.length} file(s):{" "}
                  {filesToUpload.map((file) => file.name).join(", ")}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUploadDialog(false)}>Hủy</Button>
            <Button
              onClick={handleImageUpload}
              disabled={filesToUpload.length === 0}
            >
              Tải Lên
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default RecipePage;