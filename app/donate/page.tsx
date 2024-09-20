"use client";

import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Heart } from "lucide-react";
import Confetti from "react-confetti";
import Navbar from "../components/Navbar";

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

export default function DonatePage() {
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop confetti after 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Thank you for your donation!
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your support helps us maintain the servers and improve the API
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            href="https://www.paypal.com/paypalme/gameboxd"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 2 }}
            startIcon={<Heart />}
          >
            Donate with PayPal
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
