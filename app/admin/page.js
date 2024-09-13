"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import JsonUploader from "../components/JsonUploader/JsonUploader";

export default function AddRawgGame() {
  const [gameId, setGameId] = useState("");
  const [message, setMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, loading] = useAuthState(auth);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const router = useRouter();

  if (!user) {
    router.push("/");
  }

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setShowPinDialog(true);
      }
    }
  }, [user, loading, router]);

  const handlePinSubmit = () => {
    if (pin === process.env.NEXT_PUBLIC_ADMIN_PIN) {
      setShowPinDialog(false);
    } else {
      alert("PIN incorrecto");
      router.push("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/scrape-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setGameId("");
      } else {
        setMessage(data.error || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred while adding the game");
    }
  };

  const handleImportPopular = async () => {
    setIsImporting(true);
    setMessage("");
    setProgress(0);

    try {
      const totalPages = 5; // Importar 500 juegos (5 páginas de 100 juegos cada una)
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch("/api/import-popular-games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page, pageSize: 100 }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage((prev) => prev + data.message + "\n");
        } else {
          throw new Error(
            data.error || "An error occurred while importing popular games"
          );
        }

        setProgress(Math.round((page / totalPages) * 100));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdateGames = async () => {
    setIsImporting(true);
    setMessage("");

    try {
      const response = await fetch("/api/update-games", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        throw new Error(data.error || "An error occurred while updating games");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportTopRated = async () => {
    setIsImporting(true);
    setMessage("");
    setProgress(0);

    try {
      const totalPages = 25; // Importar 1000 juegos (25 páginas de 40 juegos cada una)
      for (let page = 1; page <= totalPages; page++) {
        const response = await fetch("/api/import-popular-games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page, pageSize: 40 }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage((prev) => prev + data.message + "\n");
        } else {
          throw new Error(
            data.error || "An error occurred while importing top rated games"
          );
        }

        setProgress(Math.round((page / totalPages) * 100));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (
    !user ||
    (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL && !showPinDialog)
  ) {
    return null;
  }

  if (showPinDialog) {
    return (
      <Dialog open={showPinDialog} onClose={() => {}}>
        <DialogTitle>Ingrese el PIN de administrador</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="PIN"
            type="password"
            fullWidth
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePinSubmit}>Verificar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Game from RAWG
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="RAWG Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Game
        </Button>
      </form>
      <Button
        onClick={handleImportPopular}
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isImporting}
      >
        {isImporting ? "Importing..." : "Import Popular Games"}
      </Button>
      <Button
        onClick={handleUpdateGames}
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isImporting}
      >
        Update Existing Games
      </Button>
      <Button
        onClick={handleImportTopRated}
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isImporting}
      >
        {isImporting ? "Importing..." : "Import Top Rated Games"}
      </Button>

      <JsonUploader />

      {isImporting && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <CircularProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      )}
      {message && (
        <Typography
          component="pre"
          sx={{ mt: 2, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
