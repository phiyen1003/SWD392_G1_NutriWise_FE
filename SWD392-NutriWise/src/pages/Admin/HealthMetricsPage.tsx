import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllHealthMetrics } from "../../api/healthMetricApi";
import { HealthMetricDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const HealthMetricsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetricDTO[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getAllHealthMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching health metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <Layout title="Quản lý chỉ số sức khỏe" subtitle="Xem và quản lý các chỉ số sức khỏe">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý chỉ số sức khỏe
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Theo dõi và quản lý các chỉ số sức khỏe.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Health Profile ID</TableCell>
              <TableCell>Ngày đo</TableCell>
              <TableCell>BMI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.healthMetricId}>
                <TableCell>{metric.healthMetricId}</TableCell>
                <TableCell>{metric.healthProfileId}</TableCell>
                <TableCell>{metric.measurementDate}</TableCell>
                <TableCell>{metric.bmi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default HealthMetricsPage;