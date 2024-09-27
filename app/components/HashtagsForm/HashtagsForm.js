import React, { useState } from "react";
import { TextField, Chip, Box, Button } from "@mui/material";

const HashtagsForm = ({ hashtags = [], setHashtags }) => {
  const [newHashtag, setNewHashtag] = useState("");

  const handleAddHashtag = () => {
    if (newHashtag && !hashtags.includes(newHashtag)) {
      setHashtags([...hashtags, newHashtag]);
      setNewHashtag("");
    }
  };

  const handleDeleteHashtag = (hashtagToDelete) => {
    setHashtags(hashtags.filter((hashtag) => hashtag !== hashtagToDelete));
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Añadir hashtag"
        value={newHashtag}
        onChange={(e) => setNewHashtag(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddHashtag();
          }
        }}
      />
      <Button onClick={handleAddHashtag}>Añadir Hashtag</Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {hashtags.map((hashtag) => (
          <Chip
            key={hashtag}
            label={hashtag}
            onDelete={() => handleDeleteHashtag(hashtag)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HashtagsForm;
