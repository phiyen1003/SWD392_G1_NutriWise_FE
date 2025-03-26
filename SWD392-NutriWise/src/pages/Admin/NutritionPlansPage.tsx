import React, { useEffect, useState, ChangeEvent } from "react";
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
  Pagination,
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
import { HealthGoalDTO, MealDTO, RecipeHealthGoalDTO, RecipeDTO } from "../../types/types";

interface HealthPlan extends HealthGoalDTO {
  users: number;
}

const NutritionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<HealthPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<Partial<HealthGoalDTO>>({ name: "", description: "" });
  const [editPlan, setEditPlan] = useState<HealthPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [recipesPerPlan, setRecipesPerPlan] = useState<{ [key: number]: RecipeDTO[] }>({});

  const fetchHealthPlans = async (query: string = "", page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        PageNumber: page,
        PageSize: pageSize,
        OrderBy: "name",
      };

      let healthGoals: HealthGoalDTO[] = [];
      let total: number = 0;

      if (query.trim()) {
        const searchResponse = await searchHealthGoal(query.trim());
        healthGoals = searchResponse.data || [];
        total = searchResponse.total || 0;
      } else {
        const getAllResponse = await getAllHealthGoals(params);
        healthGoals = getAllResponse.data || [];
        total = getAllResponse.total || 0;
      }

      const meals = await getAllMeals();
      const recipeHealthGoalsResponse = await getAllRecipeHealthGoals({
        PageNumber: 1,
        PageSize: 1000,
      });
      const allRecipeHealthGoals = recipeHealthGoalsResponse.data || [];

      const healthGoalUserMap: { [key: number]: Set<number> } = {};
      healthGoals.forEach((goal: HealthGoalDTO) => {
        healthGoalUserMap[goal.healthGoalId] = new Set();
      });

      meals.forEach((meal: MealDTO) => {
        const relatedRhgs = allRecipeHealthGoals.filter((rhg: RecipeHealthGoalDTO) => rhg.recipeId === meal.recipeId);
        relatedRhgs.forEach((rhg: RecipeHealthGoalDTO) => {
          if (healthGoalUserMap[rhg.healthGoalId]) {
            healthGoalUserMap[rhg.healthGoalId].add(meal.healthProfileId);
          }
        });
      });

      const plansWithUsers: HealthPlan[] = healthGoals.map((goal: HealthGoalDTO) => ({
        ...goal,
        users: healthGoalUserMap[goal.healthGoalId]?.size || 0,
      }));

      setPlans(plansWithUsers);
      setTotalItems(total);
    } catch (err: any) {
      setError("Đã xảy ra lỗi khi tải danh sách kế hoạch dinh dưỡng: " + (err.message || "Lỗi không xác định"));
      console.error(err);
      setPlans([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipesForPlan = async (healthGoalId: number) => {
    if (recipesPerPlan[healthGoalId]) return;
    try {
      const recipeHealthGoalsResponse = await getAllRecipeHealthGoals({
        PageNumber: 1,
        PageSize: 1000,
      });
      const recipeHealthGoals = recipeHealthGoalsResponse.data || [];
      const relatedRhgs = recipeHealthGoals.filter((rhg: RecipeHealthGoalDTO) => rhg.healthGoalId === healthGoalId);
      const recipeIds = relatedRhgs.map((rhg: RecipeHealthGoalDTO) => rhg.recipeId);
      const recipes = await Promise.all(recipeIds.map((id: number) => getRecipeById(id)));
      setRecipesPerPlan((prev) => ({ ...prev, [healthGoalId]: recipes }));
    } catch (err: any) {
      console.error(`Lỗi khi lấy công thức cho Health Goal ${healthGoalId}:`, err);
      setRecipesPerPlan((prev) => ({ ...prev, [healthGoalId]: [] }));
    }
  };

  useEffect(() => {
    fetchHealthPlans(searchQuery, pageNumber);
  }, [pageNumber]);

  const handleCreatePlan = async () => {
    if (!newPlan.name) {
      setError("Tên kế hoạch không được để trống");
      return;
    }
    try {
      const createdPlan = await createHealthGoal(newPlan as HealthGoalDTO);
      setPlans([...plans, { ...createdPlan, users: 0 }]);
      setOpenDialog(false);
      setNewPlan({ name: "", description: "" });
      fetchHealthPlans(searchQuery, pageNumber);
    } catch (err: any) {
      setError("Không thể tạo kế hoạch mới: " + (err.message || "Lỗi không xác định"));
      console.error(err);
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
        fetchHealthPlans(searchQuery, pageNumber);
      } catch (err: any) {
        setError("Không thể cập nhật kế hoạch: " + (err.message || "Lỗi không xác định"));
        console.error(err);
      }
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa kế hoạch này?")) {
      try {
        await deleteHealthGoal(id);
        setPlans(plans.filter((plan) => plan.healthGoalId !== id));
        fetchHealthPlans(searchQuery, pageNumber);
      } catch (err: any) {
        setError("Không thể xóa kế hoạch: " + (err.message || "Lỗi không xác định"));
        console.error(err);
      }
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPageNumber(1);
    fetchHealthPlans(query, 1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

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
              {plans.length === 0 ? (
                <Typography>Không có kế hoạch nào để hiển thị.</Typography>
              ) : (
                plans.map((plan) => (
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
            {totalItems > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={Math.ceil(totalItems / pageSize)}
                  page={pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

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
              disabled={!editPlan && !newPlan.name}
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