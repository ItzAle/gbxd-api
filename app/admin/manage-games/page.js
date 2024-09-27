"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Pagination,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { genresList } from "@/app/constants/genres";
import { getAllPlatforms } from "@/app/constants/platforms";

const GAMES_PER_PAGE = 10;

export default function ManageGames() {
  const [user, loading] = useAuthState(auth);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        fetchGames();
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const filtered = games.filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [games, searchTerm]);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      const data = await response.json();
      setGames(data);
      setFilteredGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleEditGame = (game) => {
    setSelectedGame({
      ...game,
      genres: game.genres || [],
      platforms: game.platforms || [],
      aliases: game.aliases || [],
      franchises: game.franchises || [],
      storeLinks: game.storeLinks || {},
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await fetch(`/api/games/${gameId}`, {
          method: "DELETE",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });
        fetchGames();
      } catch (error) {
        console.error("Error deleting game:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedGame = {
        ...selectedGame,
        aliases: selectedGame.aliases.filter((alias) => alias.trim() !== ""),
        franchises: selectedGame.franchises.filter(
          (franchise) => franchise.trim() !== ""
        ),
      };
      await fetch(`/api/games/${updatedGame.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(updatedGame),
      });
      setIsEditDialogOpen(false);
      fetchGames();
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleArrayChange = (field, index, value) => {
    setSelectedGame((prevGame) => ({
      ...prevGame,
      [field]: prevGame[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddArrayItem = (field) => {
    setSelectedGame((prevGame) => ({
      ...prevGame,
      [field]: [...prevGame[field], ""],
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setSelectedGame((prevGame) => ({
      ...prevGame,
      [field]: prevGame[field].filter((_, i) => i !== index),
    }));
  };

  const handleOpenGenresModal = () => {
    if (selectedGame) setShowGenresModal(true);
  };

  const handleCloseGenresModal = () => setShowGenresModal(false);

  const handleOpenPlatformsModal = () => {
    if (selectedGame) setShowPlatformsModal(true);
  };

  const handleClosePlatformsModal = () => setShowPlatformsModal(false);

  const handleGenreSelection = (genre) => {
    if (selectedGame) {
      setSelectedGame((prevGame) => ({
        ...prevGame,
        genres: prevGame.genres.includes(genre)
          ? prevGame.genres.filter((g) => g !== genre)
          : [...prevGame.genres, genre],
      }));
    }
  };

  const handlePlatformSelection = (platform) => {
    if (selectedGame) {
      setSelectedGame((prevGame) => ({
        ...prevGame,
        platforms: prevGame.platforms.includes(platform)
          ? prevGame.platforms.filter((p) => p !== platform)
          : [...prevGame.platforms, platform],
      }));
    }
  };

  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Games
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {paginatedGames.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={
                  game.coverImageUrl ||
                  "https://via.placeholder.com/140x140?text=No+Image"
                }
                alt={game.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {game.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {game.description
                    ? `${game.description.substring(0, 100)}...`
                    : "No description available"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={() => handleEditGame(game)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteGame(game.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredGames.length / GAMES_PER_PAGE)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Game</DialogTitle>
        <DialogContent>
          {selectedGame && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                fullWidth
                label="Name"
                value={selectedGame.name || ""}
                onChange={(e) =>
                  setSelectedGame({ ...selectedGame, name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedGame.description || ""}
                onChange={(e) =>
                  setSelectedGame({
                    ...selectedGame,
                    description: e.target.value,
                  })
                }
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Cover Image URL"
                value={selectedGame.coverImageUrl || ""}
                onChange={(e) =>
                  setSelectedGame({
                    ...selectedGame,
                    coverImageUrl: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Release Date"
                type="date"
                value={selectedGame.releaseDate || ""}
                onChange={(e) =>
                  setSelectedGame({
                    ...selectedGame,
                    releaseDate: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Developer"
                value={selectedGame.developer || ""}
                onChange={(e) =>
                  setSelectedGame({
                    ...selectedGame,
                    developer: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Publisher"
                value={selectedGame.publisher || ""}
                onChange={(e) =>
                  setSelectedGame({
                    ...selectedGame,
                    publisher: e.target.value,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedGame.isNSFW || false}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        isNSFW: e.target.checked,
                      })
                    }
                  />
                }
                label="Is NSFW"
              />
              <Typography variant="subtitle1">Genres</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(selectedGame.genres || []).map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    onDelete={() => handleRemoveArrayItem("genres", index)}
                  />
                ))}
                <Button onClick={handleOpenGenresModal}>Add Genre</Button>
              </Box>
              <Typography variant="subtitle1">Platforms</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(selectedGame.platforms || []).map((platform, index) => (
                  <Chip
                    key={index}
                    label={platform}
                    onDelete={() => handleRemoveArrayItem("platforms", index)}
                  />
                ))}
                <Button onClick={handleOpenPlatformsModal}>Add Platform</Button>
              </Box>
              <Typography variant="subtitle1">Aliases</Typography>
              {(selectedGame.aliases || []).map((alias, index) => (
                <TextField
                  key={index}
                  fullWidth
                  value={alias}
                  onChange={(e) =>
                    handleArrayChange("aliases", index, e.target.value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleRemoveArrayItem("aliases", index)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
              <Button onClick={() => handleAddArrayItem("aliases")}>
                Add Alias
              </Button>
              <Typography variant="subtitle1">Franchises</Typography>
              {(selectedGame.franchises || []).map((franchise, index) => (
                <TextField
                  key={index}
                  fullWidth
                  value={franchise}
                  onChange={(e) =>
                    handleArrayChange("franchises", index, e.target.value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleRemoveArrayItem("franchises", index)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
              <Button onClick={() => handleAddArrayItem("franchises")}>
                Add Franchise
              </Button>
              <Typography variant="subtitle1">Store Links</Typography>
              {Object.entries(selectedGame.storeLinks || {}).map(
                ([store, link]) => (
                  <TextField
                    key={store}
                    fullWidth
                    label={store}
                    value={link}
                    onChange={(e) =>
                      setSelectedGame({
                        ...selectedGame,
                        storeLinks: {
                          ...(selectedGame.storeLinks || {}),
                          [store]: e.target.value,
                        },
                      })
                    }
                  />
                )
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showGenresModal} onClose={handleCloseGenresModal}>
        <DialogTitle>Add Genres</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Genres"
            type="text"
            fullWidth
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
          />
          <List>
            {genresList
              .filter((genre) =>
                genre.toLowerCase().includes(genreSearch.toLowerCase())
              )
              .map((genre) => (
                <ListItem key={genre} disablePadding>
                  <ListItemButton onClick={() => handleGenreSelection(genre)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedGame?.genres?.includes(genre) || false}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={genre} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGenresModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showPlatformsModal} onClose={handleClosePlatformsModal}>
        <DialogTitle>Add Platforms</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Platforms"
            type="text"
            fullWidth
            value={platformSearch}
            onChange={(e) => setPlatformSearch(e.target.value)}
          />
          <List>
            {getAllPlatforms()
              .filter((platform) =>
                platform.toLowerCase().includes(platformSearch.toLowerCase())
              )
              .map((platform) => (
                <ListItem key={platform} disablePadding>
                  <ListItemButton
                    onClick={() => handlePlatformSelection(platform)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={
                          selectedGame?.platforms?.includes(platform) || false
                        }
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={platform} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlatformsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
