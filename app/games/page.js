"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Gamepad,
  Category,
  Search,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

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

const GameCard = ({ game }) => (
  <Link href={`/game/${game.slug}`} passHref>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardMedia component="div" sx={{ height: 200, position: "relative" }}>
          <Image
            src={
              game.coverImageUrl || "/placeholder.svg?height=200&width=400"
            }
            alt={game.name}
            layout="fill"
            objectFit="cover"
          />
        </CardMedia>
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              noWrap
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              {game.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarToday
                fontSize="small"
                sx={{ mr: 1, color: "secondary.main" }}
              />
              <Typography variant="body2" color="text.secondary">
                {new Date(game.releaseDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Person
                fontSize="small"
                sx={{ mr: 1, color: "secondary.main" }}
              />
              <Typography variant="body2" color="text.secondary">
                {game.publisher}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Gamepad
                fontSize="small"
                sx={{ mr: 1, color: "secondary.main" }}
              />
              <Typography variant="body2" color="text.secondary">
                {game.developer}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Category
                fontSize="small"
                sx={{
                  mr: 1,
                  verticalAlign: "middle",
                  color: "secondary.main",
                }}
              />
              {(game.genres || []).map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  size="small"
                  sx={{
                    mr: 0.5,
                    mb: 0.5,
                    backgroundColor: "primary.main",
                    color: "white",
                  }}
                />
              ))}
            </Box>
          </div>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              height: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {game.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

const GAMES_PER_PAGE = 12;

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch("/api/games");
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();
      const sortedGames = data.sort(
        (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
      );
      setGames(sortedGames);
      setFilteredGames(sortedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    const filtered = games.filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
    setPage(1);
    setVisibleGames(filtered.slice(0, GAMES_PER_PAGE));
  }, [searchTerm, games]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        const startIndex = (nextPage - 1) * GAMES_PER_PAGE;
        const endIndex = startIndex + GAMES_PER_PAGE;
        setVisibleGames((prevVisibleGames) => [
          ...prevVisibleGames,
          ...filteredGames.slice(startIndex, endIndex),
        ]);
        return nextPage;
      });
    }
  }, [inView, filteredGames]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            All Games
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "secondary.main" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "secondary.main",
                },
                "&:hover fieldset": {
                  borderColor: "secondary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
        </Box>
        {loading ? (
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Skeleton
                  variant="rectangular"
                  height={300}
                  sx={{ borderRadius: "12px" }}
                />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ backgroundColor: "background.paper", color: "error.main" }}
          >
            {error}
          </Alert>
        ) : (
          <AnimatePresence>
            <Grid container spacing={4}>
              {visibleGames.map((game) => (
                <Grid item key={game.slug} xs={12} sm={6} md={4}>
                  <GameCard game={game} />
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
        {!loading && !error && visibleGames.length < filteredGames.length && (
          <Box ref={ref} sx={{ height: 20, mt: 4 }} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default GamesList;
