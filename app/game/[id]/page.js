"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Chip,
  Skeleton,
  Alert,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Gamepad,
  Category,
  Language,
  Store,
  Label,
  Games,
} from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Tag, Image as ImageIcon, VideoLibrary } from "@mui/icons-material";
import { motion } from "framer-motion";
import ReactPlayer from "react-player/lazy";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/app/styles/slick-theme.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8f44fd",
    },
    secondary: {
      main: "#ff5555",
    },
    background: {
      default: "#151515",
      paper: "#202020",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");

  const isAdmin = user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleEdit = () => {
    router.push(`/edit-game/${id}`);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteStatus("Borrando juego...");
    try {
      setError(null);
      const response = await fetch(`/api/game/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al borrar el juego");
      }

      setDeleteStatus("Juego borrado exitosamente");
      setTimeout(() => {
        router.push("/games");
      }, 2000);
    } catch (error) {
      console.error("Error al borrar el juego:", error);
      setError(error.message);
      setDeleteStatus("Error al borrar el juego");
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/${id}`);
        if (!response.ok) {
          throw new Error("Game not found");
        }
        const gameData = await response.json();
        setGame(gameData);
        setPlatforms(gameData.platforms || []);
      } catch (err) {
        setError("Error loading game details");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: "12px" }}
          />
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert
            severity="error"
            sx={{ backgroundColor: "background.paper", color: "error.main" }}
          >
            {error}
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: "12px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              {game.name}
            </Typography>
            {isAdmin && (
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleEdit}
                >
                  Editar juego
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenDeleteDialog}
                >
                  Borrar juego
                </Button>
              </Box>
            )}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "60%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <Image
                    src={game.coverImageUrl}
                    alt={game.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    Platforms:
                  </Typography>
                  {platforms.map((platform, index) => (
                    <Chip
                      key={index}
                      label={platform}
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        backgroundColor: "secondary.main",
                        color: "white",
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "primary.main" }}
                  >
                    Store Links:
                  </Typography>
                  <Grid container spacing={2}>
                    {game.storeLinks &&
                      Object.entries(game.storeLinks).map(([key, link]) =>
                        link ? (
                          <Grid item key={key}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {key}
                              </Button>
                            </motion.div>
                          </Grid>
                        ) : null
                      )}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday
                      fontSize="small"
                      sx={{ mr: 1, color: "secondary.main" }}
                    />
                    <Typography variant="body1">
                      Release Date:{" "}
                      {game.releaseDate === "TBA"
                        ? "TBA"
                        : new Date(game.releaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person
                      fontSize="small"
                      sx={{ mr: 1, color: "secondary.main" }}
                    />
                    <Typography variant="body1">
                      Publisher: {game.publisher}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Gamepad
                      fontSize="small"
                      sx={{ mr: 1, color: "secondary.main" }}
                    />
                    <Typography variant="body1">
                      Developer: {game.developer}
                    </Typography>
                  </Box>
                  {game.aliases && game.aliases.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Label
                        fontSize="small"
                        sx={{ mr: 1, color: "secondary.main" }}
                      />
                      <Typography variant="body1">
                        Aliases: {game.aliases.join(", ")}
                      </Typography>
                    </Box>
                  )}
                  {game.franchises && game.franchises.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Games
                        fontSize="small"
                        sx={{ mr: 1, color: "secondary.main" }}
                      />
                      <Typography variant="body1">
                        Franchises: {game.franchises.join(", ")}
                      </Typography>
                    </Box>
                  )}
                  {game.hashtags && game.hashtags.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Tag
                        fontSize="small"
                        sx={{ mr: 1, color: "secondary.main" }}
                      />
                      <Typography variant="body1">
                        Hashtags:{" "}
                        {game.hashtags.map((hashtag) => (
                          <Chip
                            key={hashtag}
                            label={hashtag}
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              backgroundColor: "primary.main",
                              color: "white",
                            }}
                          />
                        ))}
                      </Typography>
                    </Box>
                  )}
                  {game.genres && game.genres.length > 0 ? (
                    <Box sx={{ mb: 2 }}>
                      <Category
                        fontSize="small"
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                          color: "secondary.main",
                        }}
                      />
                      {game.genres.map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre}
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            backgroundColor: "primary.main",
                            color: "white",
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      There are no genres
                    </Typography>
                  )}
                  <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
                    {game.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {(game.images && game.images.length > 0) ||
            (game.videos && game.videos.length > 0) ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  <ImageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Galería
                </Typography>
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  adaptiveHeight={true}
                >
                  {game.images &&
                    game.images.map((image, index) => (
                      <Box
                        key={`image-${index}`}
                        sx={{ height: 400, position: "relative" }}
                      >
                        <Image
                          src={image.url}
                          alt={image.description || `Imagen ${index + 1}`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </Box>
                    ))}
                  {game.videos &&
                    game.videos.map((video, index) => (
                      <Box key={`video-${index}`} sx={{ height: 400 }}>
                        <ReactPlayer
                          url={video.url}
                          width="100%"
                          height="100%"
                          controls={true}
                          light={true}
                          config={{
                            youtube: {
                              playerVars: {
                                showinfo: 0,
                                rel: 0,
                                modestbranding: 1,
                              },
                            },
                          }}
                        />
                      </Box>
                    ))}
                </Slider>
              </Box>
            ) : null}
            {game.link && (
              <Box sx={{ mt: 4 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Language />}
                  >
                    Official Website
                  </Button>
                </motion.div>
              </Box>
            )}
          </Paper>
        </motion.div>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Estás seguro de que quieres borrar este juego?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Esta acción no se puede deshacer. El juego será eliminado
              permanentemente.
            </DialogContentText>
            {isDeleting && (
              <Box sx={{ mt: 2 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography variant="body2">{deleteStatus}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteDialog}
              color="primary"
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              autoFocus
              disabled={isDeleting}
            >
              Sí, borrar juego
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default GameDetail;
