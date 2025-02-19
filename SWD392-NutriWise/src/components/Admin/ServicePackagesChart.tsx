import type React from "react"
import { Box, Typography } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { servicePackages } from "../../data/dashboardData"

const ServicePackagesChart: React.FC = () => {
  return (
    <Box sx={{ height: 445, marginTop: -18}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={servicePackages}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {servicePackages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ mt: -15, maxHeight: 300, overflowY: 'auto' }}>
        {servicePackages.map((entry, index) => (
          <Box
            key={`legend-${index}`}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: entry.color,
                mr: 1,
              }}
            />
            <Typography variant="body2">
              {entry.name} ({entry.value} người dùng)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ServicePackagesChart

