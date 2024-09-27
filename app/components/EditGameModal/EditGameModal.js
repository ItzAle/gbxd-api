import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";

const EditGameModal = ({ open, onClose, game, onSave, genres, platforms }) => {
  const [editedGame, setEditedGame] = useState(game);
  const [newPlatform, setNewPlatform] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newFranchise, setNewFranchise] = useState("");
  const [newAlias, setNewAlias] = useState("");

  useEffect(() => {
    setEditedGame(game);
  }, [game]);

  const handleChange = (field, value) => {
    setEditedGame((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, isAdd = true) => {
    setEditedGame((prev) => ({
      ...prev,
      [field]: isAdd
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item) => item !== value),
    }));
  };

  const handleStoreLinksChange = (store, value) => {
    setEditedGame((prev) => ({
      ...prev,
      storeLinks: { ...(prev.storeLinks || {}), [store]: value },
    }));
  };

  const handleSave = () => {
    onSave(editedGame);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Game: {game.name}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={editedGame.name}
          onChange={(e) => handleChange("name", e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Slug"
          value={editedGame.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Cover Image URL"
          value={editedGame.coverImageUrl}
          onChange={(e) => handleChange("coverImageUrl", e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={editedGame.description}
          onChange={(e) => handleChange("description", e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Release Date"
          value={editedGame.releaseDate}
          onChange={(e) => handleChange("releaseDate", e.target.value)}
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Developer"
          value={editedGame.developer}
          onChange={(e) => handleChange("developer", e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Publisher"
          value={editedGame.publisher}
          onChange={(e) => handleChange("publisher", e.target.value)}
          margin="normal"
        />

        <FormControlLabel
          control={
            <Switch
              checked={editedGame.isNSFW}
              onChange={(e) => handleChange("isNSFW", e.target.checked)}
            />
          }
          label="Is NSFW"
        />

        <FormControlLabel
          control={
            <Switch
              checked={editedGame.isTBA}
              onChange={(e) => handleChange("isTBA", e.target.checked)}
            />
          }
          label="Is TBA"
        />

        {/* Platforms */}
        <Typography variant="subtitle1">Platforms:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {editedGame.platforms?.map((platform, index) => (
            <Chip
              key={index}
              label={platform}
              onDelete={() => handleArrayChange("platforms", platform, false)}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            placeholder="Add platform"
          />
          <Button
            onClick={() => {
              if (newPlatform.trim()) {
                handleArrayChange("platforms", newPlatform.trim());
                setNewPlatform("");
              }
            }}
          >
            Add
          </Button>
        </Box>

        {/* Genres */}
        <Typography variant="subtitle1">Genres:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {editedGame.genres?.map((genre, index) => (
            <Chip
              key={index}
              label={genre}
              onDelete={() => handleArrayChange("genres", genre, false)}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add genre"
          />
          <Button
            onClick={() => {
              if (newGenre.trim()) {
                handleArrayChange("genres", newGenre.trim());
                setNewGenre("");
              }
            }}
          >
            Add
          </Button>
        </Box>

        {/* Store Links */}
        <Typography variant="subtitle1">Store Links:</Typography>
        {Object.entries(editedGame.storeLinks || {}).map(([store, link]) => (
          <TextField
            key={store}
            fullWidth
            label={store}
            value={link}
            onChange={(e) => handleStoreLinksChange(store, e.target.value)}
            margin="normal"
          />
        ))}

        {/* Franchises */}
        <Typography variant="subtitle1">Franchises:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {editedGame.franchises?.map((franchise, index) => (
            <Chip
              key={index}
              label={franchise}
              onDelete={() => handleArrayChange("franchises", franchise, false)}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            value={newFranchise}
            onChange={(e) => setNewFranchise(e.target.value)}
            placeholder="Add franchise"
          />
          <Button
            onClick={() => {
              if (newFranchise.trim()) {
                handleArrayChange("franchises", newFranchise.trim());
                setNewFranchise("");
              }
            }}
          >
            Add
          </Button>
        </Box>

        {/* Aliases */}
        <Typography variant="subtitle1">Aliases:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {editedGame.aliases?.map((alias, index) => (
            <Chip
              key={index}
              label={alias}
              onDelete={() => handleArrayChange("aliases", alias, false)}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            placeholder="Add alias"
          />
          <Button
            onClick={() => {
              if (newAlias.trim()) {
                handleArrayChange("aliases", newAlias.trim());
                setNewAlias("");
              }
            }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGameModal;
