import { Button, Chip, Box } from "@mui/material";

const GenrePlatformSelector = ({ genres, platforms, setShowGenresModal, setShowPlatformsModal, handleGenreSelection, handlePlatformSelection }) => {
  return (
    <>
      <Button variant="contained" onClick={() => setShowGenresModal(true)}>
        Add genres
      </Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {genres.map((genre) => (
          <Chip
            key={genre}
            label={genre}
            onDelete={() => handleGenreSelection(genre)}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        onClick={() => setShowPlatformsModal(true)}
        sx={{ mt: 2 }}
      >
        Add platforms
      </Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {platforms.map((platform) => (
          <Chip
            key={platform}
            label={platform}
            onDelete={() => handlePlatformSelection(platform)}
          />
        ))}
      </Box>
    </>
  );
};

export default GenrePlatformSelector;