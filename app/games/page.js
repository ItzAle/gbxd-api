"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Alert,
  Box,
} from "@mui/material";
import { CalendarToday, Person, Gamepad, Category } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import placeholderHover from "../../src/img/placeholder-cover.jpg";
import Link from "next/link";

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

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        // Ordenar los juegos por fecha de lanzamiento (más recientes primero)
        const sortedGames = data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setGames(sortedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const GameCard = ({ game }) => (
    <Link href={`/game/${game.slug}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardMedia
            component="img"
            height="200"
            image={game.coverImageUrl || placeholderHover}
            alt={game.name}
            onError={(e) => {
              e.target.src = placeholderHover;
            }}
            sx={{ objectFit: "cover" }}
          />
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography gutterBottom variant="h5" component="div" noWrap>
                {game.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(game.releaseDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Person fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {game.publisher}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Gamepad fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {game.developer}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Category
                  fontSize="small"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                {(game.genres || []).map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  height: "3em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {game.description.length > 100
                  ? `${game.description.substring(0, 100)}...`
                  : game.description}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          All Games
        </Typography>
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Skeleton variant="rectangular" height={140} />
                <Skeleton />
                <Skeleton width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            {games.map((game) => (
              <Grid item key={game.slug} xs={12} sm={6} md={4}>
                <GameCard game={game} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default GamesList;
