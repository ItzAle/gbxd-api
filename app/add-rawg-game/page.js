'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function AddRawgGame() {
  const [gameId, setGameId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/scrape-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setGameId('');
      } else {
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      setMessage('An error occurred while adding the game');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Add Game
        </Button>
      </form>
      {message && (
        <Typography color={message.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}