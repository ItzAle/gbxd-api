import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const GenrePlatformModals = ({
  showGenresModal,
  setShowGenresModal,
  showPlatformsModal,
  setShowPlatformsModal,
  genreSearch,
  setGenreSearch,
  platformSearch,
  setPlatformSearch,
  filteredGenres,
  filteredPlatforms,
  handleGenreSelection,
  handlePlatformSelection,
  genres,
  platforms,
}) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
  };

  return (
    <>
      <Modal
        open={showGenresModal}
        onClose={() => setShowGenresModal(false)}
        aria-labelledby="genres-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="genres-modal-title" variant="h6" component="h2" gutterBottom sx={{ color: "primary.main" }}>
            Select genres
          </Typography>
          <TextField
            fullWidth
            placeholder="Search genres"
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {filteredGenres.map((genre) => (
              <ListItem key={genre} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={genres.includes(genre)}
                      onChange={() => handleGenreSelection(genre)}
                      color="primary"
                    />
                  }
                  label={genre}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setShowGenresModal(false)}
            sx={{ mt: 2 }}
            color="primary"
            variant="contained"
          >
            Done
          </Button>
        </Box>
      </Modal>

      <Modal
        open={showPlatformsModal}
        onClose={() => setShowPlatformsModal(false)}
        aria-labelledby="platforms-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="platforms-modal-title" variant="h6" component="h2" gutterBottom sx={{ color: "primary.main" }}>
            Select platforms
          </Typography>
          <TextField
            fullWidth
            placeholder="Search platforms"
            value={platformSearch}
            onChange={(e) => setPlatformSearch(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {filteredPlatforms.map((platform) => (
              <ListItem key={platform} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={platforms.includes(platform)}
                      onChange={() => handlePlatformSelection(platform)}
                      color="primary"
                    />
                  }
                  label={platform}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setShowPlatformsModal(false)}
            sx={{ mt: 2 }}
            color="primary"
            variant="contained"
          >
            Done
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default GenrePlatformModals;