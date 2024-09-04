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
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore"; // Importa el método onSnapshot

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
    const unsubscribe = onSnapshot(
      collection(db, "games"),
      (snapshot) => {
        const gamesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGames(gamesData);
        setLoading(false);
      },
      (error) => {
        setError("Failed to fetch games");
        setLoading(false);
      }
    );

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const GameCard = ({ game }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="140"
          image={game.coverImageUrl || "/placeholder-cover.jpg"}
          alt={game.name}
          onError={(e) => {
            e.target.src = "/placeholder-cover.jpg";
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
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
          <Typography variant="body2" color="text.secondary">
            {game.description.length > 100
              ? `${game.description.substring(0, 100)}...`
              : game.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
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
              <Grid item key={game.id} xs={12} sm={6} md={4}>
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
