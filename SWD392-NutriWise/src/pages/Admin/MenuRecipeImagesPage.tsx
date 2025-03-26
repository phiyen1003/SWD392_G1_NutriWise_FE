import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Pagination,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import {
  getAllMenuRecipeImages,
  uploadMenuRecipeImage,
  updateMenuRecipeImage,
  deleteMenuRecipeImage,
} from "../../api/MenuRecipeImage"; // Sửa đường dẫn import
import { MenuRecipeImageDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const MenuRecipeImagesPage: React.FC = () => {
  const [images, setImages] = useState<MenuRecipeImageDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State cho upload hình ảnh (Create)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [menuRecipeIdForUpload, setMenuRecipeIdForUpload] = useState<string>("");

  // State cho chỉnh sửa (Update)
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuRecipeImageDTO>>({});
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, [pageNumber, pageSize]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuRecipeImages({
        pageNumber,
        pageSize,
        orderBy: "uploadedDate",
      });
      setImages(data);
      setTotalItems(data.length > 0 ? pageNumber * pageSize + 1 : 0);
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải danh sách hình ảnh thực đơn");
      console.error("Error fetching menu recipe images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý upload hình ảnh (Create)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !menuRecipeIdForUpload) {
      alert("Vui lòng chọn file và nhập Menu Recipe ID");
      return;
    }

    const formData = new FormData();
    formData.append("menuRecipeId", menuRecipeIdForUpload);
    formData.append("imageFile", selectedFile);

    try {
      await uploadMenuRecipeImage(formData);
      setSelectedFile(null);
      setMenuRecipeIdForUpload("");
      fetchImages();
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải lên hình ảnh");
      console.error("Error uploading image:", error);
    }
  };

  // Xử lý chỉnh sửa (Update)
  const handleEdit = (image: MenuRecipeImageDTO) => {
    setEditingImageId(image.menuRecipeImageId);
    setEditForm({
      menuRecipeId: image.menuRecipeId,
      imageUrl: image.imageUrl,
      uploadedDate: image.uploadedDate,
    });
    setEditFile(null);
  };

  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
      setEditForm({ ...editForm, imageUrl: "" });
    }
  };

  const handleSaveEdit = async (imageId: number) => {
    if (!editForm.menuRecipeId) {
      alert("Vui lòng điền Menu Recipe ID");
      return;
    }

    const formData = new FormData();
    formData.append("menuRecipeId", editForm.menuRecipeId.toString());
    formData.append("uploadedDate", editForm.uploadedDate || new Date().toISOString());

    if (editFile) {
      formData.append("imageFile", editFile);
    } else {
      if (!editForm.imageUrl) {
        alert("Vui lòng nhập Image URL hoặc chọn file");
        return;
      }
      formData.append("imageUrl", editForm.imageUrl);
    }

    try {
      await updateMenuRecipeImage(imageId, formData);
      setEditingImageId(null);
      setEditForm({});
      setEditFile(null);
      fetchImages();
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || "Đã xảy ra lỗi khi cập nhật hình ảnh";
      setError(errorMessage);
      console.error("Error updating image:", error.response?.data || error);
    }
  };

  const handleCancelEdit = () => {
    setEditingImageId(null);
    setEditForm({});
    setEditFile(null);
  };

  // Xử lý xóa (Delete)
  const handleDelete = async (imageId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa hình ảnh này?")) {
      try {
        await deleteMenuRecipeImage(imageId);
        fetchImages();
      } catch (error) {
        setError("Đã xảy ra lỗi khi xóa hình ảnh");
        console.error("Error deleting image:", error);
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 6;
    setPageSize(size);
    setPageNumber(1);
  };

  return (
    <Layout title="Quản lý hình ảnh thực đơn" subtitle="Xem và quản lý các hình ảnh của công thức trong thực đơn">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý hình ảnh thực đơn
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Quản lý hình ảnh của các công thức trong thực đơn.
        </Typography>

        {/* Form upload hình ảnh (Create) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tải lên hình ảnh mới
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Menu Recipe ID"
                type="number"
                value={menuRecipeIdForUpload}
                onChange={(e) => setMenuRecipeIdForUpload(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                label="Chọn hình ảnh"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!selectedFile || !menuRecipeIdForUpload}
                fullWidth
              >
                Tải lên
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Số hình ảnh mỗi trang"
              type="number"
              value={pageSize}
              onChange={handlePageSizeChange}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              count={Math.ceil(totalItems / pageSize)}
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        </Grid>

        {/* Hiển thị danh sách hình ảnh */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 3 }}>
            {error}
          </Typography>
        ) : images.length === 0 ? (
          <Typography sx={{ p: 3 }}>Không có hình ảnh nào để hiển thị.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.menuRecipeImageId}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.imageUrl || "https://via.placeholder.com/200"}
                    alt={`Image ${image.menuRecipeImageId}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    {editingImageId === image.menuRecipeImageId ? (
                      <>
                        <TextField
                          label="Menu Recipe ID"
                          type="number"
                          value={editForm.menuRecipeId || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, menuRecipeId: Number(e.target.value) })
                          }
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Image URL"
                          value={editForm.imageUrl || ""}
                          onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          type="file"
                          onChange={handleEditFileChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          label="Chọn hình ảnh mới (nếu có)"
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSaveEdit(image.menuRecipeImageId)}
                          >
                            Lưu
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={handleCancelEdit}
                          >
                            Hủy
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          ID: {image.menuRecipeImageId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Menu Recipe ID: {image.menuRecipeId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ngày tải lên: {new Date(image.uploadedDate).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(image)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(image.menuRecipeImageId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default MenuRecipeImagesPage;