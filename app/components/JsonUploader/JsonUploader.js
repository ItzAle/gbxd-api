import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import BatchGamePreview from '../BatchGamePreview/BatchGamePreview';

const JsonUploader = ({ initialJson, onJsonChange, onPreviewUpdate, onUpload, genres, platforms }) => {
  const [parsedGames, setParsedGames] = useState([]);
  const [parseError, setParseError] = useState(null);

  useEffect(() => {
    try {
      const games = JSON.parse(initialJson || '[]');
      setParsedGames(Array.isArray(games) ? games : [games]);
      setParseError(null);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setParsedGames([]);
      setParseError("Error al analizar el JSON. Por favor, verifica el formato.");
    }
  }, [initialJson]);

  const handleJsonChange = (e) => {
    onJsonChange(e);
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={10}
        value={initialJson}
        onChange={handleJsonChange}
        placeholder="Pega tu JSON aquí"
        error={!!parseError}
        helperText={parseError}
      />
      <Button 
        onClick={onUpload} 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        disabled={parsedGames.length === 0}
      >
        Subir Juegos
      </Button>
      {parseError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {parseError}
        </Typography>
      )}
      {parsedGames.map((game, index) => (
        <BatchGamePreview
          key={index}
          game={game}
          onUpdate={(updatedGame) => onPreviewUpdate(updatedGame)}
          genres={genres}
          platforms={platforms}
        />
      ))}
    </Box>
  );
};

export default JsonUploader;
