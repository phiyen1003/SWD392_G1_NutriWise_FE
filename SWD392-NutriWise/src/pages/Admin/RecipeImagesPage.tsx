import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Pagination,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { AxiosResponse } from "axios";
import { getAllRecipes } from "../../api/recipeApi";
import {
  getRecipeImagesByRecipeId,
  uploadRecipeImages,
  updateRecipeImage,
  deleteRecipeImage,
} from "../../api/recipeImageApi";
import { RecipeDTO, RecipeImageDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const RecipeImagesPage: React.FC = () => {
  const [images, setImages] = useState<RecipeImageDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State cho phân trang
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [totalItems, setTotalItems] = useState<number>(0);

  // State cho lọc theo recipeId
  const [filterRecipeId, setFilterRecipeId] = useState<number | "">("");

  // State cho form upload
  const [recipeId, setRecipeId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  // State cho chỉnh sửa
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

  // Lấy danh sách hình ảnh
  useEffect(() => {
    fetchImages();
  }, [filterRecipeId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy danh sách tất cả công thức
      const response: AxiosResponse<RecipeDTO[]> = await getAllRecipes();
      const recipesData: RecipeDTO[] = response.data;
      console.log("Fetched recipes:", recipesData);

      if (recipesData.length === 0) {
        console.log("No recipes found. Cannot fetch images.");
        setImages([]);
        setTotalItems(0);
        setLoading(false);
        return;
      }

      // Lấy hình ảnh cho từng công thức
      const imagePromises = recipesData.map(async (recipe: RecipeDTO) => {
        try {
          const images: RecipeImageDTO[] = await getRecipeImagesByRecipeId(recipe.recipeId);
          console.log(`Images for recipe ${recipe.recipeId}:`, images);
          return images.map((image: RecipeImageDTO) => ({ ...image, recipeId: recipe.recipeId }));
        } catch (err) {
          console.error(`Error fetching images for recipe ${recipe.recipeId}:`, err);
          return [];
        }
      });

      const imagesData = (await Promise.all(imagePromises)).flat();
      console.log("Fetched all images:", imagesData);

      // Lọc theo filterRecipeId nếu có
      const filteredImages = filterRecipeId
        ? imagesData.filter((image) => image.recipeId === Number(filterRecipeId))
        : imagesData;

      setImages(filteredImages);
      setTotalItems(filteredImages.length);
    } catch (err: any) {
      setError(err.message || "Failed to fetch recipes or images.");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!recipeId) {
      setError("Please enter a Recipe ID.");
      return;
    }
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const newImages = await uploadRecipeImages(Number(recipeId), [file]);
      setImages([...images, ...newImages]);
      setSuccessMessage("Image uploaded successfully!");
      setRecipeId("");
      setFile(null);
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchImages(); // Làm mới danh sách hình ảnh
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
      console.error("Error uploading image:", err);
    }
  };

  const handleUpdate = async (imageId: number) => {
    if (!editFile) {
      setError("Please select a file to update the image.");
      return;
    }

    try {
      const updatedImage = await updateRecipeImage(imageId, editFile);
      setImages(images.map((img) => (img.recipeImageId === imageId ? updatedImage : img)));
      setSuccessMessage("Image updated successfully!");
      setEditingImageId(null);
      setEditFile(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update image.");
      console.error("Error updating image:", err);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteRecipeImage(imageId);
        setImages(images.filter((img) => img.recipeImageId !== imageId));
        setSuccessMessage("Image deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to delete image.");
        console.error("Error deleting image:", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || 6;
    setPageSize(size);
    setPageNumber(1);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  // Phân trang thủ công
  const paginatedImages = images.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <Layout title="Recipe Images Management" subtitle="View and manage recipe images">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>
          Recipe Images Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Manage images of recipes.
        </Typography>

        {successMessage && (
          <Typography
            sx={{
              mb: 2,
              color: "#2ECC71",
              textAlign: "center",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {successMessage}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              mb: 2,
              color: "#D32F2F",
              textAlign: "center",
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              padding: "8px 16px",
              borderRadius: "8px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {error}
          </Typography>
        )}

        {/* Form lọc */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif", fontWeight: "600" }}>
            Filter Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Filter by Recipe ID"
                type="number"
                value={filterRecipeId}
                onChange={(e) => setFilterRecipeId(e.target.value ? Number(e.target.value) : "")}
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Form upload hình ảnh */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif", fontWeight: "600" }}>
            Upload New Image
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Recipe ID"
                type="number"
                value={recipeId}
                onChange={(e) => setRecipeId(e.target.value ? Number(e.target.value) : "")}
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  backgroundColor: "#90CAF9",
                  "&:hover": { backgroundColor: "#42A5F5" },
                }}
              >
                Choose File
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {file && (
                <Typography sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>
                  Selected: {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  "&:hover": { backgroundColor: "#2563EB" },
                }}
              >
                Upload Image
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Điều khiển phân trang */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of images per page"
              type="number"
              value={pageSize}
              onChange={handlePageSizeChange}
              inputProps={{ min: 1 }}
              sx={{ fontFamily: "'Poppins', sans-serif" }}
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

        {/* Danh sách hình ảnh */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : images.length === 0 ? (
          <Box>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
              No images to display.
            </Typography>
            {filterRecipeId !== "" && (
              <Typography sx={{ fontFamily: "'Poppins', sans-serif", mt: 1, color: "gray" }}>
                Showing images for Recipe ID: {filterRecipeId}
              </Typography>
            )}
          </Box>
        ) : (
          <Grid container spacing={2}>
            {paginatedImages.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.recipeImageId}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={image.imageUrl || "https://via.placeholder.com/140"}
                    alt={`Image ${image.recipeImageId}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                      Image ID: {image.recipeImageId}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                      Recipe ID: {image.recipeId}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                      Uploaded: {formatDate(image.uploadedDate)}
                    </Typography>
                    {editingImageId === image.recipeImageId ? (
                      <Box>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            borderRadius: "8px",
                            padding: "8px 16px",
                            backgroundColor: "#90CAF9",
                            "&:hover": { backgroundColor: "#42A5F5" },
                            mb: 1,
                          }}
                        >
                          Choose New File
                          <input type="file" hidden onChange={handleEditFileChange} accept="image/*" />
                        </Button>
                        {editFile && (
                          <Typography sx={{ fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                            Selected: {editFile.name}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdate(image.recipeImageId)}
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              borderRadius: "8px",
                              mr: 1,
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                              setEditingImageId(null);
                              setEditFile(null);
                            }}
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              borderRadius: "8px",
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <IconButton
                          onClick={() => setEditingImageId(image.recipeImageId)}
                          sx={{ color: "#1976D2" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(image.recipeImageId)}
                          sx={{ color: "#D32F2F" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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

export default RecipeImagesPage;