import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import EditGameModal from "../EditGameModal/EditGameModal";

const BatchGamePreview = ({ game, onUpdate, genres, platforms }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = (updatedGame) => {
    onUpdate(updatedGame);
    handleCloseModal();
  };

  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={
          game.coverImageUrl ||
          "https://via.placeholder.com/140x140?text=No+Image"
        }
        alt={game.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {game.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.description
            ? `${game.description.substring(0, 100)}...`
            : "No description available"}
        </Typography>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Edit Game
        </Button>
      </CardContent>
      <EditGameModal
        open={isModalOpen}
        onClose={handleCloseModal}
        game={game}
        onSave={handleSave}
        genres={genres}
        platforms={platforms}
      />
    </Card>
  );
};

export default BatchGamePreview;
