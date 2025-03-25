import React, { useCallback, useEffect, useState } from "react";

import { CSVLink } from "react-csv";

import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, TableSortLabel } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Spinner, VStack, Text } from "@chakra-ui/react";

import { FavoriteRecipeDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";
import apiClient from "../../api/apiClient";
import { CustomPagination } from "../../components/PagingComponent";
import { Search } from "../../components/SearchComponent";
import FuzzyText from "../../lib/FuzzyText/FuzzyText";
import { Toast } from "../../components/ToastComponent";

const FavoriteRecipesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipeDTO[]>([]);
  const [orderBy, setOrderBy] = useState<keyof FavoriteRecipeDTO>("addedDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [information, setInformation] = useState<string>('');
  const [selectedFavoRecipe, setSelectedFavoRecipe] = useState<FavoriteRecipeDTO | null>(null);
  const [modalAction, setModalAction] = useState<"create" | "update">("create");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await apiClient.get(`/FavoriteRecipe/all-favorites?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setFavorites([...response.data]);
      setLoading(() => false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      // setDataFetched(fa);
      setLoading(false);
    }
  }, [orderBy, order, currentPage]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const onToast = (status: number, openToast: boolean, info: string) => {
    setStatusCode(status);
    setOpenToast(openToast);
    setInformation(info);
  }

  const handleCloseToast = () => {
    setOpenToast(false);
  }

  const onDeleteFavo = async (favoId: number) => {
    setLoadingId(favoId);
    setTimeout(async () => {
      try {
        const response = await apiClient.delete(`/FavoriteRecipe/favorite-deletion/${favoId}`);
        if (response.status === 200) {
          onToast(200, true, 'Đã xóa công thức yêu thích');

          if (favorites.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          } else {
            fetchFavorites();
          }
        }
      } catch (e) {
        onToast(statusCode, true, 'Có lỗi xảy ra trong quá trình xóa công thức yêu thích');
      } finally {
        setLoadingId(null)
      }
    }, 300)
  }

  const initialState: FavoriteRecipeDTO = {
    favoriteRecipeId: 0,
    addedDate: '',
    recipeId: 0,
    userId: 0,
    recipeName: '',
    userName: ''
  }

  // const handleOpen = (allergen: FavoriteRecipeDTO, action: "create" | "update") => {
  //   setSelectedFavoRecipe(allergen);
  //   setModalAction(action);
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  //   setSelectedFavoRecipe(null);
  // };

  const handleSort = (property: keyof FavoriteRecipeDTO) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  }

 

  return (
    <Layout title="Quản lý công thức yêu thích" subtitle="Xem và quản lý các công thức yêu thích">
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
          <Button variant="contained" color="success">
            <CSVLink
              data={favorites}
              filename="allergens_nutriwise">
              Export to CSV
            </CSVLink>
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
           
          </Box>
          {favorites.length >= 1 ? (
            <Paper sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "favoriteRecipeId"}
                        direction={order}
                        onClick={() => handleSort("favoriteRecipeId")}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "recipeName"}
                        direction={order}
                        onClick={() => handleSort("recipeName")}
                      >
                        Tên công thức
                      </TableSortLabel>
                    </TableCell>
                    <TableSortLabel
                      active={orderBy === "userId"}
                      direction={order}
                      onClick={() => handleSort("userId")}
                    >
                      <TableCell>User ID</TableCell>
                    </TableSortLabel>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "addedDate"}
                        direction={order}
                        onClick={() => handleSort("addedDate")}
                      >
                        Ngày thêm
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favorites.map((fav) => (
                    <TableRow key={fav.favoriteRecipeId}>
                      <TableCell>{fav.favoriteRecipeId}</TableCell>
                      <TableCell>{fav.recipeName}</TableCell>
                      <TableCell>{fav.userId}</TableCell>
                      <TableCell>{fav.addedDate}</TableCell>
                      <TableCell>
                        <Button color="error"
                          variant="contained"
                          size="small"
                          startIcon={<Delete />}
                          loading={loadingId === fav.favoriteRecipeId}
                          onClick={() => onDeleteFavo(fav.favoriteRecipeId!)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </Paper>
          ) : dataFetched ? (
            <Box mt={2} display="flex" justifyContent="center">
              <FuzzyText baseIntensity={0.2} color="#1a237e">
                Not found
              </FuzzyText>
            </Box>
          ) : (<Text>Hiện tại chưa có công thức yêu thích nào</Text>)}
        </Box>
      )}
    </Layout>
  );
};

export default FavoriteRecipesPage;