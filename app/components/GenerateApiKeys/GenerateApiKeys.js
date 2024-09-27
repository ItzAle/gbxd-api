"use client";

import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";

const GenerateApiKeys = ({ userId, onKeyGenerated }) => {
  const [error, setError] = useState('');

  const handleGenerateKey = async () => {
    setError('');

    try {
      const response = await fetch('/api/generate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate API key');
      }

      const data = await response.json();
      console.log("API key generated:", data.apiKey);
      onKeyGenerated(data.apiKey);
    } catch (error) {
      console.error('Error generating API key:', error);
      setError('Error generating API key. Please try again.');
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleGenerateKey}>
        Generar API Key
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default GenerateApiKeys;
