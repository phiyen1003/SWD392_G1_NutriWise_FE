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
import {
  getAllMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../../api/mealApi";
import { getRecipeImagesByRecipeId } from "../../api/recipeImageApi";
import { MealDTO, UpdateMealDTO, RecipeImageDTO } from "../../types/types";

const MealsPage: React.FC = () => {
  const [meals, setMeals] = useState<MealDTO[]>([]);
  const [newMeal, setNewMeal] = useState<Partial<MealDTO & { imageUrl?: string }>>({
    healthProfileId: 0,
    mealDate: "",
    mealTime: "",
    recipeId: 0,
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentMealId, setCurrentMealId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeImages, setRecipeImages] = useState<{ [key: number]: RecipeImageDTO[] }>({});
  const [customImageUrls, setCustomImageUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const savedCustomImageUrls = localStorage.getItem("customImageUrls");
    if (savedCustomImageUrls) {
      setCustomImageUrls(JSON.parse(savedCustomImageUrls));
    }
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const mealsData = await getAllMeals();
      setMeals(mealsData);

      const imagePromises = mealsData.map(async (meal) => {
        const images = await getRecipeImagesByRecipeId(meal.recipeId);
        return { recipeId: meal.recipeId, images };
      });
      const imagesData = await Promise.all(imagePromises);
      const imagesMap = imagesData.reduce((acc, { recipeId, images }) => {
        acc[recipeId] = images;
        return acc;
      }, {} as { [key: number]: RecipeImageDTO[] });
      setRecipeImages(imagesMap);
      console.log("recipeImages:", imagesMap);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách bữa ăn hoặc hình ảnh");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async () => {
    if (!newMeal.mealDate || !newMeal.mealTime || newMeal.healthProfileId === 0 || newMeal.recipeId === 0) {
      alert("Vui lòng điền đầy đủ thông tin: Ngày, Giờ, Health Profile ID, và Recipe ID");
      return;
    }

    try {
      if (isEditing && currentMealId !== null) {
        const updateData: UpdateMealDTO = {
          mealDate: newMeal.mealDate,
          mealTime: newMeal.mealTime,
          recipeId: newMeal.recipeId,
        };
        const updatedMeal = await updateMeal(currentMealId, updateData);
        setMeals(meals.map((meal) => (meal.mealId === updatedMeal.mealId ? updatedMeal : meal)));
        if (newMeal.imageUrl) {
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [updatedMeal.recipeId]: newMeal.imageUrl! };
            localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }
        setIsEditing(false);
        setCurrentMealId(null);
      } else {
        const createdMeal = await createMeal(newMeal as MealDTO);
        setMeals([...meals, createdMeal]);
        if (newMeal.imageUrl) {
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev, [createdMeal.recipeId]: newMeal.imageUrl! };
            localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }
        const images = await getRecipeImagesByRecipeId(createdMeal.recipeId);
        setRecipeImages((prev) => ({ ...prev, [createdMeal.recipeId]: images }));
      }
      setNewMeal({ healthProfileId: 0, mealDate: "", mealTime: "", recipeId: 0, imageUrl: "" });
    } catch (err) {
      alert(isEditing ? "Không thể cập nhật bữa ăn" : "Không thể thêm bữa ăn");
      console.error(err);
    }
  };

  const deleteMealHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa bữa ăn này?")) {
      try {
        await deleteMeal(id);
        setMeals(meals.filter((meal) => meal.mealId !== id));
        const mealToDelete = meals.find((m) => m.mealId === id);
        if (mealToDelete) {
          setCustomImageUrls((prev) => {
            const newCustomImageUrls = { ...prev };
            delete newCustomImageUrls[mealToDelete.recipeId];
            localStorage.setItem("customImageUrls", JSON.stringify(newCustomImageUrls));
            return newCustomImageUrls;
          });
        }
      } catch (err) {
        alert("Không thể xóa bữa ăn");
        console.error(err);
      }
    }
  };

  const editMeal = (meal: MealDTO) => {
    const firstImageUrl = getImageUrl(meal.recipeId);
    setNewMeal({ ...meal, imageUrl: customImageUrls[meal.recipeId] || firstImageUrl });
    setIsEditing(true);
    setCurrentMealId(meal.mealId);
  };

  const getImageUrl = (recipeId: number): string => {
    if (customImageUrls[recipeId]) {
      console.log("Using customImageUrl:", customImageUrls[recipeId]);
      return customImageUrls[recipeId] || "https://picsum.photos/300"; // Đảm bảo ảnh có kích thước phù hợp
    }
    if (isEditing || (!isEditing && newMeal.recipeId === recipeId && newMeal.imageUrl)) {
      console.log("Using newMeal.imageUrl:", newMeal.imageUrl);
      return newMeal.imageUrl || "https://picsum.photos/300";
    }
    const images = recipeImages[recipeId];
    console.log("Using recipeImages:", images);
    return images && images.length > 0
      ? images[0].imageUrl ?? "https://picsum.photos/300"
      : "https://picsum.photos/300"; // Sử dụng ảnh có kích thước cố định
  };

  return (
    <Layout title="Quản lý thực đơn" subtitle="Xem và quản lý các bữa ăn">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Thêm hoặc Cập nhật Bữa ăn
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Ngày (YYYY-MM-DD)"
              value={newMeal.mealDate || ""}
              onChange={(e) => setNewMeal({ ...newMeal, mealDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Giờ (HH:MM)"
              value={newMeal.mealTime || ""}
              onChange={(e) => setNewMeal({ ...newMeal, mealTime: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Health Profile ID"
              type="number"
              value={newMeal.healthProfileId || ""}
              onChange={(e) => setNewMeal({ ...newMeal, healthProfileId: Number(e.target.value) })}
              disabled={isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Recipe ID"
              type="number"
              value={newMeal.recipeId || ""}
              onChange={(e) => setNewMeal({ ...newMeal, recipeId: Number(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL Hình ảnh (tùy chọn)"
              value={newMeal.imageUrl || ""}
              onChange={(e) => setNewMeal({ ...newMeal, imageUrl: e.target.value })}
              placeholder="Ví dụ: https://example.com/image.jpg"
            />
          </Grid>
          {newMeal.imageUrl && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Xem trước hình ảnh:
              </Typography>
              <CardMedia
                component="img"
                height="100"
                image={newMeal.imageUrl || "https://picsum.photos/300"}
                alt="Preview"
                sx={{ objectFit: "contain" }}
              />
            </Grid>
          )}
        </Grid>
        <Button
          onClick={addMeal}
          variant="contained"
          color="primary"
          sx={{ mb: 4, width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
        >
          {isEditing ? "Cập nhật bữa ăn" : "Thêm bữa ăn"}
        </Button>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {meals.length === 0 ? (
              <Typography>Không có bữa ăn nào để hiển thị.</Typography>
            ) : (
              meals.map((meal) => (
                <Grid item xs={12} sm={6} md={4} key={meal.mealId}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                      minHeight: "450px", // Chiều cao tối thiểu cho card
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="300" // Chiều cao cố định cho hình ảnh
                      width="100%" // Chiều rộng tự động theo card
                      image={getImageUrl(meal.recipeId)}
                      alt={`Meal ${meal.mealId}`}
                      sx={{
                        objectFit: "cover", // Đảm bảo hình ảnh vừa khung
                        display: "block", // Xóa khoảng trống dư thừa
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1, // Đảm bảo nội dung lấp đầy không gian còn lại
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "16px",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#424242" }}>
                          Meal ID: {meal.mealId}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                          Ngày: {meal.mealDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                          Giờ: {meal.mealTime}
                        </Typography>
                        <Chip label={`Recipe ID: ${meal.recipeId}`} color="primary" size="small" />
                      </Box>
                      <Grid container spacing={1} sx={{ mt: 2 }}>
                        <Grid item>
                          <Button onClick={() => editMeal(meal)} color="primary" variant="outlined">
                            Chỉnh sửa
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            onClick={() => deleteMealHandler(meal.mealId)}
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

export default MealsPage;