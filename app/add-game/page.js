"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  CircularProgress,
  Box,
  Backdrop,
  Snackbar,
  Alert,
  useMediaQuery,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import AddGameForm from "../components/AddGameForm/AddGameForm";
import AddGameFormV2 from "../components/AddGameFormV2/AddGameFormV2";
import GenrePlatformModals from "../components/GenrePlatformModals/GenrePlatformModals";
import { genresList } from "../constants/genres";
import { getAllPlatforms } from "../constants/platforms";
import Link from "next/link";
import RequestAccessForm from "../components/RequestAccessForm/RequestAccessForm";

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
    h2: {
      fontSize: {
        xs: "2rem",
        sm: "2.5rem",
        md: "3rem",
      },
    },
    h5: {
      fontSize: {
        xs: "1.2rem",
        sm: "1.5rem",
        md: "1.8rem",
      },
    },
  },
});

const AddGame = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    publisher: "",
    developer: "",
    releaseDate: null,
    description: "",
    platforms: [], // Asegúrate de que esto esté inicializado como un array vacío
    genres: [],
    coverImageUrl: "",
    isNSFW: false,
    storeLinks: {
      steam: "",
      gog: "",
      epicGames: "",
      playStation: "",
      xbox: "",
      nintendoSwitch: "",
    },
    aliases: [""],
    franchises: [""],
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");
  const platformsList = getAllPlatforms(); // Obtén la lista de plataformas

  const [formVersion, setFormVersion] = useState("v1");

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuthorization, setCheckingAuthorization] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);

  const [hasPendingSubmission, setHasPendingSubmission] = useState(false);

  const clearPendingSubmission = () => {
    localStorage.removeItem("gameSubmissionPending");
    setHasPendingSubmission(false);
  };

  useEffect(() => {
    if (isAuthorized) {
      clearPendingSubmission();
    }
  }, [isAuthorized]);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (user) {
        try {
          const response = await fetch(
            `/api/check-authorization?email=${encodeURIComponent(user.email)}`,
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error al verificar la autorización");
          }
          const data = await response.json();
          console.log("Respuesta de autorización:", data); // Añade este log
          setIsAuthorized(data.isAuthorized);

          // Verificar si el usuario tiene una solicitud pendiente
          const pendingSubmission = localStorage.getItem(
            "gameSubmissionPending"
          );
          if (pendingSubmission === "true") {
            setHasPendingSubmission(true);
          }
        } catch (error) {
          console.error("Error:", error);
          setIsAuthorized(false);
        } finally {
          setCheckingAuthorization(false);
        }
      } else {
        setCheckingAuthorization(false);
      }
    };

    if (!loading) {
      checkAuthorization();
    }
  }, [user, loading]);

  if (loading || checkingAuthorization) {
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
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, px: isMobile ? 2 : 3 }}>
          <Box
            sx={{
              mb: 3,
              backgroundColor: "error.main",
              color: "error.contrastText",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" align="center">
              Please login to access this page.
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isAuthorized) {
    return <RequestAccessForm />;
  }

  if (hasPendingSubmission) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, px: isMobile ? 2 : 3 }}>
          <Box
            sx={{
              mb: 3,
              backgroundColor: "info.main",
              color: "info.contrastText",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Your submission is pending review.
            </Typography>
            <Typography variant="body1" align="center">
              You have already submitted a request to add a game and it is
              pending review. Please wait for it to be processed before
              submitting another request.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => router.push("/")}
          >
            Back to the main page
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  const handleGenreSelection = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handlePlatformSelection = (platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
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
    if (!formData.name) newErrors.push("Name is required");
    if (!formData.publisher) newErrors.push("Publisher is required");
    if (!formData.developer) newErrors.push("Developer is required");
    if (!formData.releaseDate) newErrors.push("Release date is required");
    if (!formData.description) newErrors.push("Description is required");
    if (formData.platforms.length === 0)
      newErrors.push("At least one platform must be selected");
    if (formData.genres.length === 0)
      newErrors.push("At least one genre must be selected");
    if (!formData.coverImageUrl) newErrors.push("Cover image URL is required");
    if (formData.coverImageUrl && !validateUrl(formData.coverImageUrl))
      newErrors.push("Invalid cover image URL");

    setErrors(newErrors);

    if (newErrors.length > 0) {
      setIsSubmitting(false);
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const { userId, ...formDataToSend } = {
      ...formData,
      aliases: formData.aliases.filter((alias) => alias.trim() !== ""),
      franchises: formData.franchises.filter(
        (franchise) => franchise.trim() !== ""
      ),
    };
    if (user && user.uid) {
      formDataToSend.addedBy = user.uid;
    }

    try {
      const res = await fetch("/api/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (res.ok) {
        localStorage.setItem("gameSubmissionPending", "true");
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
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

  const filteredPlatforms = platformsList
    ? platformsList.filter((platform) =>
        platform.toLowerCase().includes(platformSearch.toLowerCase())
      )
    : [];

  const handleFormVersionChange = (event, newVersion) => {
    if (newVersion !== null) {
      setFormVersion(newVersion);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, px: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            mb: 3,
            backgroundColor: "error.main",
            color: "error.contrastText",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" align="center">
            Please note: Our API has limited resources, which may cause loading
            errors. If you find this project useful, you can donate to help us{" "}
            <Link
              className="underline hover:text-blue-500"
              href="/donate"
              target="_blank"
            >
              here
            </Link>
            .
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={formVersion}
            exclusive
            onChange={handleFormVersionChange}
            aria-label="form version"
          >
            <ToggleButton value="v1" aria-label="stepped form">
              Stepped Form
            </ToggleButton>
            <ToggleButton value="v2" aria-label="single page form">
              Single Page Form
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {formVersion === "v1" ? (
            <AddGameForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errors={errors}
              validateUrl={validateUrl}
              setShowGenresModal={setShowGenresModal}
              setShowPlatformsModal={setShowPlatformsModal}
              isMobile={isMobile}
            />
          ) : (
            <AddGameFormV2
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errors={errors}
              validateUrl={validateUrl}
              setShowGenresModal={setShowGenresModal}
              setShowPlatformsModal={setShowPlatformsModal}
              isMobile={isMobile}
            />
          )}
        </motion.div>
      </Container>

      <GenrePlatformModals
        showGenresModal={showGenresModal}
        setShowGenresModal={setShowGenresModal}
        showPlatformsModal={showPlatformsModal}
        setShowPlatformsModal={setShowPlatformsModal}
        genreSearch={genreSearch}
        setGenreSearch={setGenreSearch}
        platformSearch={platformSearch}
        setPlatformSearch={setPlatformSearch}
        filteredGenres={filteredGenres}
        filteredPlatforms={filteredPlatforms}
        handleGenreSelection={handleGenreSelection}
        handlePlatformSelection={handlePlatformSelection}
        genres={formData.genres}
        platforms={formData.platforms}
        isMobile={isMobile}
      />

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

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        message="Game added successfully! Redirecting..."
        onClose={() => setShowSuccess(false)}
      />
    </ThemeProvider>
  );
};

export default AddGame;
