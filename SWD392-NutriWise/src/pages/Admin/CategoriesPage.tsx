import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Button } from "@mui/material";
import { CategoryDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";
import apiClient from "../../api/apiClient";
import { Delete } from "@mui/icons-material";
import CategoryModal from "../../components/Admin/CategoryModal";
import Toast from "../../components/ToastComponent";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [orderBy, setOrderBy] = useState<keyof CategoryDTO>("categoryId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null);
  const [modalAction, setModalAction] = useState<"create" | "update">("create");
  const [open, setOpen] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>('');

  const initialState: CategoryDTO = {
    categoryId: 0,
    description: '',
    name: ''
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(`/Category/all-categories?orderBy=${orderBy} ${order}`);
      console.log(response);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {

    fetchCategories();
  }, [order, orderBy]);

  const handleSort = (property: keyof CategoryDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

  const handleOpen = (allergen: CategoryDTO, action: "create" | "update") => {
    setSelectedCategory(allergen);
    setModalAction(action);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleCloseToast = () => {
    setOpenToast(false);
  }

  const onDeleteCategory = (categoryId: number) => {
    setLoadingId(categoryId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/Category/category-deletion/${categoryId}`);
        if (response.status === 200) {
          fetchCategories();
          onToast(200, true, 'Đã xóa danh mục');
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa danh mục');
      } finally {
        setLoadingId(null);
      }
    }, 300);
  };  

  return (
    <>
    <Layout title="Quản lý hạng mục" subtitle="Xem và quản lý các hạng mục">
      <Toast 
      onClose={handleCloseToast}
      information={information}
      open={openToast}
      statusCode={statusCode}
      ></Toast>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý danh mục
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý các danh mục công thức và thực đơn.
        </Typography>
        <Button
          size="large"
          variant="contained"
          onClick={() => handleOpen(initialState, "create")}>
          Thêm danh mục
        </Button>
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "categoryId"}
                    direction={order}
                    onClick={() => handleSort("categoryId")}>
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
              {categories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryId}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Box display={"flex"} gap={3}>
                      <Button color="info"
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpen(category, "update")}
                      >
                        Sửa
                      </Button>

                      <Button color="error"
                        variant="contained"
                        size="small"
                        startIcon={<Delete />}
                        loading={loadingId === category.categoryId}
                        onClick={() => onDeleteCategory(category.categoryId)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              <CategoryModal
                open={open}
                handleClose={handleClose}
                category={selectedCategory!}
                setCategories={setCategories}
                action={modalAction}
                title={modalAction === 'create' ? "Thêm danh mục" : "Cập nhật danh mục"}
                initialState={initialState} />
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Layout>
    </>
  );
};

export default CategoriesPage;