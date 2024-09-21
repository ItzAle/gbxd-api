import React, { useState } from "react";
import { TextField, Button, Box, Chip, Typography, Grid, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Image from 'next/image';

const EditGameForm = ({ game, onSave }) => {
  const [editedGame, setEditedGame] = useState(game);
  const [newGenre, setNewGenre] = useState('');
  const [newPlatform, setNewPlatform] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGame((prevGame) => ({
      ...prevGame,
      [name]: value,
    }));
  };

  const handleStoreLinksChange = (store, value) => {
    setEditedGame((prevGame) => ({
      ...prevGame,
      storeLinks: {
        ...prevGame.storeLinks,
        [store]: value,
      },
    }));
  };

  const handleAddGenre = () => {
    if (newGenre && !editedGame.genres.includes(newGenre)) {
      setEditedGame((prevGame) => ({
        ...prevGame,
        genres: [...prevGame.genres, newGenre],
      }));
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setEditedGame((prevGame) => ({
      ...prevGame,
      genres: prevGame.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleAddPlatform = () => {
    if (newPlatform && !editedGame.platforms.includes(newPlatform)) {
      setEditedGame((prevGame) => ({
        ...prevGame,
        platforms: [...prevGame.platforms, newPlatform],
      }));
      setNewPlatform('');
    }
  };

  const handleRemovePlatform = (platformToRemove) => {
    setEditedGame((prevGame) => ({
      ...prevGame,
      platforms: prevGame.platforms.filter((platform) => platform !== platformToRemove),
    }));
  };

  const handleSave = () => {
    onSave(editedGame);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedGame.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Release Date"
            name="releaseDate"
            value={editedGame.releaseDate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editedGame.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cover Image URL"
            name="coverImageUrl"
            value={editedGame.coverImageUrl}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          {editedGame.coverImageUrl && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Image
                src={editedGame.coverImageUrl}
                alt="Game cover"
                width={200}
                height={300}
                objectFit="contain"
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Genres</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
            {editedGame.genres.map((genre, index) => (
              <Chip
                key={index}
                label={genre}
                onDelete={() => handleRemoveGenre(genre)}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="New Genre"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
            />
            <Button onClick={handleAddGenre}>Add</Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Platforms</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
            {editedGame.platforms.map((platform, index) => (
              <Chip
                key={index}
                label={platform}
                onDelete={() => handleRemovePlatform(platform)}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="New Platform"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
            />
            <Button onClick={handleAddPlatform}>Add</Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Store Links</Typography>
          {['steam', 'gog', 'epicGames', 'playStation', 'xbox', 'nintendoSwitch'].map((store) => (
            <TextField
              key={store}
              fullWidth
              label={store.charAt(0).toUpperCase() + store.slice(1)}
              value={editedGame.storeLinks?.[store] || ''}
              onChange={(e) => handleStoreLinksChange(store, e.target.value)}
              sx={{ mt: 1 }}
            />
          ))}
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditGameForm;
