import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import { platformsByBrand } from "../../constants/platforms";

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
  handleGenreSelection,
  handlePlatformSelection,
  genres,
  platforms,
  isMobile,
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

  const filteredPlatformsByBrand = Object.entries(platformsByBrand).reduce((acc, [brand, brandPlatforms]) => {
    const filteredBrandPlatforms = brandPlatforms.filter(platform =>
      platform.toLowerCase().includes(platformSearch.toLowerCase())
    );
    if (filteredBrandPlatforms.length > 0) {
      acc[brand] = filteredBrandPlatforms;
    }
    return acc;
  }, {});

  return (
    <>
      <Dialog
        open={showGenresModal}
        onClose={() => setShowGenresModal(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>Select Genres</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Genres"
            type="text"
            fullWidth
            value={genreSearch}
            onChange={(e) => setGenreSearch(e.target.value)}
          />
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredGenres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => handleGenreSelection(genre)}
                color={genres.includes(genre) ? "primary" : "default"}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenresModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={showPlatformsModal}
        onClose={() => setShowPlatformsModal(false)}
        aria-labelledby="platforms-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="platforms-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ color: "primary.main" }}
          >
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
          <Box sx={{ flexGrow: 1, overflow: "auto", mt: 2 }}>
            {Object.entries(filteredPlatformsByBrand).map(([brand, brandPlatforms]) => (
              <Accordion key={brand}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{brand}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {brandPlatforms.map((platform) => (
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
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
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
