import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Pagination,
} from "@mui/material";
import Layout from "../../components/Admin/Layout";
import {
  getAllIngredientInRecipes,
  createIngredientInRecipe,
  updateIngredientInRecipe,
  deleteIngredientInRecipe,
} from "../../api/ingredientInRecipeApi";
import { IngredientInRecipeDTO, CreateIngredientInRecipeDTO, UpdateIngredientInRecipeDTO } from "../../types/types";
import apiClient from "../../api/apiClient";
import { CustomPagination } from "../../components/PagingComponent";

const IngredientInRecipesPage: React.FC = () => {
  const [items, setItems] = useState<IngredientInRecipeDTO[]>([]);
  const [newItem, setNewItem] = useState<CreateIngredientInRecipeDTO>({
    recipeId: 0,
    ingredientId: 0,
    quantity: 0,
    unit: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<keyof IngredientInRecipeDTO>("ingredientId");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const setPaging = (currentPage: number, totalCount: number, pageSize: number) => {
    setTotalCount(totalCount);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0); // Tổng số liên kết (giả định API trả về)

  // Load danh sách liên kết khi component mount hoặc khi pageNumber/pageSize thay đổi
  useEffect(() => {
    fetchItems();
<<<<<<< Updated upstream
  }, [currentPage]);

  const fetchItems = async () => {
    try {
      const response = await apiClient.get(`/IngredientInRecipe/all-ingredient-in-recipe?OrderBy=${orderBy} ${order}&PageNumber=${currentPage}`);
      const paginationHeader = JSON.parse(response.headers["x-pagination"]);
      setPaging(paginationHeader.CurrentPage, paginationHeader.TotalCount, paginationHeader.PageSize);
      setItems(response.data);
=======
  }, [pageNumber, pageSize]);

  const fetchItems = async () => {
    try {
      const data = await getAllIngredientInRecipes({
        pageNumber,
        pageSize,
        orderBy: "ingredientId", // Sắp xếp theo tên nguyên liệu, có thể thay đổi
        // quantityMin: 0, // Uncomment nếu muốn lọc theo số lượng tối thiểu
        // quantityMax: 100, // Uncomment nếu muốn lọc theo số lượng tối đa
        // unit: "gram", // Uncomment nếu muốn lọc theo đơn vị
        // combineWith: 1, // Uncomment nếu cần
      });
      setItems(data);

      // Giả định API không trả về totalItems, cần cập nhật logic nếu API trả về metadata
      // Ví dụ: Nếu API trả về { items: IngredientInRecipeDTO[], totalItems: number }
      // thì cần setTotalItems(response.totalItems);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0); // Tạm tính, cần API hỗ trợ
>>>>>>> Stashed changes
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải danh sách nguyên liệu trong công thức");
      console.error(err);
    }
  };

  const addOrUpdateItem = async () => {
    if (newItem.recipeId === 0 || newItem.ingredientId === 0 || newItem.quantity === 0) {
      alert("Vui lòng điền đầy đủ thông tin: Recipe ID, Ingredient ID, và Số lượng");
      return;
    }

    try {
      if (isEditing && currentItemId !== null) {
        const updateData: UpdateIngredientInRecipeDTO = {
          ingredientId: newItem.ingredientId,
          quantity: newItem.quantity,
          unit: newItem.unit,
        };
        const updatedItem = await updateIngredientInRecipe(currentItemId, updateData);
        setItems(
          items.map((item) =>
            item.ingredientInRecipeId === updatedItem.ingredientInRecipeId ? updatedItem : item
          )
        );
        setIsEditing(false);
        setCurrentItemId(null);
      } else {
        const createdItem = await createIngredientInRecipe({
          recipeId: newItem.recipeId,
          ingredientId: newItem.ingredientId,
          quantity: newItem.quantity,
          unit: newItem.unit,
          ingredientInRecipeId: 0,
        });
        const fullCreatedItem: IngredientInRecipeDTO = {
          ...createdItem,
          ingredientInRecipeId: createdItem.ingredientInRecipeId || 0,
          ingredientName: createdItem.ingredientName || "Không xác định",
        };
        setItems([...items, fullCreatedItem]);
      }
      setNewItem({ recipeId: 0, ingredientId: 0, quantity: 0, unit: null });
      fetchItems(); // Làm mới danh sách sau khi thêm/cập nhật
    } catch (err) {
      alert(isEditing ? "Không thể cập nhật liên kết" : "Không thể thêm liên kết");
      console.error(err);
    }
  };

  const deleteItemHandler = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa liên kết này?")) {
      try {
        await deleteIngredientInRecipe(id);
        setItems(items.filter((item) => item.ingredientInRecipeId !== id));
        fetchItems(); // Làm mới danh sách sau khi xóa
      } catch (err) {
        alert("Không thể xóa liên kết");
        console.error(err);
      }
    }
  };

  const editItem = (item: IngredientInRecipeDTO) => {
    setNewItem({
      recipeId: item.recipeId,
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit ?? null,
    });
    setIsEditing(true);
    setCurrentItemId(item.ingredientInRecipeId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "recipeId" || name === "ingredientId" || name === "quantity" ? Number(value) : value || null,
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 10;
    setPageSize(size);
    setPageNumber(1); // Reset về trang 1 khi thay đổi kích thước trang
  };

  return (
    <Layout title="Quản lý nguyên liệu trong công thức" subtitle="Xem và quản lý các nguyên liệu trong công thức">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý nguyên liệu trong công thức
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý liên kết giữa nguyên liệu và công thức.
        </Typography>

        {/* Form thêm hoặc cập nhật liên kết */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
          {isEditing ? "Cập nhật liên kết" : "Thêm liên kết mới"}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Recipe ID"
              name="recipeId"
              type="number"
              value={newItem.recipeId || ""}
              onChange={handleInputChange}
              disabled={isEditing} // Không cho phép chỉnh sửa Recipe ID khi cập nhật
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Ingredient ID"
              name="ingredientId"
              type="number"
              value={newItem.ingredientId || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              required
              label="Số lượng"
              name="quantity"
              type="number"
              value={newItem.quantity || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Đơn vị"
              name="unit"
              value={newItem.unit || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={addOrUpdateItem}
              variant="contained"
              color="primary"
              sx={{ width: "100%", "&:hover": { backgroundColor: "#1976d2" } }}
            >
              {isEditing ? "Cập nhật liên kết" : "Thêm liên kết"}
            </Button>
          </Grid>
        </Grid>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số liên kết mỗi trang"
              type="number"
              value={pageSize}
              onChange={handlePageSizeChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)} // Tính số trang dựa trên tổng số item
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        </Grid>

        {/* Bảng danh sách liên kết */}
        <Paper sx={{ mt: 2 }}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Recipe ID</TableCell>
                    <TableCell>Tên nguyên liệu</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>Không có liên kết nào để hiển thị.</TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.ingredientInRecipeId}>
                        <TableCell>{item.ingredientInRecipeId}</TableCell>
                        <TableCell>{item.recipeId}</TableCell>
                        <TableCell>{item.ingredientName || "Không xác định"}</TableCell>
                        <TableCell>{item.quantity} {item.unit || ""}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => editItem(item)}
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            onClick={() => deleteItemHandler(item.ingredientInRecipeId)}
                            color="secondary"
                            variant="outlined"
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <CustomPagination
                count={totalCount}
                pageSize={pageSize}
                defaultPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default IngredientInRecipesPage;