import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllMenuHistories } from "../../api/menuHistoryApi";
import { MenuHistoryDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const MenuHistoriesPage: React.FC = () => {
  const [histories, setHistories] = useState<MenuHistoryDTO[]>([]);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const data = await getAllMenuHistories();
        setHistories(data);
      } catch (error) {
        console.error("Error fetching menu histories:", error);
      }
    };
    fetchHistories();
  }, []);

  return (
    <Layout title="Quản lý lịch sử thực đơn" subtitle="Xem và quản lý các lịch sử thực đơn">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý lịch sử thực đơn
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Theo dõi lịch sử thực đơn của người dùng.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Health Profile ID</TableCell>
              <TableCell>Ngày tạo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {histories.map((history) => (
              <TableRow key={history.menuHistoryId}>
                <TableCell>{history.menuHistoryId}</TableCell>
                <TableCell>{history.healthProfileId}</TableCell>
                <TableCell>{history.createdDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default MenuHistoriesPage;