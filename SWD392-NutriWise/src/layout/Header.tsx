import type React from "react"
import { Box, Typography } from "@mui/material"
import { Dashboard } from "@mui/icons-material"

interface HeaderProps {
  title: string
  subtitle: string
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
        boxShadow: "0 4px 20px rgba(26, 35, 126, 0.2)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Dashboard sx={{ color: "white" }} />
          <Typography sx={{ color: "white" }}>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Header

