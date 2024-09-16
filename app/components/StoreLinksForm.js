import { TextField, FormControlLabel, Checkbox, Box } from "@mui/material";

const StoreLinksForm = ({ formData, setFormData }) => {
  const { storeLinks, isNSFW, platforms } = formData;

  const handleStoreLinksChange = (store) => (event) => {
    setFormData({
      ...formData,
      storeLinks: { ...storeLinks, [store]: event.target.value },
    });
  };

  const showPCStores = platforms && platforms.includes("PC");
  const showPlayStationStore = platforms && platforms.some(platform => platform.includes("PlayStation"));
  const showXboxStore = platforms && platforms.some(platform => platform.includes("Xbox"));
  const showNintendoStore = platforms && platforms.includes("Nintendo Switch");

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={isNSFW}
            onChange={(e) => setFormData({ ...formData, isNSFW: e.target.checked })}
          />
        }
        label="Is this game NSFW?"
      />
      {showPCStores && (
        <Box>
          <TextField
            fullWidth
            label="Steam Store URL"
            value={storeLinks.steam}
            onChange={handleStoreLinksChange("steam")}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Epic Games Store URL"
            value={storeLinks.epicGames}
            onChange={handleStoreLinksChange("epicGames")}
            margin="normal"
          />
        </Box>
      )}
      {showPlayStationStore && (
        <TextField
          fullWidth
          label="PlayStation Store URL"
          value={storeLinks.playStation}
          onChange={handleStoreLinksChange("playStation")}
          margin="normal"
        />
      )}
      {showXboxStore && (
        <TextField
          fullWidth
          label="Xbox Store URL"
          value={storeLinks.xbox}
          onChange={handleStoreLinksChange("xbox")}
          margin="normal"
        />
      )}
      {showNintendoStore && (
        <TextField
          fullWidth
          label="Nintendo eShop URL"
          value={storeLinks.nintendoSwitch}
          onChange={handleStoreLinksChange("nintendoSwitch")}
          margin="normal"
        />
      )}
    </>
  );
};

export default StoreLinksForm;
