import React, { useState } from "react";
import { Button, Chip, Box } from "@mui/material";
import GenrePlatformModals from "./GenrePlatformModals/GenrePlatformModals";
import { getAllPlatforms } from "../constants/platforms";
import { genresList } from "../constants/genres";

const GenrePlatformSelector = ({ formData, setFormData }) => {
  const { genres = [], platforms = [] } = formData;
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [showPlatformsModal, setShowPlatformsModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [platformSearch, setPlatformSearch] = useState("");

  const allPlatforms = getAllPlatforms();

  const handleGenreSelection = (genre) => {
    setFormData((prevData) => ({
      ...prevData,
      genres: prevData.genres.includes(genre)
        ? prevData.genres.filter((g) => g !== genre)
        : [...prevData.genres, genre],
    }));
  };

  const handlePlatformSelection = (platform) => {
    setFormData((prevData) => ({
      ...prevData,
      platforms: prevData.platforms.includes(platform)
        ? prevData.platforms.filter((p) => p !== platform)
        : [...prevData.platforms, platform],
    }));
  };

  const filteredGenres = genresList.filter((genre) =>
    genre.toLowerCase().includes(genreSearch.toLowerCase())
  );

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
      <GenrePlatformModals
        showGenresModal={showGenresModal}
        setShowGenresModal={setShowGenresModal}
        showPlatformsModal={showPlatformsModal}
        setShowPlatformsModal={setShowPlatformsModal}
        genreSearch={genreSearch}
        setGenreSearch={setGenreSearch}
        platformSearch={platformSearch}
        setPlatformSearch={setPlatformSearch}
        filteredGenres={filteredGenres}
        handleGenreSelection={handleGenreSelection}
        handlePlatformSelection={handlePlatformSelection}
        genres={genres}
        platforms={platforms}
        isMobile={false}
      />
    </>
  );
};

export default GenrePlatformSelector;
