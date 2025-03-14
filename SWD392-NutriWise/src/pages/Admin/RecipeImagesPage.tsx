import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { getAllRecipeImages, uploadRecipeImage, updateRecipeImage, deleteRecipeImage, uploadRecipeImages } from "../../api/recipeImageApi";
import { RecipeImageDTO } from "../../types/types";
import Layout from "../../components/Admin/Layout";

const RecipeImagesPage: React.FC = () => {
  const [images, setImages] = useState<RecipeImageDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State cho form upload
  const [recipeId, setRecipeId] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  
  // State cho chỉnh sửa
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRecipeImages();
      console.log("Fetched recipe images:", data);
      setImages(data || []);
    } catch (err) {
      setError("Failed to fetch recipe images.");
      console.error("Error fetching recipe images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!recipeId) {
      alert("Please enter a Recipe ID.");
      return;
    }

    try {
      if (imageUrl) {
        // Upload bằng URL
        const newImage = await uploadRecipeImage(Number(recipeId), imageUrl);
        setImages([...images, newImage]);
        setSuccessMessage("Image uploaded successfully!");
      } else if (file) {
        // Upload bằng file
        const newImages = await uploadRecipeImages(Number(recipeId), [file]);
        setImages([...images, ...newImages]);
        setSuccessMessage("Image uploaded successfully!");
      } else {
        alert("Please provide an Image URL or select a file to upload.");
        return;
      }

      // Reset form
      setRecipeId("");
      setImageUrl("");
      setFile(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert("Failed to upload image.");
      console.error("Error uploading image:", err);
    }
  };

  const handleUpdate = async (imageId: number) => {
    if (!editFile) {
      alert("Please select a file to update the image.");
      return;
    }

    try {
      const updatedImage = await updateRecipeImage(imageId, editFile);
      setImages(images.map((img) => (img.recipeImageId === imageId ? updatedImage : img)));
      setSuccessMessage("Image updated successfully!");
      setEditingImageId(null);
      setEditFile(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert("Failed to update image.");
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
      } catch (err) {
        alert("Failed to delete image.");
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

  return (
    <Layout title="Recipe Images Management" subtitle="View and manage recipe images">
      <Box sx={{ p: 3 }}>
        {/* Tiêu đề */}
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>
          Recipe Images Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif" }}>
          Manage images of recipes.
        </Typography>

        {/* Thông báo thành công */}
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
                onChange={(e) => setRecipeId(Number(e.target.value) || "")}
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Example: https://example.com/image.jpg"
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
            <Grid item xs={12}>
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

        {/* Danh sách hình ảnh */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ fontFamily: "'Poppins', sans-serif" }}>{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {images.length === 0 ? (
              <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>No images to display.</Typography>
            ) : (
              images.map((image) => (
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
                        Uploaded: {new Date(image.uploadedDate).toLocaleDateString()}
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
              ))
            )}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default RecipeImagesPage;