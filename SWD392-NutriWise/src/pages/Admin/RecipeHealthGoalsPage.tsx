import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Pagination,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  getAllRecipeHealthGoals,
  createRecipeHealthGoal,
  updateRecipeHealthGoal,
  deleteRecipeHealthGoal,
} from "../../api/recipeHealthGoalApi";
import { PaginatedResponse, RecipeHealthGoalDTO, UpdateRecipeHealthGoalDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const RecipeHealthGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<RecipeHealthGoalDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [newRecipeId, setNewRecipeId] = useState<string>("");
  const [newHealthGoalId, setNewHealthGoalId] = useState<string>("");
  const [editingRecipeHealthGoalId, setEditingRecipeHealthGoalId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UpdateRecipeHealthGoalDTO>>({});

  useEffect(() => {
    fetchGoals();
  }, [pageNumber, pageSize]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching goals with params:", { PageNumber: pageNumber, PageSize: pageSize });
      const response: PaginatedResponse<RecipeHealthGoalDTO> = await getAllRecipeHealthGoals({
        PageNumber: pageNumber,
        PageSize: pageSize,
        OrderBy: "recipeId",
      });
      console.log("API response:", response);
      setGoals(response.data);
      setTotalItems(response.total);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch recipe health goals";
      console.error("Error fetching recipe health goals:", error.response || error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const recipeId = Number(newRecipeId);
    const healthGoalId = Number(newHealthGoalId);

    if (!recipeId || !healthGoalId || recipeId <= 0 || healthGoalId <= 0) {
      setError("Vui lòng nhập Recipe ID và Health Goal ID là số dương hợp lệ");
      return;
    }

    try {
      await createRecipeHealthGoal({
        recipeHealthGoalId: 0,
        recipeId,
        healthGoalId,
        recipeName: "",
        healthGoalName: "",
      });
      setNewRecipeId("");
      setNewHealthGoalId("");
      setError(null);
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tạo mục tiêu sức khỏe công thức");
      console.error("Error creating recipe health goal:", error);
    }
  };

  const handleEdit = (goal: RecipeHealthGoalDTO) => {
    setEditingRecipeHealthGoalId(goal.recipeHealthGoalId);
    setEditForm({
      recipeId: goal.recipeId,
      healthGoalId: goal.healthGoalId,
    });
  };

  const handleSaveEdit = async (recipeHealthGoalId: number) => {
    const recipeId = editForm.recipeId;
    const healthGoalId = editForm.healthGoalId;

    if (!recipeId || !healthGoalId || recipeId <= 0 || healthGoalId <= 0) {
      setError("Vui lòng nhập Recipe ID và Health Goal ID là số dương hợp lệ");
      return;
    }

    try {
      await updateRecipeHealthGoal(recipeHealthGoalId, { recipeId, healthGoalId });
      setEditingRecipeHealthGoalId(null);
      setEditForm({});
      setError(null);
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi cập nhật mục tiêu sức khỏe công thức");
      console.error("Error updating recipe health goal:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRecipeHealthGoalId(null);
    setEditForm({});
  };

  const handleDelete = async (recipeHealthGoalId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa mục tiêu sức khỏe công thức này?")) {
      try {
        await deleteRecipeHealthGoal(recipeHealthGoalId);
        setError(null);
        fetchGoals();
      } catch (error: any) {
        setError(error.message || "Đã xảy ra lỗi khi xóa mục tiêu sức khỏe công thức");
        console.error("Error deleting recipe health goal:", error);
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 6;
    setPageSize(size < 1 ? 1 : size);
    setPageNumber(1);
  };

  return (
    <Layout title="Quản lý mục tiêu sức khỏe công thức" subtitle="Xem và quản lý các mục tiêu sức khỏe công thức">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý mục tiêu sức khỏe công thức
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý liên kết giữa công thức và mục tiêu sức khỏe.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tạo mục tiêu sức khỏe công thức mới
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Recipe ID"
                type="number"
                value={newRecipeId}
                onChange={(e) => setNewRecipeId(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Health Goal ID"
                type="number"
                value={newHealthGoalId}
                onChange={(e) => setNewHealthGoalId(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={!newRecipeId || !newHealthGoalId}
                fullWidth
              >
                Tạo mới
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số mục tiêu mỗi trang"
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
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : goals.length === 0 ? (
          <Typography sx={{ p: 3 }}>Không có mục tiêu sức khỏe công thức nào để hiển thị.</Typography>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Recipe ID</TableCell>
                  <TableCell>Recipe Name</TableCell>
                  <TableCell>Health Goal ID</TableCell>
                  <TableCell>Health Goal Name</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.recipeHealthGoalId}>
                    <TableCell>{goal.recipeHealthGoalId}</TableCell>
                    <TableCell>
                      {editingRecipeHealthGoalId === goal.recipeHealthGoalId ? (
                        <TextField
                          type="number"
                          value={editForm.recipeId || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, recipeId: Number(e.target.value) })
                          }
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      ) : (
                        goal.recipeId
                      )}
                    </TableCell>
                    <TableCell>{goal.recipeName || "N/A"}</TableCell>
                    <TableCell>
                      {editingRecipeHealthGoalId === goal.recipeHealthGoalId ? (
                        <TextField
                          type="number"
                          value={editForm.healthGoalId || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, healthGoalId: Number(e.target.value) })
                          }
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      ) : (
                        goal.healthGoalId
                      )}
                    </TableCell>
                    <TableCell>{goal.healthGoalName || "N/A"}</TableCell>
                    <TableCell>
                      {editingRecipeHealthGoalId === goal.recipeHealthGoalId ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleSaveEdit(goal.recipeHealthGoalId)}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={handleCancelEdit}>
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton color="primary" onClick={() => handleEdit(goal)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(goal.recipeHealthGoalId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default RecipeHealthGoalsPage;