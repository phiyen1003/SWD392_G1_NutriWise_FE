<<<<<<< Updated upstream
import React, { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { HealthGoalDTO } from "../../types/types";
=======
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
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Search as SearchIcon } from "@mui/icons-material";
import { getAllHealthGoals, createHealthGoal, updateHealthGoal, deleteHealthGoal, searchHealthGoal } from "../../api/healthGoalApi";
import { HealthGoalDTO, UpdateHealthGoalDTO } from "../../types/types";
>>>>>>> Stashed changes
import Layout from "../../components/Admin/Layout";
import apiClient from "../../api/apiClient";
import { Toast } from "../../components/ToastComponent";
import { VStack, Spinner, Text } from "@chakra-ui/react";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import HealthGoalModal from "../../components/Admin/HealthGoalModal";

const HealthGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<HealthGoalDTO[]>([]);
<<<<<<< Updated upstream
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<HealthGoalDTO | null>(null);
  const [modalAction, setModalAction] = useState<"create" | "update">("create");
  const [orderBy, setOrderBy] = useState<keyof HealthGoalDTO>("healthGoalId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }
  const fetchGoals = useCallback(async () => {
    try {
      const response = await apiClient.get(`/HealthGoal/all-health-goal?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setGoals(response.data);
      setLoading(() => false);
    } catch (error) {
      onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setDataFetched(true);
      setLoading(false);
    }
  }, [order, orderBy, currentPage]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleCloseToast = () => {
    setOpenToast(false);
  }

  const onDeleteGoal = async (goalId: number) => {
    setLoadingId(goalId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/HealthGoal/health-goal-deletion/${goalId}`);
        if (response.status === 200) {
          onToast(200, true, 'Đã xóa thành phần dị ứng');

          if (goals.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchGoals();
          }
        }
      } catch (e) {
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa thành phần dị ứng');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

  const initialState: HealthGoalDTO = {
    healthGoalId: 0,
    name: '',
    description: ''
  }

  const handleOpen = (allergen: HealthGoalDTO, action: "create" | "update") => {
    setSelectedGoal(allergen);
    setModalAction(action);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedGoal(null);
  };

  const handleSort = (property: keyof HealthGoalDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  const handleSearch = async (value: string) => {
    try {
      if (value !== '') {
        const response = await apiClient.get(`/HealthGoal/health-goal-search?name=${value}`);
        setGoals(response.data);
      } else {
        fetchGoals()
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title="Quản lý mục tiêu sức khỏe" subtitle="Xem và quản lý các mục tiêu sức khỏe">
      <Toast
        onClose={handleCloseToast}
        information={information}
        open={openToast}
        statusCode={statusCode}
      ></Toast>

      {loading ? (
        <VStack colorPalette="cyan">
          <Spinner color="colorPalette.600" borderWidth="5px" size="lg" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Button variant="contained" color="success">
            <CSVLink
              data={goals}
              filename="goals_nutriwise">
              Export to CSV
            </CSVLink>
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleOpen(initialState, "create")}>
              Thêm mục tiêu
            </Button>
            <Search
              query={query}
              handleSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value)
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </Box>
          {goals.length > 0 ? (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Mô tả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.healthGoalId}>
                      <TableCell>{goal.healthGoalId}</TableCell>
                      <TableCell>{goal.name}</TableCell>
                      <TableCell>{goal.description}</TableCell>
                      <TableCell> <Box display={"flex"} gap={3}>
                        <Button color="info"
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpen(goal, "update")}
                        >
                          Sửa
                        </Button>

                        <Button color="error"
                          variant="contained"
                          size="small"
                          startIcon={<Delete />}
                          loading={loadingId === goal.healthGoalId}
                          onClick={() => onDeleteGoal(goal.healthGoalId!)}
                        >
                          Xóa
                        </Button>
                      </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  <HealthGoalModal
                    open={open}
                    handleClose={handleClose}
                    goal={selectedGoal!}
                    setGoals={setGoals}
                    action={modalAction}
                    title={modalAction === 'create' ? "Thêm mục tiêu" : "Cập nhật mục tiêu"} />
                </TableBody>
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Paper>
          ) : dataFetched ? (
            <Box mt={2} display="flex" justifyContent="center">
              <FuzzyText baseIntensity={0.2} color="#1a237e">
                Not found
              </FuzzyText>
            </Box>
          ) : (<Text>Hiện tại chưa có thành phần dị ứng nào</Text>)}
        </Box>
      )}
=======
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // State cho tạo mới (Create)
  const [newName, setNewName] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  // State cho chỉnh sửa (Update)
  const [editingHealthGoalId, setEditingHealthGoalId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UpdateHealthGoalDTO>>({});

  useEffect(() => {
    if (isSearching) {
      fetchSearchResults();
    } else {
      fetchGoals();
    }
  }, [pageNumber, pageSize, isSearching]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllHealthGoals({
        PageNumber: pageNumber,
        PageSize: pageSize,
        OrderBy: "name",
      });
      setGoals(data);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0);
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tải danh sách mục tiêu sức khỏe");
      console.error("Error fetching health goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchHealthGoal(searchQuery);
      setGoals(data);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0);
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tìm kiếm mục tiêu sức khỏe");
      console.error("Error searching health goals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      setPageNumber(1);
      fetchGoals();
    } else {
      setIsSearching(true);
      setPageNumber(1);
      fetchSearchResults();
    }
  };

  // Xử lý tạo mới (Create)
  const handleCreate = async () => {
    if (!newName || !newDescription) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await createHealthGoal({
        healthGoalId: 0, // ID sẽ được tạo tự động
        name: newName,
        description: newDescription,
      });
      setNewName("");
      setNewDescription("");
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi tạo mục tiêu sức khỏe");
      console.error("Error creating health goal:", error);
    }
  };

  // Xử lý chỉnh sửa (Update)
  const handleEdit = (goal: HealthGoalDTO) => {
    setEditingHealthGoalId(goal.healthGoalId);
    setEditForm({
      name: goal.name,
      description: goal.description,
    });
  };

  const handleSaveEdit = async (healthGoalId: number) => {
    if (!editForm.name || !editForm.description) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await updateHealthGoal(healthGoalId, {
        name: editForm.name,
        description: editForm.description,
      });
      setEditingHealthGoalId(null);
      setEditForm({});
      fetchGoals();
    } catch (error: any) {
      setError(error.message || "Đã xảy ra lỗi khi cập nhật mục tiêu sức khỏe");
      console.error("Error updating health goal:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingHealthGoalId(null);
    setEditForm({});
  };

  // Xử lý xóa (Delete)
  const handleDelete = async (healthGoalId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa mục tiêu sức khỏe này?")) {
      try {
        await deleteHealthGoal(healthGoalId);
        fetchGoals();
      } catch (error: any) {
        setError(error.message || "Đã xảy ra lỗi khi xóa mục tiêu sức khỏe");
        console.error("Error deleting health goal:", error);
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

  return (
    <Layout title="Quản lý mục tiêu sức khỏe" subtitle="Xem và quản lý các mục tiêu sức khỏe">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý mục tiêu sức khỏe
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý các mục tiêu sức khỏe trong hệ thống.
        </Typography>

        {/* Form tạo mới (Create) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tạo mục tiêu sức khỏe mới
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tên mục tiêu"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Mô tả"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={!newName || !newDescription}
                fullWidth
              >
                Tạo mới
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Tìm kiếm */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tìm kiếm mục tiêu sức khỏe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
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

        {/* Hiển thị danh sách mục tiêu sức khỏe */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 3 }}>
            {error}
          </Typography>
        ) : goals.length === 0 ? (
          <Typography sx={{ p: 3 }}>Không có mục tiêu sức khỏe nào để hiển thị.</Typography>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.healthGoalId}>
                    <TableCell>{goal.healthGoalId}</TableCell>
                    <TableCell>
                      {editingHealthGoalId === goal.healthGoalId ? (
                        <TextField
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        goal.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingHealthGoalId === goal.healthGoalId ? (
                        <TextField
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          fullWidth
                        />
                      ) : (
                        goal.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingHealthGoalId === goal.healthGoalId ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleSaveEdit(goal.healthGoalId)}
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
                            onClick={() => handleDelete(goal.healthGoalId)}
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
>>>>>>> Stashed changes
    </Layout>
  );
};

export default HealthGoalsPage;