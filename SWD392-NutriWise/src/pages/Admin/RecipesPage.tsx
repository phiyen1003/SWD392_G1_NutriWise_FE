import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  Grid,
  CardMedia,
  CardContent,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
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
} from "../../api/recipeImageApi";
import { RecipeDTO, UpdateRecipeDTO, RecipeImageDTO } from "../../types/types";

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [allRecipes, setAllRecipes] = useState<RecipeDTO[]>([]); // Lưu tất cả công thức
  const [newRecipe, setNewRecipe] = useState<Partial<RecipeDTO>>({
    name: "",
    description: "",
    categoryId: 0,
    cookingTime: 0,
    servings: 0,
  });
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeImages, setRecipeImages] = useState<{ [key: number]: RecipeImageDTO[] }>({});
  const [customImageUrls, setCustomImageUrls] = useState<{ [key: number]: string }>({});
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const savedCustomImageUrls = localStorage.getItem("customImageUrls");
    if (savedCustomImageUrls) {
      setCustomImageUrls(JSON.parse(savedCustomImageUrls));
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    // Phân trang phía client
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const recipesData = allRecipes.slice(startIndex, endIndex);
    setRecipes(recipesData);

    const imagePromises = recipesData.map(async (recipe) => {
      const images: RecipeImageDTO[] = await getRecipeImagesByRecipeId(recipe.recipeId);
      return { recipeId: recipe.recipeId, images };
    });
    Promise.all(imagePromises).then((imagesData) => {
      const imagesMap = imagesData.reduce(
        (acc: { [key: number]: RecipeImageDTO[] }, { recipeId, images }) => {
          acc[recipeId] = images;
          return acc;
        },
        {}
      );
      setRecipeImages(imagesMap);
    });
  }, [pageNumber, pageSize, allRecipes]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<RecipeDTO[]> = await getAllRecipes({ OrderBy: "name" });
      const recipesData: RecipeDTO[] = response.data;
      console.log("All recipes:", recipesData);

      setAllRecipes(recipesData);
      setTotalItems(recipesData.length);
      console.log("Set totalItems:", recipesData.length);
      console.log("Calculated pages:", Math.ceil(recipesData.length / pageSize));
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách công thức hoặc hình ảnh");
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async () => {
    if (!newRecipe.name || newRecipe.categoryId === 0 || newRecipe.cookingTime === 0 || newRecipe.servings === 0) {
      setError("Vui lòng điền đầy đủ thông tin: Tên, Category ID, Thời gian nấu, và Số khẩu phần");
      return;
    }

    try {
      setError(null);
      if (isEditing && currentRecipeId !== null) {
        const updateData: UpdateRecipeDTO = {
          name: newRecipe.name,
          description: newRecipe.description,
          categoryId: newRecipe.categoryId,
          cookingTime: newRecipe.cookingTime,
          servings: newRecipe.servings,
        };
        const updatedRecipe = await updateRecipe(currentRecipeId, updateData);
        setAllRecipes(allRecipes.map((recipe) => (recipe.recipeId === updatedRecipe.recipeId ? updatedRecipe : recipe)));
        if (customImageUrl) {
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [updatedRecipe.recipeId]: customImageUrl };
            localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }
        setIsEditing(false);
        setCurrentRecipeId(null);
      } else {
        const recipeToCreate: RecipeDTO = {
          recipeId: 0,
          name: newRecipe.name!,
          description: newRecipe.description || "",
          categoryId: newRecipe.categoryId!,
          categoryName: "",
          cookingTime: newRecipe.cookingTime!,
          servings: newRecipe.servings!,
        };
        const createdRecipe = await createRecipe(recipeToCreate);
        setAllRecipes([...allRecipes, createdRecipe]);
        if (customImageUrl) {
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [createdRecipe.recipeId]: customImageUrl };
            localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }
      }
      setNewRecipe({ name: "", description: "", categoryId: 0, cookingTime: 0, servings: 0 });
      setCustomImageUrl("");
    } catch (err: any) {
      setError(isEditing ? "Không thể cập nhật công thức" : "Không thể thêm công thức");
    }
  };

  const deleteRecipeHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      try {
        await deleteRecipe(id);
        setAllRecipes(allRecipes.filter((recipe) => recipe.recipeId !== id));
        setCustomImageUrls((prev) => {
          const newCustomImageUrls = { ...prev };
          delete newCustomImageUrls[id];
          localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
          return newCustomImageUrls;
        });
      } catch (err: any) {
        setError("Không thể xóa công thức");
      }
    }
  };

  const editRecipe = (recipe: RecipeDTO) => {
    setNewRecipe({ ...recipe });
    setCustomImageUrl(customImageUrls[recipe.recipeId] || getImageUrl(recipe.recipeId));
    setIsEditing(true);
    setCurrentRecipeId(recipe.recipeId);
  };

  const getImageUrl = (recipeId: number): string => {
    if (customImageUrls[recipeId]) {
      return customImageUrls[recipeId];
    }
    const images = recipeImages[recipeId];
    return images && images.length > 0
      ? images[0].imageUrl ?? "https://picsum.photos/300"
      : "https://picsum.photos/300";
  };

  const handleImageUpload = async () => {
    if (!selectedRecipeId || filesToUpload.length === 0) {
      setError("Vui lòng chọn ít nhất một hình ảnh để tải lên.");
      return;
    }

    const validationError = validateFiles(filesToUpload);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const uploadedImages = await uploadRecipeImages(selectedRecipeId, filesToUpload);
      setRecipeImages((prev) => ({
        ...prev,
        [selectedRecipeId]: [...(prev[selectedRecipeId] || []), ...uploadedImages],
      }));
      setOpenUploadDialog(false);
      setFilesToUpload([]);
    } catch (err: any) {
      setError("Không thể tải lên hình ảnh");
    }
  };

  const validateFiles = (files: File[]): string | null => {
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log("Changing to page:", value);
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Math.min(parseInt(e.target.value) || 6, 20);
    console.log("New pageSize:", size);
    setPageSize(size);
    setPageNumber(1);
  };

  return (
    <Layout title="Quản lý công thức" subtitle="Xem và quản lý các công thức">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          {isEditing ? "Cập nhật Công thức" : "Thêm Công thức Mới"}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL Hình ảnh (tùy chọn)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Ví dụ: https://example.com/image.jpg"
            />
          </Grid>
          {customImageUrl && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Xem trước hình ảnh:
              </Typography>
              <CardMedia
                component="img"
                height="100"
                image={customImageUrl || "https://picsum.photos/300"}
                alt="Preview"
                sx={{ objectFit: "contain" }}
              />
            </Grid>
          )}
        </Grid>
        <Button
          onClick={addRecipe}
          variant="contained"
          color="primary"
          sx={{ mb: 4, width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
        >
          {isEditing ? "Cập nhật công thức" : "Thêm công thức"}
        </Button>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {recipes.length === 0 ? (
              <Typography>Không có công thức nào để hiển thị.</Typography>
            ) : (
              recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.recipeId}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      minHeight: "450px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(recipe.recipeId)}
                      alt={`Recipe ${recipe.name}`}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "16px",
                      }}
                    >
                      <Box>
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
                          label={`Category: ${recipe.categoryName || recipe.categoryId}`}
                          color="secondary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        <Grid item>
                          <Button onClick={() => editRecipe(recipe)} color="primary" variant="outlined">
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
                        <Grid item>
                          <Button
                            onClick={() => {
                              setSelectedRecipeId(recipe.recipeId);
                              setOpenUploadDialog(true);
                            }}
                            color="primary"
                            variant="outlined"
                          >
                            Tải lên ảnh
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
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
            <Button onClick={handleImageUpload} disabled={filesToUpload.length === 0}>
              Tải Lên
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default RecipePage;