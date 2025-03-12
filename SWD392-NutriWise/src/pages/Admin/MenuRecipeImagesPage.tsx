import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardMedia } from "@mui/material";
import { getAllMenuRecipeImages } from "../../api/MenuRecipeImage";
import { MenuRecipeImageDTO } from "../../types/types";

const MenuRecipeImagesPage: React.FC = () => {
  const [images, setImages] = useState<MenuRecipeImageDTO[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getAllMenuRecipeImages();
        setImages(data);
      } catch (error) {
        console.error("Error fetching menu recipe images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý hình ảnh thực đơn
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý hình ảnh của các công thức trong thực đơn.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.menuRecipeImageId}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.imageUrl || "https://via.placeholder.com/140"}
                alt={`Image ${image.menuRecipeImageId}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuRecipeImagesPage;