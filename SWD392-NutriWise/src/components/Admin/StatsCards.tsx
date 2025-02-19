import type React from "react"
import { Grid, Paper, Typography, Box } from "@mui/material"
import { statsCards } from "../../data/dashboardData"

const StatsCards: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {statsCards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  mb: 2,
                }}
              >
                <IconComponent sx={{ fontSize: 40, color: `${card.color}.main` }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#424242",
                }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: `${card.color}.main`,
                }}
              >
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default StatsCards

