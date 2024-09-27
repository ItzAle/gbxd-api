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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import JsonUploader from "@/app/components/JsonUploader/JsonUploader";

const BatchGamePreview = ({ game }) => (
  <Card sx={{ maxWidth: 345, m: 1 }}>
    <CardMedia
      component="img"
      height="140"
      image={
        game.coverImageUrl ||
        "https://via.placeholder.com/140x140?text=No+Image"
      }
      alt={game.name}
    />
    <CardContent>
      <Typography gutterBottom variant="h6" component="div">
        {game.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {game.description
          ? `${game.description.substring(0, 100)}...`
          : "No description available"}
      </Typography>
    </CardContent>
  </Card>
);

export default function AdminPage() {
  const [gameId, setGameId] = useState("");
  const [message, setMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, loading] = useAuthState(auth);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const router = useRouter();

  const [batchGamesJson, setBatchGamesJson] = useState("");
  const [batchResult, setBatchResult] = useState(null);
  const [previewGames, setPreviewGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/");
      } else {
        fetchGames();
        fetchGenresAndPlatforms();
      }
    }
  }, [user, loading, router]);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const fetchGenresAndPlatforms = async () => {
    try {
      const genresResponse = await fetch("/api/genres");
      const platformsResponse = await fetch("/api/platforms");
      
      if (genresResponse.ok && platformsResponse.ok) {
        const genresData = await genresResponse.json();
        const platformsData = await platformsResponse.json();
        setGenres(genresData);
        setPlatforms(platformsData);
      } else {
        console.error("Error fetching genres or platforms");
      }
    } catch (error) {
      console.error("Error fetching genres and platforms:", error);
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
        fetchGames();
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
      const totalPages = 5;
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
      fetchGames();
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBatchJsonChange = (e) => {
    const value = e.target.value;
    setBatchGamesJson(value);
    try {
      const parsedGames = JSON.parse(value || '[]');
      setPreviewGames(Array.isArray(parsedGames) ? parsedGames : [parsedGames]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setPreviewGames([]);
    }
  };

  const handlePreviewUpdate = (updatedGame) => {
    const updatedGames = previewGames.map(game => 
      game.name === updatedGame.name ? { ...game, ...updatedGame } : game
    );
    setPreviewGames(updatedGames);
    setBatchGamesJson(JSON.stringify(updatedGames, null, 2));
  };

  const handleUploadBatchGames = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/add-games-batch', {  // Cambiado aquí
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: batchGamesJson,  // Asumiendo que batchGamesJson ya es una cadena JSON válida
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir los juegos');
      }

      const result = await response.json();
      console.log('Juegos subidos exitosamente:', result);

      // Actualizar la lista de juegos después de la subida
      await fetchGames();

      setBatchGamesJson('');
      setPreviewGames([]);
    } catch (error) {
      console.error('Error al subir los juegos:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setUploading(false);
    }
  };

  const handlePinSubmit = async () => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/verify-admin-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin, idToken }),
      });

      const responseText = await response.text();
      console.log("Full response:", responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            setShowPinDialog(false);
            fetchGames();
          } else {
            alert(data.error || "An error occurred while verifying the PIN");
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          alert("Received invalid response from server");
        }
      } else {
        console.error("Error response:", response.status, responseText);
        alert(`Error: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error("Error verifying admin PIN:", error);
      alert("An error occurred. Please check the console and try again.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  if (showPinDialog) {
    return (
      <Dialog open={showPinDialog} onClose={() => {}}>
        <DialogTitle>Enter Admin PIN</DialogTitle>
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
          <Button onClick={handlePinSubmit}>Verify</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add Single Game</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Game
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Import Popular Games</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            onClick={handleImportPopular}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import Popular Games"}
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Add Games in Batch</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JsonUploader
            initialJson={batchGamesJson}
            onJsonChange={handleBatchJsonChange}
            onPreviewUpdate={handlePreviewUpdate}
            onUpload={handleUploadBatchGames}
            genres={genres}
            platforms={platforms}
          />
        </AccordionDetails>
      </Accordion>

      <Button
        onClick={() => router.push("/admin/manage-games")}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Manage Games
      </Button>

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

      {uploading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
