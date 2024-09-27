import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Añade esta importación
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../lib/firebase";

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

const RequestAccessForm = () => {
  const [user] = useAuthState(auth);
  const router = useRouter(); // Añade esta línea
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    reason: "",
    birthDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: user.email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: data.message || "Request submitted successfully",
          severity: "success",
        });
        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push('/');
        }, 2000); // Espera 2 segundos antes de redirigir
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Error submitting request",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Error submitting request",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          p: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Request Access to Add Games
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ maxWidth: 600, mb: 4 }}
        >
          For security reasons, adding games to our database requires special
          access. Please fill out this form to request permission. We&apos;ll
          review your application and get back to you as soon as possible.
        </Typography>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Why do you want to add games?"
              name="reason"
              multiline
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Submit Request
            </Button>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default RequestAccessForm;
