import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllHealthProfiles } from "../../api/healthProfileApi";
import { HealthProfileDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";
import { useEffect, useState } from "react";

const HealthProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<HealthProfileDTO[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getAllHealthProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching health profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  return (
    <Layout title="Quản lý hồ sơ sức khỏe" subtitle="Xem và quản lý các hồ sơ sức khỏe">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý hồ sơ sức khỏe
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý hồ sơ sức khỏe của người dùng.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Chiều cao</TableCell>
              <TableCell>Cân nặng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.healthProfileId}>
                <TableCell>{profile.healthProfileId}</TableCell>
                <TableCell>{profile.fullName}</TableCell>
                <TableCell>{profile.gender}</TableCell>
                <TableCell>{profile.height}</TableCell>
                <TableCell>{profile.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default HealthProfilesPage;