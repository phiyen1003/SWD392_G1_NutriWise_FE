import type React from "react"
import { Container, Typography, Card, Grid, TextField, Button, Switch, FormControlLabel, Box } from "@mui/material"
import Layout from "../../components/Admin/Layout"

const SettingsPage: React.FC = () => {
  return (
    <Layout title="Cài đặt hệ thống" subtitle="Quản lý cài đặt cho ứng dụng">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "#424242" }}>
                Cài đặt chung
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Tên ứng dụng" variant="outlined" defaultValue="NutriWise" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email liên hệ" variant="outlined" defaultValue="contact@nutriwise.com" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Cho phép đăng ký mới" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Gửi email thông báo" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "#424242" }}>
                Cài đặt bảo mật
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Độ dài mật khẩu tối thiểu"
                    variant="outlined"
                    type="number"
                    defaultValue={8}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Yêu cầu xác thực hai yếu tố" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Switch />} label="Cho phép đăng nhập từ mạng xã hội" />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" size="large">
            Lưu cài đặt
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}

export default SettingsPage

