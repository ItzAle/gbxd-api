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
} from "@mui/material";
import { CalendarToday, Person, Gamepad, Category } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import Image from "next/image";

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

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/${id}`);
        if (!response.ok) {
          throw new Error("Juego no encontrado");
        }
        const gameData = await response.json();
        setGame(gameData);
        setPlatforms(gameData.platforms || []);
      } catch (err) {
        setError("Error al cargar los detalles del juego");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {game.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flexBasis: { xs: "100%", md: "50%" } }}>
            <Image
              src={game.coverImageUrl}
              alt={game.name}
              width={500}
              height={300}
              layout="responsive"
              objectFit="cover"
            />
          </Box>
          <Box sx={{ flexBasis: { xs: "100%", md: "50%" } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarToday fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Release Date: {new Date(game.releaseDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">Editor: {game.publisher}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Gamepad fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Developer: {game.developer}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Category
                fontSize="small"
                sx={{ mr: 1, verticalAlign: "middle" }}
              />
              {game.genres.map((genre, index) => (
                <Chip key={index} label={genre} sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              {game.description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Platforms:</Typography>
          {platforms.map((platform, index) => (
            <Chip key={index} label={platform} sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Store Links:</Typography>
          {game.storeLinks &&
            Object.entries(game.storeLinks).map(([key, link]) =>
              link ? (
                <Box key={key} sx={{ mb: 1 }}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <button>{key}</button>
                  </a>
                </Box>
              ) : null
            )}
        </Box>
        {game.link && (
          <Box sx={{ mb: 2 }}>
            <a href={game.link} target="_blank" rel="noopener noreferrer">
              <button>Official Website</button>
            </a>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default GameDetail;
