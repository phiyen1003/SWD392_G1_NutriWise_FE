import React, { useState } from "react"
import { Container, Typography, Card, Grid, CardMedia, CardContent, Chip, Button, TextField } from "@mui/material"
import Layout from "../../components/Admin/Layout"
import { mockMeals } from "../../data/dashboardData"

interface Meal {
  id: number;
  name: string;
  calories: number;
  category: string;
  image: string;
}

const MealsPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [newMeal, setNewMeal] = useState<Meal>({ id: 0, name: "", calories: 0, category: "", image: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentMealId, setCurrentMealId] = useState<number | null>(null);

  const addMeal = () => {
    if (isEditing && currentMealId !== null) {
      updateMeal({ ...newMeal, id: currentMealId });
      setIsEditing(false);
      setCurrentMealId(null);
    } else {
      setMeals([...meals, { ...newMeal, id: Date.now() }]);
    }
    setNewMeal({ id: 0, name: "", calories: 0, category: "", image: "" });
  };

  const updateMeal = (updatedMeal: Meal) => {
    setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
  };

  const deleteMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const editMeal = (meal: Meal) => {
    setNewMeal(meal);
    setIsEditing(true);
    setCurrentMealId(meal.id);
  };

  return (
    <Layout title="Quản lý thực đơn" subtitle="Xem và quản lý các bữa ăn">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Thêm hoặc Cập nhật Món ăn</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Tên món ăn" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Calories" type="number" value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Thể loại" value={newMeal.category} onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Hình ảnh" value={newMeal.image} onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })} />
          </Grid>
        </Grid>
        <Button onClick={addMeal} variant="contained" color="primary" sx={{ mb: 4, width: '100%', '&:hover': { backgroundColor: '#1976d2' } }}>
          {isEditing ? "Cập nhật món ăn" : "Thêm món ăn"}
        </Button>

        <Grid container spacing={3}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
                <CardMedia component="img" height="200" image={meal.image} alt={meal.name} />
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#424242" }}>
                    {meal.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                    Calories: {meal.calories}
                  </Typography>
                  <Chip label={meal.category} color="primary" size="small" />
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid item>
                      <Button onClick={() => editMeal(meal)} color="primary" variant="outlined">Chỉnh sửa</Button>
                    </Grid>
                    <Grid item>
                      <Button onClick={() => deleteMeal(meal.id)} color="secondary" variant="outlined">Xóa</Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default MealsPage

