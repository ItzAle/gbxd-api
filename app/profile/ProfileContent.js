'use client';

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Typography, Grid, Card, CardContent, CardActions, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, Chip, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import Navbar from "../components/Navbar";
import slugify from "slugify";
import { genresList } from "../constants/genres";
import { platformsList } from "../constants/platforms";

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

export default function ProfileContent() {
  const [user] = useAuthState(auth);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [open, setOpen] = useState(false);

  // ... resto del código del componente Profile original ...

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* ... contenido del componente ... */}
      </Container>
      {/* ... diálogos y otros componentes ... */}
    </ThemeProvider>
  );
}