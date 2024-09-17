import { TextField, Box, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BasicInfoForm = ({ formData, setFormData, validateUrl }) => {
  const {
    name,
    publisher,
    developer,
    releaseDate,
    coverImageUrl,
    isTBA,
  } = formData;

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleTBAChange = (event) => {
    setFormData({ 
      ...formData, 
      isTBA: event.target.checked,
      releaseDate: event.target.checked ? null : formData.releaseDate
    });
  };

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        {coverImageUrl && validateUrl(coverImageUrl) ? (
          <img
            src={coverImageUrl}
            alt="Game cover"
            style={{
              width: "350px",
              height: "420px",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "350px",
              height: "420px",
              backgroundColor: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1.5rem",
            }}
          >
            No image available
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        label="Cover image URL"
        value={coverImageUrl}
        onChange={handleChange('coverImageUrl')}
        margin="normal"
        error={coverImageUrl !== "" && !validateUrl(coverImageUrl)}
        helperText={
          coverImageUrl !== "" && !validateUrl(coverImageUrl)
            ? "Please enter a valid URL"
            : ""
        }
        required
      />
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={handleChange('name')}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Publisher"
        value={publisher}
        onChange={handleChange('publisher')}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Developer"
        value={developer}
        onChange={handleChange('developer')}
        margin="normal"
        required
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Release Date"
            value={releaseDate}
            onChange={(newValue) => setFormData({ ...formData, releaseDate: newValue })}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required={!isTBA} />}
            disabled={isTBA}
          />
        </LocalizationProvider>
        <FormControlLabel
          control={
            <Checkbox
              checked={isTBA}
              onChange={handleTBAChange}
            />
          }
          label="TBA"
          sx={{ ml: 2 }}
        />
      </Box>
    </>
  );
};

export default BasicInfoForm;