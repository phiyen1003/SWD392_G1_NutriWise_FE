import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { getAllMenuHistories } from "../../api/menuHistoryApi";
import { MenuHistoryDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const MenuHistoriesPage: React.FC = () => {
  const [histories, setHistories] = useState<MenuHistoryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0); // Tổng số lịch sử menu

  useEffect(() => {
    fetchHistories();
  }, [pageNumber, pageSize]);

  const fetchHistories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuHistories({
        pageNumber,
        pageSize,
        orderBy: "createdDate", // Sắp xếp theo ngày tạo, có thể thay đổi
        // createdDateMin: "2025-01-01T00:00:00Z", // Uncomment nếu muốn lọc theo ngày tối thiểu
        // createdDateMax: "2025-12-31T23:59:59Z", // Uncomment nếu muốn lọc theo ngày tối đa
        // notes: "Healthy menu", // Uncomment nếu muốn lọc theo ghi chú
        // combineWith: 1, // Uncomment nếu cần
      });
      setHistories(data);
      // Giả định API không trả về totalItems, cần cập nhật nếu API hỗ trợ
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0); // Tạm tính
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải danh sách lịch sử thực đơn");
      console.error("Error fetching menu histories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 10;
    setPageSize(size);
    setPageNumber(1); // Reset về trang 1 khi thay đổi kích thước trang
  };

  return (
    <Layout title="Quản lý lịch sử thực đơn" subtitle="Xem và quản lý các lịch sử thực đơn">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý lịch sử thực đơn
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Theo dõi lịch sử thực đơn của người dùng.
        </Typography>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số lịch sử mỗi trang"
              type="number"
              value={pageSize}
              onChange={handlePageSizeChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)} // Tính số trang dựa trên tổng số item
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        </Grid>

        {/* Bảng danh sách lịch sử */}
        <Paper sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 3 }}>
              {error}
            </Typography>
          ) : histories.length === 0 ? (
            <Typography sx={{ p: 3 }}>Không có lịch sử thực đơn nào để hiển thị.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Health Profile ID</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {histories.map((history) => (
                  <TableRow key={history.menuHistoryId}>
                    <TableCell>{history.menuHistoryId}</TableCell>
                    <TableCell>{history.healthProfileId}</TableCell>
                    <TableCell>{new Date(history.createdDate).toLocaleString()}</TableCell>
                    <TableCell>{history.notes || "Không có ghi chú"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default MenuHistoriesPage;