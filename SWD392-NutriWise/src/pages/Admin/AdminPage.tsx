import type React from "react"
import { Container, Grid, Typography, Card, Box } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Layout from "../../components/Admin/Layout"
import ServicePackagesChart from "../../components/Admin/ServicePackagesChart"
import RecentUsersTable from "../../components/Admin/RecentUsersTable"
import StatsCards from "../../components/Admin/StatsCards"
import { monthlyData } from "../../data/dashboardData"

const AdminPage: React.FC = () => {
  return (
    <Layout title="Bảng điều khiển" subtitle="Chào mừng trở lại, Admin User! 👋">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <StatsCards />
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
              <ServicePackagesChart />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
                Người dùng mới đăng nhập
              </Typography>
              <RecentUsersTable />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default AdminPage

