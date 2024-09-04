"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Modal,
  Checkbox,
  FormControlLabel,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../components/Navbar";

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

const genresList = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Shooter",
  "Puzzle",
  "Horror",
  "Simulation",
  "Sports",
  "Racing",
  "Fighting",
  "Platformer",
  "Stealth",
  "Survival",
  "Battle Royale",
  "MOBA",
  "Card Game",
  "Educational",
  "Music/Rhythm",
  "Visual Novel",
];

const platformsList = [
  "PC",
  "PlayStation 4",
  "PlayStation 5",
  "Xbox One",
  "Xbox Series X/S",
  "Nintendo Switch",
  "Mobile",
  "PlayStation 3",
  "Xbox 360",
  "Wii U",
  "Nintendo 3DS",
  "PlayStation Vita",
  "Google Stadia",
  "Amazon Luna",
  "Oculus Quest",
  "HTC Vive",
  "Nintendo Wii",
  "Sega Dreamcast",
  "PlayStation 2",
  "Xbox",
];

const AddGame = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [developer, setDeveloper] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return null;
  }

  const handleGenreSelection = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handlePlatformSelection = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const validateUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!name) errors.push("Name is required");
    if (!releaseDate) errors.push("Release date is required");
    if (!description) errors.push("Description is required");
    if (!publisher) errors.push("Publisher is required");
    if (!developer) errors.push("Developer is required");
    if (platforms.length === 0)
      errors.push("At least one platform must be selected");
    if (genres.length === 0) errors.push("At least one genre must be selected");
    if (!coverImageUrl) errors.push("Cover image URL is required");
    if (!validateUrl(coverImageUrl)) errors.push("Invalid cover image URL");

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    const formData = {
      name,
      releaseDate,
      description,
      publisher,
      developer,
      platforms,
      genres,
      coverImageUrl,
    };

    try {
      const res = await fetch("/api/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Game added successfully");
        setName("");
        setReleaseDate("");
        setDescription("");
        setPublisher("");
        setDeveloper("");
        setPlatforms([]);
        setGenres([]);
        setCoverImageUrl("");

        // Llama al webhook de revalidación
        await fetch(
          "https://api.vercel.com/v1/integrations/deploy/prj_noYvbsAttYaQLspGe08gl1ARMOg6/Pj6Amxt0Gm",
          {
            method: "POST",
          }
        );
      } else {
        alert(result.error || "Error adding game");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding game");
    }
  };

  const filteredGenres = genresList.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const filteredPlatforms = platformsList.filter((platform) =>
    platform.toLowerCase().includes(platformSearch.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Add a New Game
          </Typography>

          {/* Image and form elements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              maxWidth: 300,
              height: 400,
              perspective: 1000,
            }}
          >
            <motion.div
              whileHover={{ rotateY: 10, scale: 1.05 }}
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
            >
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Game Cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6">No Cover Image</Typography>
                </Box>
              )}
            </motion.div>
          </motion.div>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 4, width: "100%" }}
          >
            <TextField
              fullWidth
              label="Cover Image URL"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              margin="normal"
              error={coverImageUrl !== "" && !validateUrl(coverImageUrl)}
              helperText={
                coverImageUrl !== "" && !validateUrl(coverImageUrl)
                  ? "Invalid URL"
                  : ""
              }
            />
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Release Date"
                value={releaseDate}
                onChange={(newValue) => setReleaseDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowGenresModal(true)}
              >
                Add Genres
              </Button>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    onDelete={() => handleGenreSelection(genre)}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowPlatformsModal(true)}
              >
                Add Platforms
              </Button>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {platforms.map((platform) => (
                  <Chip
                    key={platform}
                    label={platform}
                    onDelete={() => handlePlatformSelection(platform)}
                  />
                ))}
              </Box>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Add Game
            </Button>
          </Box>
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
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Select Genres
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
          <List>
            {filteredGenres.map((genre) => (
              <ListItem key={genre} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.includes(genre)}
                      onChange={() => handleGenreSelection(genre)}
                    />
                  }
                  label={genre}
                />
              </ListItem>
            ))}
          </List>
          <Button onClick={() => setShowGenresModal(false)} sx={{ mt: 2 }}>
            Done
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
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Select Platforms
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
          <List>
            {filteredPlatforms.map((platform) => (
              <ListItem key={platform} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={platforms.includes(platform)}
                      onChange={() => handlePlatformSelection(platform)}
                    />
                  }
                  label={platform}
                />
              </ListItem>
            ))}
          </List>
          <Button onClick={() => setShowPlatformsModal(false)} sx={{ mt: 2 }}>
            Done
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default AddGame;
