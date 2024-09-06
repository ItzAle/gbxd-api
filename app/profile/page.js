"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import Navbar from "../components/Navbar";
import slugify from "slugify";
import { genresList } from "../constants/genres";
import { platformsList } from "../constants/platforms";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

export default function Profile() {
  const [user] = useAuthState(auth);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserGames();
    }
  }, [user]);

  const fetchUserGames = async () => {
    setLoading(true);
    const q = query(collection(db, "games"), where("addedBy", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userGames = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGames(userGames);
    setLoading(false);
  };

  const handleEditClick = (game) => {
    setEditingGame(game);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGame(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingGame((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultipleChange = (event, fieldName) => {
    const {
      target: { value },
    } = event;
    setEditingGame((prev) => ({
      ...prev,
      [fieldName]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSave = async () => {
    if (editingGame) {
      const updatedGame = { ...editingGame };
      const oldSlug = updatedGame.slug;

      // Actualizar el slug si el nombre ha cambiado
      if (
        updatedGame.name !== games.find((g) => g.id === editingGame.id).name
      ) {
        updatedGame.slug = slugify(updatedGame.name, {
          lower: true,
          strict: true,
        });
      }

      const gameRef = doc(db, "games", editingGame.id);
      await updateDoc(gameRef, updatedGame);

      // Actualizar la API
      try {
        const response = await fetch(`/api/game/${oldSlug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedGame,
            oldSlug: oldSlug,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update game in API");
        }

        const result = await response.json();
        console.log("API update result:", result);
      } catch (error) {
        console.error("Error updating game in API:", error);
      }

      setOpen(false);
      await fetchUserGames(); // Refetch games to update the list
    }
  };

  const handleDeleteClick = async (game) => {
    if (window.confirm(`Are you sure you want to delete ${game.name}?`)) {
      try {
        const response = await fetch(`/api/game/${game.slug}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete game from API");
        }

        console.log("Game deleted successfully");
        await fetchUserGames(); // Refetch games to update the list
      } catch (error) {
        console.error("Error deleting game:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="h6" gutterBottom>
          Games you&apos;ve added:
        </Typography>
        <Grid container spacing={4}>
          {games.map((game) => (
            <Grid item key={game.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={game.coverImageUrl}
                  alt={game.name}
                />
                <CardContent>
                  <Typography variant="h6">{game.name}</Typography>
                  <Typography variant="body2">{game.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditClick(game)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(game)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Game</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Game Name"
            type="text"
            fullWidth
            variant="standard"
            value={editingGame?.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={editingGame?.description || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="publisher"
            label="Publisher"
            type="text"
            fullWidth
            variant="standard"
            value={editingGame?.publisher || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="developer"
            label="Developer"
            type="text"
            fullWidth
            variant="standard"
            value={editingGame?.developer || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="releaseDate"
            label="Release Date"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={editingGame?.releaseDate || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="coverImageUrl"
            label="Cover Image URL"
            type="text"
            fullWidth
            variant="standard"
            value={editingGame?.coverImageUrl || ""}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="platforms-label">Platforms</InputLabel>
            <Select
              labelId="platforms-label"
              multiple
              value={editingGame?.platforms || []}
              onChange={(e) => handleMultipleChange(e, "platforms")}
              input={<OutlinedInput label="Platforms" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {platformsList.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="genres-label">Genres</InputLabel>
            <Select
              labelId="genres-label"
              multiple
              value={editingGame?.genres || []}
              onChange={(e) => handleMultipleChange(e, "genres")}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {genresList.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
