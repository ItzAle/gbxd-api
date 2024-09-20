"use client";

import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Thank you for your donation
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your support helps us maintain the servers and improve the API
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your donation. Your support helps us maintain the
            servers and improve the API.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="https://www.paypal.com/paypalme/gameboxd"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 2 }}
          >
            Donate with PayPal
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
