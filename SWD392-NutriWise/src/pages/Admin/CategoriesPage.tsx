import React, { useCallback, useEffect, useState } from "react";

import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { VStack, Spinner, Text } from "@chakra-ui/react";

import { CategoryDTO } from "../../types/types";
import apiClient from "../../api/apiClient";

import Layout from "../../components/Admin/Layout";
import CategoryModal from "../../components/Admin/CategoryModal";

import { Toast } from "../../components/ToastComponent";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  const initialState: CategoryDTO = {
    categoryId: 0,
    description: '',
    name: ''
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/Category/all-categories?orderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      console.log(paginationHeader);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setCategories(response.data);
    } catch (error) {
      onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setLoading(false);
    }
  }, [order, orderBy, currentPage]);

  useEffect(() => {

    fetchCategories();
  }, [fetchCategories]);

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
          onToast(200, true, 'Đã xóa danh mục');

          if (categories.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchCategories();
          }
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa danh mục');
      } finally {
        setLoadingId(null);
      }
    }, 300);
  };

  const handleSearch = async (value: string) => {
    try {
      if (value !== '') {
        const response = await apiClient.get(`/Category/category-search?name=${value}`);
        setCategories(response.data);
      } else {
        fetchCategories()
      }
    } catch (e) {
      console.error(e);
    }
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
        {loading ? (
          <VStack colorPalette="cyan">
            <Spinner color="colorPalette.600" borderWidth="5px" size="lg" />
            <Text color="colorPalette.600">Loading...</Text>
          </VStack>)
          : (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => handleOpen(initialState, "create")}>
                  Thêm danh mục
                </Button>
                <Search
                  query={query}
                  handleSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.value)
                    setQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                />
              </Box>
              {categories.length > 0 ? (
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
                  <CustomPagination
                    count={totalCount}
                    pageSize={pageSize}
                    defaultPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </Paper>
              ) : (
                <Box mt={2} display={"flex"} justifyContent={"center"}>
                  <FuzzyText
                    baseIntensity={0.2}
                    color="#1a237e"
                  >Not found</FuzzyText>
                </Box>
              )}
            </Box>
          )}
      </Layout>
    </>
  );
};

export default CategoriesPage;