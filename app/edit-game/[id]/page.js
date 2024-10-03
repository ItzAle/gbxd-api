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
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/theme";
import Navbar from "@/app/components/Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Image from "next/image";
import AliasesFranchisesForm from "@/app/components/AliasesFranchisesForm/AliasesFranchisesForm";
import HashtagsForm from "@/app/components/HashtagsForm/HashtagsForm";
import ImagesVideosForm from "@/app/components/ImagesVideosForm/ImagesVideosForm";
import GenrePlatformSelector from "@/app/components/GenrePlatformSelector";

const EditGame = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/${id}`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        });
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
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Información básica" />
            <Tab label="Detalles" />
            <Tab label="Multimedia" />
            <Tab label="Enlaces" />
          </Tabs>
          <form onSubmit={handleSubmit}>
            {tabValue === 0 && (
              <Box>
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
              </Box>
            )}
            {tabValue === 1 && (
              <Box>
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
                <GenrePlatformSelector
                  formData={game}
                  setFormData={setGame}
                />
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <ImagesVideosForm
                  images={game.images}
                  setImages={(newImages) => setGame({ ...game, images: newImages })}
                  videos={game.videos}
                  setVideos={(newVideos) => setGame({ ...game, videos: newVideos })}
                />
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
              </Box>
            )}
            {tabValue === 3 && (
              <Box>
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
            )}
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