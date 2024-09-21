import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditGameForm from '@/app/components/EditGameForm/EditGameForm';

const JsonUploader = () => {
  const [file, setFile] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const [previewGames, setPreviewGames] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleJsonTextChange = (event) => {
    setJsonText(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePreview = async () => {
    let jsonData;
    try {
      if (tabValue === 0 && file) {
        const text = await file.text();
        jsonData = JSON.parse(text);
      } else if (tabValue === 1 && jsonText.trim()) {
        jsonData = JSON.parse(jsonText);
      } else {
        throw new Error('Por favor, selecciona un archivo o ingresa el JSON');
      }

      if (!Array.isArray(jsonData)) {
        throw new Error('El JSON debe ser un array de juegos');
      }

      setPreviewGames(jsonData);
      setIsPreviewOpen(true);
      setMessage('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setPreviewGames([]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setMessage('');
    setErrorDetails([]);

    try {
      const response = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewGames),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        if (result.errorDetails && result.errorDetails.length > 0) {
          setErrorDetails(result.errorDetails);
        }
      } else {
        throw new Error(result.error || 'Error al procesar el JSON');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
      setIsPreviewOpen(false);
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
  };

  const handleSaveEdit = (updatedGame) => {
    const updatedPreviewGames = previewGames.map(game => 
      game.name === updatedGame.name ? updatedGame : game
    );
    setPreviewGames(updatedPreviewGames);
    setEditingGame(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Subir JSON de juegos
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Subir archivo" />
        <Tab label="Pegar JSON" />
      </Tabs>
      {tabValue === 0 && (
        <>
          <input
            accept=".json"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Seleccionar archivo JSON
            </Button>
          </label>
          {file && <Typography sx={{ mt: 2 }}>{file.name}</Typography>}
        </>
      )}
      {tabValue === 1 && (
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={jsonText}
          onChange={handleJsonTextChange}
          placeholder='[{"name": "Juego 1", "description": "Descripción 1"}, {"name": "Juego 2", "description": "Descripción 2"}]'
          sx={{ mb: 2 }}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePreview}
        disabled={uploading}
        sx={{ mt: 2 }}
      >
        Previsualizar JSON
      </Button>
      {message && (
        <Typography sx={{ mt: 2 }} color={message.startsWith('Error') ? 'error' : 'success'}>
          {message}
        </Typography>
      )}
      {errorDetails.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Errores detallados:</Typography>
          <ul>
            {errorDetails.map((error, index) => (
              <li key={index}>{error.name}: {error.error}</li>
            ))}
          </ul>
        </Box>
      )}

      <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Previsualización de Juegos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {Array.isArray(previewGames) && previewGames.map((game, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{game.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditGame(game)}>
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPreviewOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Procesar JSON'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editingGame !== null} onClose={() => setEditingGame(null)}>
        <DialogTitle>Editar Juego</DialogTitle>
        <DialogContent>
          {editingGame && (
            <EditGameForm game={editingGame} onSave={handleSaveEdit} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingGame(null)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JsonUploader;
