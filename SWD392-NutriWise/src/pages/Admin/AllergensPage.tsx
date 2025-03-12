import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { getAllAllergens } from "../../api/allergenApi";
import { AllergenDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const AllergensPage: React.FC = () => {
  const [allergens, setAllergens] = useState<AllergenDTO[]>([]);

  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const data = await getAllAllergens();
        setAllergens(data);
      } catch (error) {
        console.error("Error fetching allergens:", error);
      }
    };
    fetchAllergens();
  }, []);

  return (
    <Layout title="Quản lý chất gây dị ứng" subtitle="Xem và quản lý các chất gây dị ứng">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý chất gây dị ứng
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Xem, thêm, sửa, xóa các chất gây dị ứng trong hệ thống.
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allergens.map((allergen) => (
              <TableRow key={allergen.allergenId}>
                <TableCell>{allergen.allergenId}</TableCell>
                <TableCell>{allergen.name}</TableCell>
                <TableCell>{allergen.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
    </Layout>
  );
};

export default AllergensPage;