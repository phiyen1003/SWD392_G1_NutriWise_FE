// src/pages/admin/RecipePage.tsx
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
} from "@mui/material";
import Layout from "../../components/Admin/Layout";
import { createRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../../api/recipeApi";
import { getRecipeImagesByRecipeId, uploadRecipeImage } from "../../api/recipeImageApi";
import { RecipeDTO, UpdateRecipeDTO, RecipeImageDTO } from "../../types/types";

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [newRecipe, setNewRecipe] = useState<Partial<RecipeDTO & { imageUrl?: string }>>({
    recipeId: 0,
    name: "",
    description: "",
    categoryId: 0,
    cookingTime: 0,
    servings: 0,
    categoryName: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeImages, setRecipeImages] = useState<{ [key: number]: RecipeImageDTO[] }>({}); // Lưu hình ảnh từ API
  const [customImageUrls, setCustomImageUrls] = useState<{ [key: number]: string }>({}); // Lưu URL tùy chỉnh

  useEffect(() => {
    const savedCustomImageUrls = localStorage.getItem("customImageUrlsForRecipes");
    if (savedCustomImageUrls) {
      setCustomImageUrls(JSON.parse(savedCustomImageUrls));
    }
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const recipesData = await getAllRecipes();
      setRecipes(recipesData);

      const imagePromises = recipesData.map(async (recipe) => {
        const images = await getRecipeImagesByRecipeId(recipe.recipeId);
        return { recipeId: recipe.recipeId, images };
      });
      const imagesData = await Promise.all(imagePromises);
      const imagesMap = imagesData.reduce((acc, { recipeId, images }) => {
        acc[recipeId] = images;
        return acc;
      }, {} as { [key: number]: RecipeImageDTO[] });
      setRecipeImages(imagesMap);
      console.log("recipeImages:", imagesMap);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách recipe hoặc hình ảnh");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async () => {
    if (
      !newRecipe.name ||
      !newRecipe.description ||
      !newRecipe.categoryId ||
      !newRecipe.cookingTime ||
      !newRecipe.servings
    ) {
      alert("Vui lòng điền đầy đủ thông tin: Tên, Mô tả, Category ID, Thời gian nấu, và Số khẩu phần");
      return;
    }

    try {
      let recipeId: number;

      if (isEditing && currentRecipeId !== null) {
        const updateData: UpdateRecipeDTO = {
          name: newRecipe.name,
          description: newRecipe.description,
          categoryId: newRecipe.categoryId,
          cookingTime: newRecipe.cookingTime,
          servings: newRecipe.servings,
        };
        const updatedRecipe = await updateRecipe(currentRecipeId, updateData);
        if (!updatedRecipe || !updatedRecipe.recipeId) {
          throw new Error("Dữ liệu trả về từ API không hợp lệ khi cập nhật recipe");
        }

        recipeId = updatedRecipe.recipeId;

        // Cập nhật URL tùy chỉnh nếu có
        if (newRecipe.imageUrl) {
          const updatedImage = await uploadRecipeImage(recipeId, newRecipe.imageUrl);
          setRecipeImages((prev) => ({
            ...prev,
            [recipeId]: [updatedImage], // Chỉ giữ 1 hình ảnh
          }));
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [recipeId]: newRecipe.imageUrl! };
            localStorage.setItem("customImageUrlsForRecipes", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }

        // Cập nhật state recipes ngay lập tức
        setRecipes(recipes.map((recipe) => (recipe.recipeId === updatedRecipe.recipeId ? updatedRecipe : recipe)));
        setIsEditing(false);
        setCurrentRecipeId(null);
      } else {
        const createdRecipe = await createRecipe(newRecipe as RecipeDTO);
        if (!createdRecipe || !createdRecipe.recipeId) {
          throw new Error("Dữ liệu trả về từ API không hợp lệ khi tạo recipe");
        }

        recipeId = createdRecipe.recipeId;

        // Thêm URL tùy chỉnh nếu có
        if (newRecipe.imageUrl) {
          const newImage = await uploadRecipeImage(recipeId, newRecipe.imageUrl);
          setRecipeImages((prev) => ({
            ...prev,
            [recipeId]: [newImage], // Chỉ giữ 1 hình ảnh
          }));
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [recipeId]: newRecipe.imageUrl! };
            localStorage.setItem("customImageUrlsForRecipes", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }

        // Cập nhật state recipes ngay lập tức
        setRecipes([...recipes, createdRecipe]);
      }

      setNewRecipe({
        recipeId: 0,
        name: "",
        description: "",
        categoryId: 0,
        cookingTime: 0,
        servings: 0,
        categoryName: "",
        imageUrl: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
      alert(
        `${isEditing ? "Không thể cập nhật recipe" : "Không thể thêm recipe"}: ${errorMessage}`
      );
      console.error("Lỗi trong addRecipe:", err);
    }
  };

  const deleteRecipeHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa recipe này?")) {
      try {
        await deleteRecipe(id);
        // Cập nhật state recipes ngay lập tức
        setRecipes(recipes.filter((recipe) => recipe.recipeId !== id));
        // Xóa URL tùy chỉnh liên quan
        setCustomImageUrls((prev) => {
          const newCustomImageUrls = { ...prev };
          delete newCustomImageUrls[id];
          localStorage.setItem("customImageUrlsForRecipes", JSON.stringify(newCustomImageUrls));
          return newCustomImageUrls;
        });
        // Xóa hình ảnh liên quan khỏi state
        setRecipeImages((prev) => {
          const updatedImages = { ...prev };
          delete updatedImages[id];
          return updatedImages;
        });
      } catch (err) {
        alert("Không thể xóa recipe");
        console.error(err);
      }
    }
  };

  const editRecipe = (recipe: RecipeDTO) => {
    const firstImageUrl = getImageUrl(recipe.recipeId);
    setNewRecipe({ ...recipe, imageUrl: customImageUrls[recipe.recipeId] || firstImageUrl });
    setIsEditing(true);
    setCurrentRecipeId(recipe.recipeId);
  };

  const getImageUrl = (recipeId: number): string => {
    if (customImageUrls[recipeId]) {
      console.log("Using customImageUrl:", customImageUrls[recipeId]);
      return customImageUrls[recipeId] || "https://picsum.photos/200";
    }
    if (isEditing || (!isEditing && newRecipe.recipeId === recipeId && newRecipe.imageUrl)) {
      console.log("Using newRecipe.imageUrl:", newRecipe.imageUrl);
      return newRecipe.imageUrl || "https://picsum.photos/200";
    }
    const images = recipeImages[recipeId] || [];
    console.log("Using recipeImages:", images);
    return images.length > 0 ? images[0].imageUrl || "https://picsum.photos/200" : "https://picsum.photos/200";
  };

  return (
    <Layout title="Quản lý Recipe" subtitle="Xem và quản lý các công thức">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Thêm hoặc Cập nhật Recipe
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Tên Recipe"
              value={newRecipe.name || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
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
              value={newRecipe.imageUrl || ""}
              onChange={(e) => setNewRecipe({ ...newRecipe, imageUrl: e.target.value })}
              placeholder="Ví dụ: https://example.com/image.jpg"
            />
          </Grid>
          {newRecipe.imageUrl && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Xem trước hình ảnh:
              </Typography>
              <CardMedia
                component="img"
                height="100"
                image={newRecipe.imageUrl || "https://picsum.photos/200"}
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
          {isEditing ? "Cập nhật Recipe" : "Thêm Recipe"}
        </Button>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {recipes.length === 0 ? (
              <Typography>Không có recipe nào để hiển thị.</Typography>
            ) : (
              recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.recipeId}>
                  <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(recipe.recipeId)}
                      alt={`Recipe ${recipe.recipeId}`}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#424242" }}>
                        Recipe ID: {recipe.recipeId}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Tên: {recipe.name ?? "Không có tên"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Mô tả: {recipe.description ?? "Không có mô tả"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Danh mục: {recipe.categoryName ?? `ID: ${recipe.categoryId}`}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Thời gian nấu: {recipe.cookingTime} phút
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        Số khẩu phần: {recipe.servings}
                      </Typography>
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
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default RecipePage;