import type React from "react";
import { useState } from "react"; // Chỉ dùng useState, không cần useEffect vì không gọi API
import { Container, Grid, Typography, Card, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../../components/Admin/Layout";
import ServicePackagesChart from "../../components/Admin/ServicePackagesChart";
import RecentUsersTable from "../../components/Admin/RecentUsersTable";
import StatsCards from "../../components/Admin/StatsCards";
import { monthlyData } from "../../data/dashboardData"; // Giữ nguyên dữ liệu tĩnh

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // Thêm trạng thái loading
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái error
  const token = localStorage.getItem('token');
  console.log('admin token', token);
  // Giữ nguyên dữ liệu tĩnh monthlyData, không fetch API
  const usersData = []; // Giữ trống hoặc mock dữ liệu tĩnh nếu cần (tùy bạn)
  const servicePackagesData = []; // Giữ trống hoặc mock dữ liệu tĩnh nếu cần (tùy bạn)

  // Xóa logic fetch API, giữ nguyên hiển thị
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Layout title="Bảng điều khiển" subtitle="Chào mừng trở lại, Admin User! 👋">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <StatsCards /> {/* Giữ nguyên, giả định có dữ liệu tĩnh bên trong */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
                Thống kê doanh thu
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
                Phân bố gói dịch vụ
              </Typography>
              <ServicePackagesChart /> {/* Giữ nguyên, giả định có dữ liệu tĩnh */}
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
                Người dùng mới đăng nhập
              </Typography>
              <RecentUsersTable /> {/* Giữ nguyên, giả định có dữ liệu tĩnh */}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AdminPage;