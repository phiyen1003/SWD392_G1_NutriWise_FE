import type React from "react"
import { Box, Container, Grid, Typography, IconButton, Link } from "@mui/material"
import { Facebook, Twitter, LinkedIn, Instagram, Copyright } from "@mui/icons-material"

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "white",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
                NutriWise
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giải pháp dinh dưỡng thông minh cho cuộc sống khỏe mạnh của bạn.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                size="small"
                sx={{
                  color: "#1877f2",
                  "&:hover": { backgroundColor: "rgba(24, 119, 242, 0.04)" },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#1da1f2",
                  "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.04)" },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#0a66c2",
                  "&:hover": { backgroundColor: "rgba(10, 102, 194, 0.04)" },
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#e4405f",
                  "&:hover": { backgroundColor: "rgba(228, 64, 95, 0.04)" },
                }}
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Liên kết nhanh
            </Typography>
            <Grid container spacing={1}>
              {["Trang chủ", "Về chúng tôi", "Dịch vụ", "Blog", "Liên hệ"].map((text) => (
                <Grid item xs={6} key={text}>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      py: 0.5,
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {text}
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Thông tin liên hệ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: contact@nutriwise.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Điện thoại: (84) 123 456 789
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Copyright sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              2024 NutriWise. Đã đăng ký bản quyền.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
              Điều khoản sử dụng
            </Link>
            <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
              Chính sách bảo mật
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

