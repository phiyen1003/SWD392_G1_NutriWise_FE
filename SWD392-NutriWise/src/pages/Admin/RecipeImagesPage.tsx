import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Card, CardMedia } from "@mui/material";
import { getAllRecipeImages } from "../../api/recipeImageApi";
import { RecipeImageDTO } from "../../types/types";

const RecipeImagesPage: React.FC = () => {
  const [images, setImages] = useState<RecipeImageDTO[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getAllRecipeImages();
        setImages(data);
      } catch (error) {
        console.error("Error fetching recipe images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý hình ảnh công thức
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Quản lý hình ảnh của các công thức.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.recipeImageId}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.imageUrl || "https://via.placeholder.com/140"}
                alt={`Image ${image.recipeImageId}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecipeImagesPage;