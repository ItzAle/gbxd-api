"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  Gamepad,
  Category,
  Search,
} from "@mui/icons-material";
import Navbar from "../Navbar";
import Image from "next/image";
import Link from "next/link";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
          <LazyLoadImage
            src={game.coverImageUrl || "/placeholder.svg?height=200&width=400"}
            alt={game.name}
            effect="blur"
            height={200}
            width="100%"
            style={{ objectFit: "cover" }}
          />
        </CardMedia>
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: { xs: 1, sm: 2 },
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
                {game.releaseDate === "TBA"
                  ? "TBA"
                  : new Date(game.releaseDate).toLocaleDateString()}
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

const GAMES_PER_PAGE = 9;

const GamesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  const fetchGames = useCallback(async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        setLoading(true);
        const response = await fetch("/api/games");
        if (!response.ok) {
          throw new Error(`Error al obtener juegos: ${response.statusText}`);
        }
        const data = await response.json();
        const sortedGames = data.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setGames(sortedGames);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error al obtener juegos:", error);
        retries--;
        if (retries === 0) {
          setError(`Error al obtener juegos: ${error.message}`);
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const year = searchParams.get("year") || "all";
    const genre = searchParams.get("genre") || "all";
    setCurrentPage(page);
    setSearchTerm(search);
    setYearFilter(year);
    setGenreFilter(genre);
    fetchGames();
  }, [searchParams, fetchGames]);

  useEffect(() => {
    const filtered = games.filter((game) => {
      const nameMatch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      const yearMatch = 
        yearFilter === "all" || 
        (yearFilter === "TBA" && game.releaseDate === "TBA") ||
        (game.releaseDate !== "TBA" && new Date(game.releaseDate).getFullYear().toString() === yearFilter);
      const genreMatch = genreFilter === "all" || game.genres.includes(genreFilter);
      return nameMatch && yearMatch && genreMatch;
    });
    
    const sortedFiltered = filtered.sort((a, b) => {
      if (a.releaseDate === "TBA" && b.releaseDate === "TBA") return 0;
      if (a.releaseDate === "TBA") return 1;
      if (b.releaseDate === "TBA") return -1;
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
    
    setFilteredGames(sortedFiltered);
  }, [games, searchTerm, yearFilter, genreFilter]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    setVisibleGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);

  const updateURL = useCallback(
    (page, search, year, genre) => {
      const params = new URLSearchParams(searchParams);
      if (page !== 1) params.set("page", page.toString());
      else params.delete("page");
      if (search) params.set("search", search);
      else params.delete("search");
      if (year !== "all") params.set("year", year);
      else params.delete("year");
      if (genre !== "all") params.set("genre", genre);
      else params.delete("genre");
      router.push(`/games${params.toString() ? "?" + params.toString() : ""}`);
    },
    [router, searchParams]
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    updateURL(value, searchTerm, yearFilter, genreFilter);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    updateURL(1, newSearchTerm, yearFilter, genreFilter);
  };

  const handleYearFilterChange = (event) => {
    setYearFilter(event.target.value);
    updateURL(1, searchTerm, event.target.value, genreFilter);
  };

  const handleGenreFilterChange = (event) => {
    setGenreFilter(event.target.value);
    updateURL(1, searchTerm, yearFilter, event.target.value);
  };

  // Obtener años únicos de los juegos
  const years = ["TBA", ...new Set(games.map(game => 
    game.releaseDate === "TBA" ? null : new Date(game.releaseDate).getFullYear()
  ).filter(year => year !== null))].sort((a, b) => b - a);

  // Obtener géneros únicos de los juegos
  const genres = [...new Set(games.flatMap(game => game.genres))].sort();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            All Games
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              variant="outlined"
              placeholder="Search games..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "secondary.main" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: "200px" } }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                onChange={handleYearFilterChange}
                label="Year"
              >
                <MenuItem value="all">All Years</MenuItem>
                <MenuItem value="TBA">TBA</MenuItem>
                {years.filter(year => year !== "TBA").map((year) => (
                  <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genreFilter}
                onChange={handleGenreFilterChange}
                label="Genre"
              >
                <MenuItem value="all">All Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
            <Grid container spacing={2}>
              {visibleGames.map((game) => (
                <Grid item key={game.slug} xs={12} sm={6} md={4}>
                  <GameCard game={game} />
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
        {!loading && !error && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={Math.ceil(filteredGames.length / GAMES_PER_PAGE)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default GamesList;
