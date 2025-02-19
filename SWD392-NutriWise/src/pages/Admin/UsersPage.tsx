import type React from "react"
import {
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from "@mui/material"
import Layout from "../../components/Admin/Layout"

const mockUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "User", status: "Active" },
  { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "Premium", status: "Active" },
  { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "Admin", status: "Inactive" },
]

const UsersPage: React.FC = () => {
  return (
    <Layout title="Quản lý người dùng" subtitle="Xem và quản lý tất cả người dùng">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#424242" }}>
            Danh sách người dùng
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === "Admin" ? "secondary" : user.role === "Premium" ? "primary" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.status} color={user.status === "Active" ? "success" : "error"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Layout>
  )
}

export default UsersPage

