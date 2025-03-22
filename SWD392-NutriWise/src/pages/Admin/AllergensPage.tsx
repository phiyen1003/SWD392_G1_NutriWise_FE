import React, { useCallback, useEffect, useRef, useState } from "react";

import { Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TableSortLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Spinner, VStack, Text } from "@chakra-ui/react";

import apiClient from "../../api/apiClient";

import { AllergenDTO } from "../../types/types";

import Layout from "../../components/Admin/Layout";
import AllergenModal from "../../components/Admin/AllergenModal";

import { Toast } from "../../components/ToastComponent";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";

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

  const fetchAllergens = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/Allergen/all-allergens?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      console.log(paginationHeader);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setAllergens(response.data);
    } catch (error) {
      onToast(500, true, 'Có lỗi xảy ra trong quá trình xử lý');
    } finally {
      setLoading(false);
    }
  }, [orderBy, order, currentPage]);

  useEffect(() => {
    fetchAllergens();
  }, [fetchAllergens]);

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

          if (allergens.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchAllergens();
          }
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

  const handleSearch = async (value: string) => {
    try {
      if (value !== '') {
        const response = await apiClient.get(`/Allergen/allergen-search?name=${value}`);
        setAllergens(response.data);
      } else {
        fetchAllergens()
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title="Quản lý chất gây dị ứng" subtitle="Xem và quản lý các chất gây dị ứng">
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
        </VStack>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="large"
              variant="contained"
              onClick={() => handleOpen(initialState, "create")}>
              Thêm thành phần dị ứng
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
          {allergens.length > 0 ? (
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
                            onClick={() => onDeleteAllergen(allergen.allergenId!)}
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
  );
};

export default AllergensPage;