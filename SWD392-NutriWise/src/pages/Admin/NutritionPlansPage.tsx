import type React from "react"
import { Container, Typography, Card, Grid, Box } from "@mui/material"
import Layout from "../../components/Admin/Layout"

const mockPlans = [
  { id: 1, name: "Kế hoạch giảm cân", description: "Kế hoạch dinh dưỡng cho người muốn giảm cân", users: 1234 },
  { id: 2, name: "Kế hoạch tăng cơ", description: "Kế hoạch dinh dưỡng cho người muốn tăng cơ bắp", users: 987 },
  { id: 3, name: "Kế hoạch cân bằng", description: "Kế hoạch dinh dưỡng cân bằng cho sức khỏe tổng thể", users: 2345 },
]

const NutritionPlansPage: React.FC = () => {
  return (
    <Layout title="Kế hoạch dinh dưỡng" subtitle="Quản lý các kế hoạch dinh dưỡng">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {mockPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card sx={{ p: 5, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                  {plan.description}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                    Số người dùng:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                    {plan.users}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  )
}

export default NutritionPlansPage

