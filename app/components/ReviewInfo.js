import { Typography, Box, Button } from "@mui/material";
import dayjs from "dayjs";

const ReviewInfo = ({ name, publisher, developer, releaseDate, description, platforms, genres, coverImageUrl, validateUrl, handleBack, handleSubmit, isSubmitting, errors }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Review your information
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Name:</strong> {name}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Publisher:</strong> {publisher}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Developer:</strong> {developer}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Release date:</strong>{" "}
        {releaseDate ? dayjs(releaseDate).format("DD-MM-YYYY") : "N/A"}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {description}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Platforms:</strong> {platforms.join(", ")}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Genres:</strong> {genres.join(", ")}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Cover image URL:</strong> {coverImageUrl}
      </Typography>
      <Box sx={{ mt: 2 }}>
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
      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleBack}>Back to edit</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
      {errors.length > 0 && (
        <Box sx={{ mt: 2, color: "error.main" }}>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Box>
      )}
    </>
  );
};

export default ReviewInfo;