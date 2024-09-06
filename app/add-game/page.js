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
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Backdrop,
  Snackbar,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { genresList } from "../constants/genres";
import { platformsList } from "../constants/platforms";
import BasicInfoForm from "../components/BasicInfoForm";
import GenrePlatformSelector from "../components/GenrePlatformSelector";
import ReviewInfo from "../components/ReviewInfo";

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

const AddGame = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [publisher, setPublisher] = useState("");
  const [developer, setDeveloper] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    setIsSubmitting(true);

    const newErrors = [];
    if (!name) newErrors.push("Name is required");
    if (!publisher) newErrors.push("Publisher is required");
    if (!developer) newErrors.push("Developer is required");
    if (!releaseDate) newErrors.push("Release date is required");
    if (!description) newErrors.push("Description is required");
    if (platforms.length === 0)
      newErrors.push("At least one platform must be selected");
    if (genres.length === 0)
      newErrors.push("At least one genre must be selected");
    if (!coverImageUrl) newErrors.push("Cover image URL is required");
    if (coverImageUrl && !validateUrl(coverImageUrl))
      newErrors.push("Invalid cover image URL");

    setErrors(newErrors);

    if (newErrors.length > 0) {
      setIsSubmitting(false);
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarOpen(true);
      return;
    }

    // Verificar si el juego ya existe
    try {
      console.log("Checking game existence for:", name);
      const checkResponse = await fetch(
        `/api/check-game?name=${encodeURIComponent(name)}`
      );
      console.log("Check response status:", checkResponse.status);

      if (!checkResponse.ok) {
        throw new Error(
          `Failed to check game existence: ${checkResponse.status}`
        );
      }

      const checkResult = await checkResponse.json();
      console.log("Check result:", checkResult);

      if (checkResult.exists) {
        setIsSubmitting(false);
        setSnackbarMessage(
          "A game with this name already exists. Please use a different name."
        );
        setSnackbarOpen(true);
        return;
      }
    } catch (error) {
      console.error("Error checking game existence:", error);
      setIsSubmitting(false);
      setSnackbarMessage(`Error checking game existence: ${error.message}`);
      setSnackbarOpen(true);
      return;
    }

    const formData = {
      name,
      publisher,
      developer,
      releaseDate: releaseDate ? dayjs(releaseDate).format("YYYY-MM-DD") : null,
      description,
      platforms,
      genres,
      coverImageUrl,
      userId: user.uid,
    };

    try {
      const res = await fetch("/api/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSnackbarMessage("Game added successfully!");
        setSnackbarOpen(true);
        router.push("/games");
      } else {
        const result = await res.json();
        setSnackbarMessage(result.error || "Error adding game");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Error adding game");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGenres = genresList.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const filteredPlatforms = platformsList.filter((platform) =>
    platform.toLowerCase().includes(platformSearch.toLowerCase())
  );

  const steps = ["Basic Info", "Description", "Genres & Platforms", "Review"];

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSnackbarMessage(
        "Please fill in all required fields before proceeding."
      );
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return (
          coverImageUrl &&
          name &&
          publisher &&
          developer &&
          releaseDate &&
          validateUrl(coverImageUrl)
        );
      case 1:
        return description.trim() !== "";
      case 2:
        return genres.length > 0 && platforms.length > 0;
      default:
        return true;
    }
  };

  const handleEdit = (field) => {
    switch (field) {
      case "Basic Info":
        setActiveStep(0);
        break;
      case "Description":
        setActiveStep(1);
        break;
      case "Genres & Platforms":
        setActiveStep(2);
        break;
      default:
        break;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            name={name}
            setName={setName}
            publisher={publisher}
            setPublisher={setPublisher}
            developer={developer}
            setDeveloper={setDeveloper}
            releaseDate={releaseDate}
            setReleaseDate={setReleaseDate}
            coverImageUrl={coverImageUrl}
            setCoverImageUrl={setCoverImageUrl}
            validateUrl={validateUrl}
          />
        );
      case 1:
        return (
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
        );
      case 2:
        return (
          <GenrePlatformSelector
            genres={genres}
            platforms={platforms}
            setShowGenresModal={setShowGenresModal}
            setShowPlatformsModal={setShowPlatformsModal}
            handleGenreSelection={handleGenreSelection}
            handlePlatformSelection={handlePlatformSelection}
          />
        );
      case 3:
        return (
          <ReviewInfo
            name={name}
            publisher={publisher}
            developer={developer}
            releaseDate={releaseDate}
            description={description}
            platforms={platforms}
            genres={genres}
            coverImageUrl={coverImageUrl}
            validateUrl={validateUrl}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: "linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Add a New Game
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form>
            {getStepContent(activeStep)}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              {activeStep > 0 && activeStep < steps.length - 1 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
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
            Select genres
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Select platforms
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        open={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="confirmation-modal-title" variant="h6" component="h2">
            Game added successfully
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Your game has been added to the database. Redirecting to the games
            list...
          </Typography>
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

export default AddGame;
