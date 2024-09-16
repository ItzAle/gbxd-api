import { Button, Chip, Box } from "@mui/material";

const GenrePlatformSelector = ({ formData, setFormData, setShowGenresModal, setShowPlatformsModal }) => {
  const { genres = [], platforms = [] } = formData;

  const handleGenreSelection = (genre) => {
    setFormData(prevData => ({
      ...prevData,
      genres: prevData.genres.includes(genre)
        ? prevData.genres.filter(g => g !== genre)
        : [...prevData.genres, genre]
    }));
  };

  const handlePlatformSelection = (platform) => {
    setFormData(prevData => ({
      ...prevData,
      platforms: prevData.platforms.includes(platform)
        ? prevData.platforms.filter(p => p !== platform)
        : [...prevData.platforms, platform]
    }));
  };

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