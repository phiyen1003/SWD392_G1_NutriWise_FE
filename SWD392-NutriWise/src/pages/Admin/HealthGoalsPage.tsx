import React, { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { HealthGoalDTO } from "../../types/types";
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
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<HealthGoalDTO | null>(null);
  const [modalAction, setModalAction] = useState<"create" | "update">("create");
  const [orderBy, setOrderBy] = useState<keyof HealthGoalDTO>("healthGoalId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/HealthGoal/all-health-goal?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`
      );
      const paginationHeader = response.headers["x-pagination"]
        ? JSON.parse(response.headers["x-pagination"])
        : { CurrentPage: 1, TotalCount: 0, PageSize: 0 }; // Xử lý an toàn nếu header không tồn tại
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setGoals(response.data || []); // Đảm bảo goals là mảng rỗng nếu response.data không hợp lệ
    } catch (error) {
      console.error("Error fetching goals:", error);
      onToast(500, true, "Có lỗi xảy ra trong quá trình lấy danh sách mục tiêu sức khỏe");
      setGoals([]); // Đặt goals về mảng rỗng nếu có lỗi
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
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  const onDeleteGoal = async (goalId: number) => {
    setLoadingId(goalId);
    try {
      const response = await apiClient.delete(`/HealthGoal/health-goal-deletion/${goalId}`);
      if (response.status === 200) {
        onToast(200, true, "Đã xóa mục tiêu sức khỏe thành công");
        if (goals.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchGoals();
        }
      }
    } catch (e) {
      onToast(500, true, "Có lỗi xảy ra trong quá trình xóa mục tiêu sức khỏe");
    } finally {
      setLoadingId(null);
    }
  };

  const initialState: HealthGoalDTO = {
    healthGoalId: 0,
    name: "",
    description: "",
  };

  const handleOpen = (goal: HealthGoalDTO, action: "create" | "update") => {
    setSelectedGoal(goal);
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
  };

  const handleSearch = async (value: string) => {
    try {
      if (value !== "") {
        const response = await apiClient.get(`/HealthGoal/health-goal-search?name=${value}`);
        setGoals(response.data || []); // Đảm bảo goals là mảng rỗng nếu response.data không hợp lệ
      } else {
        fetchGoals();
      }
    } catch (e) {
      console.error("Error searching goals:", e);
      onToast(500, true, "Có lỗi xảy ra trong quá trình tìm kiếm mục tiêu sức khỏe");
      setGoals([]); // Đặt goals về mảng rỗng nếu có lỗi
    }
  };

  return (
    <Layout title="Quản lý mục tiêu sức khỏe" subtitle="Xem và quản lý các mục tiêu sức khỏe">
      <Toast
        onClose={handleCloseToast}
        information={information}
        open={openToast}
        statusCode={statusCode}
      />

      {loading ? (
        <VStack colorPalette="cyan">
          <Spinner color="colorPalette.600" borderWidth="5px" size="lg" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Button variant="contained" color="success">
            <CSVLink data={goals} filename="goals_nutriwise">
              Export to CSV
            </CSVLink>
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleOpen(initialState, "create")}
            >
              Thêm mục tiêu
            </Button>
            <Search
              query={query}
              handleSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </Box>
          {goals.length > 0 ? (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort("healthGoalId")} style={{ cursor: "pointer" }}>
                      ID {orderBy === "healthGoalId" && (order === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      Tên {orderBy === "name" && (order === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("description")} style={{ cursor: "pointer" }}>
                      Mô tả {orderBy === "description" && (order === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow key={goal.healthGoalId}>
                      <TableCell>{goal.healthGoalId}</TableCell>
                      <TableCell>{goal.name}</TableCell>
                      <TableCell>{goal.description}</TableCell>
                      <TableCell>
                        <Box display={"flex"} gap={3}>
                          <Button
                            color="info"
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpen(goal, "update")}
                          >
                            Sửa
                          </Button>
                          <Button
                            color="error"
                            variant="contained"
                            size="small"
                            startIcon={<Delete />}
                            disabled={loadingId === goal.healthGoalId}
                            onClick={() => onDeleteGoal(goal.healthGoalId!)}
                          >
                            {loadingId === goal.healthGoalId ? "Đang xóa..." : "Xóa"}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
                Không tìm thấy mục tiêu sức khỏe
              </FuzzyText>
            </Box>
          ) : (
            <Text>Hiện tại chưa có mục tiêu sức khỏe nào</Text>
          )}
          {/* Di chuyển HealthGoalModal ra ngoài vòng lặp */}
          {selectedGoal && (
            <HealthGoalModal
              open={open}
              handleClose={handleClose}
              goal={selectedGoal}
              setGoals={setGoals}
              action={modalAction}
              title={modalAction === "create" ? "Thêm mục tiêu" : "Cập nhật mục tiêu"}
            />
          )}
        </Box>
      )}
    </Layout>
  );
};

export default HealthGoalsPage;