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
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { getAllProfileGoals, createProfileGoal, updateProfileGoal, deleteProfileGoal } from "../../api/profileGoalApi";
import { ProfileGoalDTO, UpdateProfileGoalDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const ProfileGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<ProfileGoalDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State cho tạo mới (Create)
  const [newHealthProfileId, setNewHealthProfileId] = useState<string>("");
  const [newHealthGoalId, setNewHealthGoalId] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");

  // State cho chỉnh sửa (Update)
  const [editingProfileGoalId, setEditingProfileGoalId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UpdateProfileGoalDTO>>({});

  useEffect(() => {
    fetchGoals();
  }, [pageNumber, pageSize]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProfileGoals({
        PageNumber: pageNumber,
        PageSize: pageSize,
        OrderBy: "startDate",
      });
      setGoals(data);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0);
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tải danh sách mục tiêu hồ sơ");
      console.error("Error fetching profile goals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tạo mới (Create)
  const handleCreate = async () => {
    if (!newHealthProfileId || !newHealthGoalId || !newStartDate || !newEndDate) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await createProfileGoal({
        profileGoalId: 0, // ID sẽ được tạo tự động
        healthProfileId: Number(newHealthProfileId),
        healthGoalId: Number(newHealthGoalId),
        startDate: newStartDate,
        endDate: newEndDate,
        healthGoalName: "", // Không cần gửi, backend sẽ tự điền
        healthProfileName: "", // Không cần gửi, backend sẽ tự điền
      });
      setNewHealthProfileId("");
      setNewHealthGoalId("");
      setNewStartDate("");
      setNewEndDate("");
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tạo mục tiêu hồ sơ");
      console.error("Error creating profile goal:", error);
    }
  };

  // Xử lý chỉnh sửa (Update)
  const handleEdit = (goal: ProfileGoalDTO) => {
    setEditingProfileGoalId(goal.profileGoalId);
    setEditForm({
      healthProfileId: goal.healthProfileId,
      healthGoalId: goal.healthGoalId,
      startDate: goal.startDate || "",
      endDate: goal.endDate || "",
    });
  };

  const handleSaveEdit = async (profileGoalId: number) => {
    if (!editForm.healthProfileId || !editForm.healthGoalId || !editForm.startDate || !editForm.endDate) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await updateProfileGoal(profileGoalId, {
        healthProfileId: editForm.healthProfileId,
        healthGoalId: editForm.healthGoalId,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });
      setEditingProfileGoalId(null);
      setEditForm({});
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi cập nhật mục tiêu hồ sơ");
      console.error("Error updating profile goal:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProfileGoalId(null);
    setEditForm({});
  };

  // Xử lý xóa (Delete)
  const handleDelete = async (profileGoalId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa mục tiêu hồ sơ này?")) {
      try {
        await deleteProfileGoal(profileGoalId);
        fetchGoals();
      } catch (error: any) {
        setError(error.message || "Đã xảy ra lỗi khi xóa mục tiêu hồ sơ");
        console.error("Error deleting profile goal:", error);
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 6;
    setPageSize(size);
    setPageNumber(1);
  };

  // Hàm hỗ trợ để định dạng ngày
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <Layout title="Quản lý mục tiêu hồ sơ" subtitle="Xem và quản lý các mục tiêu hồ sơ">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý mục tiêu hồ sơ
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý mục tiêu sức khỏe liên kết với hồ sơ.
        </Typography>

        {/* Form tạo mới (Create) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tạo mục tiêu hồ sơ mới
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Health Profile ID"
                type="number"
                value={newHealthProfileId}
                onChange={(e) => setNewHealthProfileId(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Health Goal ID"
                type="number"
                value={newHealthGoalId}
                onChange={(e) => setNewHealthGoalId(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Ngày bắt đầu"
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Ngày kết thúc"
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={!newHealthProfileId || !newHealthGoalId || !newStartDate || !newEndDate}
                fullWidth
              >
                Tạo mới
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Điều khiển phân trang */}
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

        {/* Hiển thị danh sách mục tiêu hồ sơ */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 3 }}>
            {error}
          </Typography>
        ) : goals.length === 0 ? (
          <Typography sx={{ p: 3 }}>Không có mục tiêu hồ sơ nào để hiển thị.</Typography>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Health Profile</TableCell>
                  <TableCell>Health Goal</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Ngày kết thúc</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.profileGoalId}>
                    <TableCell>{goal.profileGoalId}</TableCell>
                    <TableCell>
                      {editingProfileGoalId === goal.profileGoalId ? (
                        <TextField
                          type="number"
                          value={editForm.healthProfileId || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, healthProfileId: Number(e.target.value) })
                          }
                          fullWidth
                        />
                      ) : (
                        `${goal.healthProfileId} (${goal.healthProfileName || "N/A"})`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProfileGoalId === goal.profileGoalId ? (
                        <TextField
                          type="number"
                          value={editForm.healthGoalId || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, healthGoalId: Number(e.target.value) })
                          }
                          fullWidth
                        />
                      ) : (
                        `${goal.healthGoalId} (${goal.healthGoalName || "N/A"})`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProfileGoalId === goal.profileGoalId ? (
                        <TextField
                          type="date"
                          value={editForm.startDate || ""}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      ) : (
                        formatDate(goal.startDate)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProfileGoalId === goal.profileGoalId ? (
                        <TextField
                          type="date"
                          value={editForm.endDate || ""}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      ) : (
                        formatDate(goal.endDate)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProfileGoalId === goal.profileGoalId ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleSaveEdit(goal.profileGoalId)}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={handleCancelEdit}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(goal)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(goal.profileGoalId)}
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

export default ProfileGoalsPage;