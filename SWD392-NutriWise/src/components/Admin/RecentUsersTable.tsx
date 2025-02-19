import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  Typography,
} from "@mui/material"
import { recentUsers } from "../../data/dashboardData"

const RecentUsersTable: React.FC = () => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Người dùng</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Đăng nhập lần cuối</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentUsers.map((user, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={user.avatar} sx={{ mr: 2 }} />
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  color={user.role === "Premium" ? "primary" : user.role === "Doanh nghiệp" ? "secondary" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{user.lastLogin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecentUsersTable

