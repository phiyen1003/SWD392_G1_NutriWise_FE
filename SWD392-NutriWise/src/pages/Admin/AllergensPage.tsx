import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TableSortLabel } from "@mui/material";
import { AllergenDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";
import { Delete } from "@mui/icons-material";
import apiClient from "../../api/apiClient";
import AllergenModal from "../../components/Admin/AllergenModal";
import Toast from "../../components/ToastComponent";

const AllergensPage: React.FC = () => {
  const [allergens, setAllergens] = useState<AllergenDTO[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAllergen, setSelectedAllergen] = useState<AllergenDTO | null>(null);
  const [modalAction, setModalAction] = useState<"create" | "update">("create");
  const [orderBy, setOrderBy] = useState<keyof AllergenDTO>("allergenId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>('');

  const fetchAllergens = async () => {
    try {
      const response = await apiClient.get(`/Allergen/all-allergens?OrderBy=${orderBy} ${order}`);
      console.log(response)
      setAllergens(response.data);
    } catch (error) {
      console.error("Error fetching allergens:", error);
    }
  };

  useEffect(() => {
    fetchAllergens();
  }, [orderBy, order]);

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleCloseToast = () => {
    setOpenToast(false);
  }

  const onDeleteAllergen = async (allergenId: number) => {
    setLoadingId(allergenId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/Allergen/allergen-deletion/${allergenId}`);
        if (response.status === 200) {
          onToast(200, true, 'Đã xóa thành phần dị ứng');
          fetchAllergens();
        }
      } catch (e) {
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa thành phần dị ứng');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

const initialState: AllergenDTO = {
  allergenId: 0,
  name: '',
  description: ''
}

const handleOpen = (allergen: AllergenDTO, action: "create" | "update") => {
  setSelectedAllergen(allergen);
  setModalAction(action);
  setOpen(true);
};
const handleClose = () => {
  setOpen(false);
  setSelectedAllergen(null);
};

const handleSort = (property: keyof AllergenDTO) => {
  const isAsc = orderBy === property && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(property);
}

return (
  <Layout title="Quản lý chất gây dị ứng" subtitle="Xem và quản lý các chất gây dị ứng">
     <Toast 
      onClose={handleCloseToast}
      information={information}
      open={openToast}
      statusCode={statusCode}
      ></Toast>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý chất gây dị ứng
      </Typography>
      {/* <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Xem, thêm, sửa, xóa các chất gây dị ứng trong hệ thống.
        </Typography> */}
      <Button
        size="large"
        variant="contained"
        onClick={() => handleOpen(initialState, "create")}>
        Thêm thành phần dị ứng
      </Button>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "allergenId"}
                  direction={order}
                  onClick={() => handleSort("allergenId")}>
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={order}
                  onClick={() => handleSort("name")}>
                  Tên
                </TableSortLabel>
              </TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {allergens.map((allergen) => (
              <TableRow key={allergen.allergenId}>
                <TableCell>{allergen.allergenId}</TableCell>
                <TableCell>{allergen.name}</TableCell>
                <TableCell>{allergen.description}</TableCell>
                <TableCell>
                  <Box display={"flex"} gap={3}>
                    <Button color="info"
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpen(allergen, "update")}
                    >
                      Sửa
                    </Button>

                    <Button color="error"
                      variant="contained"
                      size="small"
                      startIcon={<Delete />}
                      loading={loadingId === allergen.allergenId}
                      onClick={() => onDeleteAllergen(allergen.allergenId)}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <AllergenModal
              open={open}
              handleClose={handleClose}
              allergen={selectedAllergen!}
              setAllergens={setAllergens}
              action={modalAction}
              title={modalAction === 'create' ? "Thêm thành phần dị ứng" : "Cập nhật thành phần dị ứng"} />
          </TableBody>
        </Table>
      </Paper>
    </Box>
  </Layout>
);
};

export default AllergensPage;