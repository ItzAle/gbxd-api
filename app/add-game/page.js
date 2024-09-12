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
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import { genresList } from "../constants/genres";
import { platformsList } from "../constants/platforms";
import BasicInfoForm from "../components/BasicInfoForm";
import GenrePlatformSelector from "../components/GenrePlatformSelector";
import ReviewInfo from "../components/ReviewInfo";
import StoreLinksForm from "../components/StoreLinksForm";
import AliasesFranchisesForm from "../components/AliasesFranchisesForm/AliasesFranchisesForm";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [isNSFW, setIsNSFW] = useState(false);
  const [storeLinks, setStoreLinks] = useState({
    steam: "",
    epicGames: "",
    playStation: "",
    xbox: "",
    nintendoSwitch: "",
  });
  const [aliases, setAliases] = useState([""]);
  const [franchises, setFranchises] = useState([""]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
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
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
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
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const checkResponse = await fetch(
        `/api/check-game?name=${encodeURIComponent(name)}`
      );

      if (!checkResponse.ok) {
        throw new Error(
          `Failed to check game existence: ${checkResponse.status}`
        );
      }

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        setIsSubmitting(false);
        setSnackbarMessage(
          "A game with this name already exists. Please use a different name."
        );
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }
    } catch (error) {
      console.error("Error checking game existence:", error);
      setIsSubmitting(false);
      setSnackbarMessage(`Error checking game existence: ${error.message}`);
      setSnackbarSeverity("error");
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
      isNSFW,
      storeLinks,
      aliases: aliases.filter((alias) => alias.trim() !== ""),
      franchises: franchises.filter((franchise) => franchise.trim() !== ""),
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
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        router.push("/games");
      } else {
        const result = await res.json();
        setSnackbarMessage(result.error || "Error adding game");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Error adding game");
      setSnackbarSeverity("error");
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

  const steps = [
    "Basic Info",
    "Description",
    "Genres & Platforms",
    "Store Links",
    "Review",
  ];

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSnackbarMessage(
        "Please fill in all required fields before proceeding."
      );
      setSnackbarSeverity("warning");
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
      case 3:
        return true;
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
      case "Store Links":
        setActiveStep(3);
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
          <>
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
            <AliasesFranchisesForm
              aliases={aliases}
              setAliases={setAliases}
              franchises={franchises}
              setFranchises={setFranchises}
            />
          </>
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
          <StoreLinksForm
            isNSFW={isNSFW}
            setIsNSFW={setIsNSFW}
            storeLinks={storeLinks}
            setStoreLinks={setStoreLinks}
            platforms={platforms}
          />
        );
      case 4:
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
            isNSFW={isNSFW}
            storeLinks={storeLinks}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              background: "linear-gradient(145deg, #202020 0%, #2a2a2a 100%)",
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Add a New Game
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {getStepContent(activeStep)}
                </motion.div>
              </AnimatePresence>

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
        </motion.div>
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
            borderRadius: "12px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ color: "primary.main" }}
          >
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
                      color="primary"
                    />
                  }
                  label={genre}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setShowGenresModal(false)}
            sx={{ mt: 2 }}
            color="primary"
            variant="contained"
          >
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
            borderRadius: "12px",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ color: "primary.main" }}
          >
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
                      color="primary"
                    />
                  }
                  label={platform}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setShowPlatformsModal(false)}
            sx={{ mt: 2 }}
            color="primary"
            variant="contained"
          >
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AddGame;
