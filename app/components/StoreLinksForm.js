import { TextField, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";

const StoreLinksForm = ({ isNSFW, setIsNSFW, storeLinks, setStoreLinks, platforms }) => {
  const handleStoreLinksChange = (store) => (event) => {
    setStoreLinks({ ...storeLinks, [store]: event.target.value });
  };

  const showPCStores = platforms.includes("PC");
  const showPlayStationStore = platforms.some(platform => platform.includes("PlayStation"));
  const showXboxStore = platforms.some(platform => platform.includes("Xbox"));
  const showNintendoStore = platforms.includes("Nintendo Switch");

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={isNSFW}
            onChange={(e) => setIsNSFW(e.target.checked)}
          />
        }
        label="NSFW Content"
      />
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Store Links
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {showPCStores && (
          <>
            <TextField
              label="Steam"
              value={storeLinks.steam}
              onChange={handleStoreLinksChange('steam')}
              fullWidth
            />
            <TextField
              label="Epic Games"
              value={storeLinks.epicGames}
              onChange={handleStoreLinksChange('epicGames')}
              fullWidth
            />
          </>
        )}
        {showPlayStationStore && (
          <TextField
            label="PlayStation Store"
            value={storeLinks.playStation}
            onChange={handleStoreLinksChange('playStation')}
            fullWidth
          />
        )}
        {showXboxStore && (
          <TextField
            label="Xbox Store"
            value={storeLinks.xbox}
            onChange={handleStoreLinksChange('xbox')}
            fullWidth
          />
        )}
        {showNintendoStore && (
          <TextField
            label="Nintendo Switch eShop"
            value={storeLinks.nintendoSwitch}
            onChange={handleStoreLinksChange('nintendoSwitch')}
            fullWidth
          />
        )}
      </Box>
    </>
  );
};

export default StoreLinksForm;
