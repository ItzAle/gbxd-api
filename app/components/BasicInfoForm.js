import { TextField, Box } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BasicInfoForm = ({ name, setName, publisher, setPublisher, developer, setDeveloper, releaseDate, setReleaseDate, coverImageUrl, setCoverImageUrl, validateUrl }) => {
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
        onChange={(e) => setCoverImageUrl(e.target.value)}
        margin="normal"
        error={coverImageUrl !== "" && !validateUrl(coverImageUrl)}
        helperText={
          coverImageUrl !== "" && !validateUrl(coverImageUrl)
            ? "Invalid URL"
            : ""
        }
      />
      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Publisher"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Developer"
        value={developer}
        onChange={(e) => setDeveloper(e.target.value)}
        margin="normal"
        required
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Release date"
          value={releaseDate}
          onChange={(newValue) => setReleaseDate(newValue)}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" required />
          )}
          format="DD-MM-YYYY"
        />
      </LocalizationProvider>
    </>
  );
};

export default BasicInfoForm;