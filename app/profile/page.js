"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import GenerateApiKeys from "../components/GenerateApiKeys/GenerateApiKeys";
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  Paper,
  Avatar,
  Divider,
  TextField,
  Tooltip,
  IconButton,
  Snackbar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Navbar from "../components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [apiKey, setApiKey] = useState(null);
  const [currentMonthUsage, setCurrentMonthUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  useEffect(() => {
    if (user) {
      console.log("User detected, fetching API key");
      fetchApiKeyData();
    } else {
      console.log("No user detected");
      setApiKey(null);
      setCurrentMonthUsage(null);
    }
  }, [user]);

  const fetchApiKeyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching API key for user:", user.uid);
      const response = await fetch(`/api/get-api-key?userId=${user.uid}`);
      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (response.ok) {
        if (data.apiKey) {
          console.log("Setting API key:", data.apiKey);
          setApiKey(data.apiKey);
          setCurrentMonthUsage(data.currentMonthUsage);
        } else {
          console.log("No API key found for user");
          setApiKey(null);
          setCurrentMonthUsage(null);
        }
      } else {
        throw new Error(
          data.error || "Error desconocido al obtener la API key"
        );
      }
    } catch (err) {
      console.error("Error fetching API key:", err);
      setError(`Error al obtener los datos de la API key: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyGenerated = async (newApiKey) => {
    setApiKey(newApiKey);
    setCurrentMonthUsage(0); // Asumiendo que una nueva key tiene 0 solicitudes
    setSnackbarMessage("API Key generada con éxito");
    setSnackbarOpen(true);
    await fetchApiKeyData(); // Refrescar los datos después de generar la key
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setSnackbarMessage("API Key copiada al portapapeles");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading || isLoading) {
    return (
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
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
          <Typography variant="h5">
            Please login to access this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <PersonIcon fontSize="large" />
                )}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Your Profile
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Your API Key
            </Typography>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            {apiKey ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={apiKey}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Tooltip title="Copiar API Key">
                        <IconButton onClick={handleCopyApiKey}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Current month usage: {currentMonthUsage || 0} / 1000
                </Typography>
              </Box>
            ) : (
              <GenerateApiKeys
                userId={user.uid}
                onKeyGenerated={handleKeyGenerated}
              />
            )}
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
          />
        </Container>
      </ThemeProvider>
    </>
  );
}
