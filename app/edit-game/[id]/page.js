"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Chip,
  Modal,
  List,
  ListItem,
  ListSubheader,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Snackbar,
  CircularProgress,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/theme";
import Navbar from "@/app/components/Navbar";
import { genresList } from "@/app/constants/genres";
import { platformsByBrand, getAllPlatforms } from "@/app/constants/platforms";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Image from "next/image";
import AliasesFranchisesForm from "@/app/components/AliasesFranchisesForm/AliasesFranchisesForm";
import HashtagsForm from "@/app/components/HashtagsForm/HashtagsForm";
import ImagesVideosForm from "@/app/components/ImagesVideosForm/ImagesVideosForm";

const EditGame = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/${id}`);
        if (!response.ok) {
          throw new Error("Juego no encontrado");
        }
        const gameData = await response.json();
        setGame({
          ...gameData,
          releaseDate:
            gameData.releaseDate === "TBA" ? null : dayjs(gameData.releaseDate),
          isTBA: gameData.releaseDate === "TBA",
          storeLinks: gameData.storeLinks || {
            steam: "",
            epicGames: "",
            gog: "",
            playStation: "",
            xbox: "",
            nintendoSwitch: "",
          },
          aliases: gameData.aliases || [""],
          franchises: gameData.franchises || [""],
          genres: gameData.genres || [],
          platforms: gameData.platforms || [],
          hashtags: gameData.hashtags || [],
          images: gameData.images || [],
          videos: gameData.videos || [],
        });
        setImagePreview(gameData.coverImageUrl);
      } catch (err) {
        console.error("Error al cargar los detalles del juego", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/edit-game/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...game,
          releaseDate: game.isTBA
            ? "TBA"
            : game.releaseDate.format("YYYY-MM-DD"),
          storeLinks: game.storeLinks,
          aliases: game.aliases.filter((alias) => alias.trim() !== ""),
          franchises: game.franchises.filter(
            (franchise) => franchise.trim() !== ""
          ),
          hashtags: game.hashtags,
          images: game.images,
          videos: game.videos,
        }),
      });

      if (response.ok) {
        router.push(`/game/${id}`);
      } else {
        setSnackbarMessage("Error al actualizar el juego");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Error al actualizar el juego");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGame((prevGame) => ({
      ...prevGame,
      [name]: type === "checkbox" ? checked : value,
      releaseDate: name === "isTBA" && checked ? null : prevGame.releaseDate,
    }));
  };

  const handleGenreSelection = (genre) => {
    setGame((prevGame) => ({
      ...prevGame,
      genres: prevGame.genres.includes(genre)
        ? prevGame.genres.filter((g) => g !== genre)
        : [...prevGame.genres, genre],
    }));
  };

  const handlePlatformSelection = (platform) => {
    setGame((prevGame) => ({
      ...prevGame,
      platforms: prevGame.platforms.includes(platform)
        ? prevGame.platforms.filter((p) => p !== platform)
        : [...prevGame.platforms, platform],
    }));
  };

  const handleStoreLinksChange = (e) => {
    const { name, value } = e.target;
    setGame((prevGame) => ({
      ...prevGame,
      storeLinks: {
        ...prevGame.storeLinks,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const { name, value } = e.target;
    setGame((prevGame) => ({ ...prevGame, [name]: value }));
    setImagePreview(value);
  };

  const filteredGenres = genresList.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const allPlatforms = getAllPlatforms();
  const filteredPlatforms = allPlatforms.filter((platform) =>
    platform.toLowerCase().includes(platformSearch.toLowerCase())
  );

  const getAvailableStores = () => {
    const stores = [];
    if (game.platforms.includes("PC")) stores.push("steam", "epicGames", "gog");
    if (
      game.platforms.includes("PlayStation 4") ||
      game.platforms.includes("PlayStation 5")
    )
      stores.push("playStation");
    if (
      game.platforms.includes("Xbox One") ||
      game.platforms.includes("Xbox Series X/S")
    )
      stores.push("xbox");
    if (game.platforms.includes("Nintendo Switch"))
      stores.push("nintendoSwitch");
    return stores;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    router.push("/");
    return null;
  }

  if (!game) {
    return <Typography>Error: No se pudo cargar el juego</Typography>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Editar Juego
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={game.name || ""}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Developer"
              name="developer"
              value={game.developer || ""}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Publisher"
              name="publisher"
              value={game.publisher || ""}
              onChange={handleChange}
              margin="normal"
              required
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Release Date"
                value={game.releaseDate}
                onChange={(newValue) =>
                  setGame({ ...game, releaseDate: newValue, isTBA: false })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    required={!game.isTBA}
                    disabled={game.isTBA}
                  />
                )}
              />
            </LocalizationProvider>
            <FormControlLabel
              control={
                <Checkbox
                  checked={game.isTBA}
                  onChange={handleChange}
                  name="isTBA"
                />
              }
              label="TBA"
              sx={{ ml: 2 }}
            />
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={game.description || ""}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <AliasesFranchisesForm
              aliases={game.aliases}
              setAliases={(newAliases) =>
                setGame({ ...game, aliases: newAliases })
              }
              franchises={game.franchises}
              setFranchises={(newFranchises) =>
                setGame({ ...game, franchises: newFranchises })
              }
            />
            <HashtagsForm
              hashtags={game.hashtags}
              setHashtags={(newHashtags) =>
                setGame({ ...game, hashtags: newHashtags })
              }
            />
            <ImagesVideosForm
              images={game.images}
              setImages={(newImages) => setGame({ ...game, images: newImages })}
              videos={game.videos}
              setVideos={(newVideos) => setGame({ ...game, videos: newVideos })}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Géneros</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {game.genres && game.genres.length > 0 ? (
                  game.genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onDelete={() => handleGenreSelection(genre)}
                    />
                  ))
                ) : (
                  <Typography variant="body2">
                    No hay géneros añadidos
                  </Typography>
                )}
                <Button onClick={() => setShowGenresModal(true)}>
                  Add genre
                </Button>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Plataformas</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {game.platforms && game.platforms.length > 0 ? (
                  game.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      onDelete={() => handlePlatformSelection(platform)}
                    />
                  ))
                ) : (
                  <Typography variant="body2">
                    No hay plataformas añadidas
                  </Typography>
                )}
                <Button onClick={() => setShowPlatformsModal(true)}>
                  Add platform
                </Button>
              </Box>
            </Box>
            <TextField
              fullWidth
              label="Cover image URL"
              name="coverImageUrl"
              value={game.coverImageUrl || ""}
              onChange={handleImageChange}
              margin="normal"
              required
            />
            {imagePreview && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Image
                  src={imagePreview}
                  alt="Vista previa de la portada"
                  width={200}
                  height={300}
                  objectFit="contain"
                />
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Store links</Typography>
              {getAvailableStores().map((store) => (
                <TextField
                  key={store}
                  fullWidth
                  label={store.charAt(0).toUpperCase() + store.slice(1)}
                  name={store}
                  value={game.storeLinks[store] || ""}
                  onChange={handleStoreLinksChange}
                  margin="normal"
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Save changes
            </Button>
          </form>
        </Paper>
      </Container>

      <Modal open={showGenresModal} onClose={() => setShowGenresModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Seleccionar géneros
          </Typography>
          <TextField
            fullWidth
            placeholder="Search genres"
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {filteredGenres.map((genre) => (
              <ListItem key={genre} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={game.genres.includes(genre)}
                      onChange={() => handleGenreSelection(genre)}
                    />
                  }
                  label={genre}
                />
              </ListItem>
            ))}
          </List>
          <Button onClick={() => setShowGenresModal(false)} sx={{ mt: 2 }}>
            Add
          </Button>
        </Box>
      </Modal>

      <Modal
        open={showPlatformsModal}
        onClose={() => setShowPlatformsModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Seleccionar plataformas
          </Typography>
          <TextField
            fullWidth
            placeholder="Search platforms"
            value={platformSearch}
            onChange={(e) => setPlatformSearch(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {Object.entries(platformsByBrand).map(([brand, platforms]) => (
              <React.Fragment key={brand}>
                <ListSubheader>{brand}</ListSubheader>
                {platforms
                  .filter((platform) =>
                    platform
                      .toLowerCase()
                      .includes(platformSearch.toLowerCase())
                  )
                  .map((platform) => (
                    <ListItem key={platform} disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={game.platforms.includes(platform)}
                            onChange={() => handlePlatformSelection(platform)}
                          />
                        }
                        label={platform}
                      />
                    </ListItem>
                  ))}
              </React.Fragment>
            ))}
          </List>
          <Button onClick={() => setShowPlatformsModal(false)} sx={{ mt: 2 }}>
            Add
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </ThemeProvider>
  );
};

export default EditGame;
