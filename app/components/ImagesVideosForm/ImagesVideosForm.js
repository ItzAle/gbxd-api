import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ImagesVideosForm = ({
  images = [],
  setImages,
  videos = [],
  setVideos,
}) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages([
        ...images,
        { url: newImageUrl, description: newImageDescription },
      ]);
      setNewImageUrl("");
      setNewImageDescription("");
    }
  };

  const handleAddVideo = () => {
    if (newVideoUrl) {
      setVideos([
        ...videos,
        { url: newVideoUrl, description: newVideoDescription },
      ]);
      setNewVideoUrl("");
      setNewVideoDescription("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6">Additional Images</Typography>
      {Array.isArray(images) &&
        images.map((image, index) => (
          <Box key={index} display="flex" alignItems="center" mb={1}>
            <Chip
              label={image.description || `Imagen ${index + 1}`}
              onDelete={() => handleRemoveImage(index)}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={() => handleRemoveImage(index)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      <TextField
        fullWidth
        label="Image URL"
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Image Description"
        value={newImageDescription}
        onChange={(e) => setNewImageDescription(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleAddImage}>Add Image</Button>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Videos
      </Typography>
      {Array.isArray(videos) &&
        videos.map((video, index) => (
          <Box key={index} display="flex" alignItems="center" mb={1}>
            <Chip
              label={video.description || `Video ${index + 1}`}
              onDelete={() => handleRemoveVideo(index)}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={() => handleRemoveVideo(index)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      <TextField
        fullWidth
        label="Video URL"
        value={newVideoUrl}
        onChange={(e) => setNewVideoUrl(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Video Description"
        value={newVideoDescription}
        onChange={(e) => setNewVideoDescription(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleAddVideo}>Add Video</Button>
    </Box>
  );
};

export default ImagesVideosForm;
