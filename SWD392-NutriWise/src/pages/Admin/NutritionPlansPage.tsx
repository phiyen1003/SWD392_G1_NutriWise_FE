// src/pages/admin/NutritionPlansPage.tsx
import React from "react";
import {
  Container,
  Typography,
  Card,
  Grid,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Layout from "../../components/Admin/Layout";
import {
  getAllHealthGoals,
  createHealthGoal,
  updateHealthGoal,
  deleteHealthGoal,
  searchHealthGoal,
} from "../../api/healthGoalApi";
import { getAllMeals } from "../../api/mealApi";
import { getAllRecipeHealthGoals } from "../../api/recipeHealthGoalApi";
import { getRecipeById } from "../../api/recipeApi";
import { HealthGoalDTO, MealDTO, RecipeHealthGoalDTO, RecipeDTO } from "../../types/types"; // Import từ types.ts

interface HealthPlan extends HealthGoalDTO {
  users: number;
}

const NutritionPlansPage: React.FC = () => {
  const [plans, setPlans] = React.useState<HealthPlan[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [newPlan, setNewPlan] = React.useState<Partial<HealthGoalDTO>>({ name: "", description: "" });
  const [editPlan, setEditPlan] = React.useState<HealthPlan | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [recipesPerPlan, setRecipesPerPlan] = React.useState<{ [key: number]: RecipeDTO[] }>({});
  const itemsPerPage = 6;

  const fetchHealthPlans = async (query?: string) => {
    try {
      setLoading(true);
      const healthGoals = query ? await searchHealthGoal(query) : await getAllHealthGoals();
      const meals = await getAllMeals();
      const allRecipeHealthGoals = await getAllRecipeHealthGoals();

      const healthGoalUserMap: { [key: number]: Set<number> } = {};
      healthGoals.forEach((goal) => {
        healthGoalUserMap[goal.healthGoalId] = new Set();
      });

      meals.forEach((meal: MealDTO) => {
        const relatedRhgs = allRecipeHealthGoals.filter((rhg) => rhg.recipeId === meal.recipeId);
        relatedRhgs.forEach((rhg) => {
          if (healthGoalUserMap[rhg.healthGoalId]) {
            healthGoalUserMap[rhg.healthGoalId].add(meal.healthProfileId);
          }
        });
      });

      const plansWithUsers: HealthPlan[] = healthGoals.map((goal) => ({
        ...goal,
        users: healthGoalUserMap[goal.healthGoalId]?.size || 0,
      }));

      setPlans(plansWithUsers);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách kế hoạch dinh dưỡng");
    } finally {
      setLoading(false);
    }
  };
  // const fetchHealthPlans = async (query: string = "") => {
  //   try {
  //     setLoading(true);
  //     const healthGoals = query.trim() ? await searchHealthGoal(query.trim()) : await getAllHealthGoals();
  //     const meals = await getAllMeals();
  //     const allRecipeHealthGoals = await getAllRecipeHealthGoals();
  
  //     const healthGoalUserMap: { [key: number]: Set<number> } = {};
  //     healthGoals.forEach((goal) => {
  //       healthGoalUserMap[goal.healthGoalId] = new Set();
  //     });
  
  //     meals.forEach((meal: MealDTO) => {
  //       const relatedRhgs = allRecipeHealthGoals.filter((rhg) => rhg.recipeId === meal.recipeId);
  //       relatedRhgs.forEach((rhg) => {
  //         if (healthGoalUserMap[rhg.healthGoalId]) {
  //           healthGoalUserMap[rhg.healthGoalId].add(meal.healthProfileId);
  //         }
  //       });
  //     });
  
  //     const plansWithUsers: HealthPlan[] = healthGoals.map((goal) => ({
  //       ...goal,
  //       users: healthGoalUserMap[goal.healthGoalId]?.size || 0,
  //     }));
  
  //     setPlans(plansWithUsers);
  //   } catch (err) {
  //     setError("Đã xảy ra lỗi khi tải danh sách kế hoạch dinh dưỡng");
  //     console.error(err); // Thêm log để debug
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchRecipesForPlan = async (healthGoalId: number) => {
    if (recipesPerPlan[healthGoalId]) return; // Tránh gọi API nếu đã có dữ liệu
    try {
      const recipeHealthGoals = await getAllRecipeHealthGoals();
      const relatedRhgs = recipeHealthGoals.filter((rhg) => rhg.healthGoalId === healthGoalId);
      const recipeIds = relatedRhgs.map((rhg) => rhg.recipeId);
      const recipes = await Promise.all(recipeIds.map((id) => getRecipeById(id)));
      setRecipesPerPlan((prev) => ({ ...prev, [healthGoalId]: recipes }));
    } catch (err) {
      console.error(`Lỗi khi lấy công thức cho Health Goal ${healthGoalId}:`, err);
    }
  };

  React.useEffect(() => {
    fetchHealthPlans();
  }, []);

  const handleCreatePlan = async () => {
    if (!newPlan.name) {
      alert("Tên kế hoạch không được để trống");
      return;
    }
    try {
      const createdPlan = await createHealthGoal(newPlan as HealthGoalDTO);
      setPlans([...plans, { ...createdPlan, users: 0 }]);
      setOpenDialog(false);
      setNewPlan({ name: "", description: "" });
    } catch (err) {
      alert("Không thể tạo kế hoạch mới");
    }
  };

  const handleUpdatePlan = async () => {
    if (editPlan && editPlan.healthGoalId) {
      try {
        const updatedPlan = await updateHealthGoal(editPlan.healthGoalId, {
          name: editPlan.name,
          description: editPlan.description,
        });
        setPlans(plans.map((plan) => (plan.healthGoalId === updatedPlan.healthGoalId ? { ...updatedPlan, users: plan.users } : plan)));
        setEditPlan(null);
        setOpenDialog(false);
      } catch (err) {
        alert("Không thể cập nhật kế hoạch");
      }
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa kế hoạch này?")) {
      try {
        await deleteHealthGoal(id);
        setPlans(plans.filter((plan) => plan.healthGoalId !== id));
      } catch (err) {
        alert("Không thể xóa kế hoạch");
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    fetchHealthPlans(query);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlans = plans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  return (
    <Layout title="Kế hoạch dinh dưỡng" subtitle="Quản lý các kế hoạch dinh dưỡng">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm kế hoạch"
            value={searchQuery}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            sx={{ width: "300px" }}
          />
          <Button variant="contained" onClick={() => { setOpenDialog(true); setEditPlan(null); }}>
            Tạo kế hoạch mới
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentPlans.length === 0 ? (
                <Typography>Không có kế hoạch nào để hiển thị.</Typography>
              ) : (
                currentPlans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.healthGoalId}>
                    <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#424242" }}>
                          {plan.name}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => { setEditPlan(plan); setOpenDialog(true); }} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePlan(plan.healthGoalId)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        {plan.description || "Không có mô tả"}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                          Số người dùng:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {plan.users}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => fetchRecipesForPlan(plan.healthGoalId)}
                        sx={{ mt: 2, width: "100%" }}
                      >
                        Xem công thức liên quan
                      </Button>
                      {recipesPerPlan[plan.healthGoalId]?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Công thức:</Typography>
                          <ul>
                            {recipesPerPlan[plan.healthGoalId].map((recipe) => (
                              <li key={recipe.recipeId}>{recipe.name}</li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
            {/* Phân trang */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "contained" : "outlined"}
                    sx={{ mx: 1 }}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Dialog để tạo/chỉnh sửa kế hoạch */}
        <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditPlan(null); }}>
          <DialogTitle>{editPlan ? "Chỉnh sửa kế hoạch" : "Tạo kế hoạch mới"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên kế hoạch"
              fullWidth
              value={editPlan ? editPlan.name : newPlan.name}
              onChange={(e) => {
                if (editPlan) setEditPlan({ ...editPlan, name: e.target.value });
                else setNewPlan({ ...newPlan, name: e.target.value });
              }}
              sx={{ mt: 2 }}
              required
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={editPlan ? editPlan.description || "" : newPlan.description || ""}
              onChange={(e) => {
                if (editPlan) setEditPlan({ ...editPlan, description: e.target.value });
                else setNewPlan({ ...newPlan, description: e.target.value });
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); setEditPlan(null); }}>Hủy</Button>
            <Button
              onClick={editPlan ? handleUpdatePlan : handleCreatePlan}
              variant="contained"
              disabled={!editPlan && !newPlan.name} // Vô hiệu hóa nếu không có tên khi tạo mới
            >
              {editPlan ? "Cập nhật" : "Tạo"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default NutritionPlansPage;