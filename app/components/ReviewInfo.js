import { Typography, Box } from "@mui/material";
import dayjs from "dayjs";

const ReviewInfo = ({ formData }) => {
  const {
    name,
    publisher,
    developer,
    releaseDate,
    description,
    platforms,
    genres,
    coverImageUrl,
    isNSFW,
    storeLinks,
    aliases,
    franchises,
  } = formData;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review your game information
      </Typography>
      {coverImageUrl && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <img
            src={coverImageUrl}
            alt="Game cover"
            style={{
              width: "200px",
              height: "240px",
              objectFit: "cover",
            }}
          />
        </Box>
      )}
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
        <strong>Release Date:</strong>{" "}
        {isTBA ? "TBA" : (releaseDate ? dayjs(releaseDate).format("MMMM D, YYYY") : "Not set")}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Description:</strong> {description}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Platforms:</strong> {platforms && platforms.length > 0 ? platforms.join(", ") : "None selected"}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Genres:</strong> {genres && genres.length > 0 ? genres.join(", ") : "None selected"}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>NSFW:</strong> {isNSFW ? "Yes" : "No"}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Store Links:</strong>
      </Typography>
      <ul>
        {Object.entries(storeLinks).map(([store, link]) => (
          link && <li key={store}><strong>{store}:</strong> {link}</li>
        ))}
      </ul>
      <Typography variant="body1" paragraph>
        <strong>Aliases:</strong> {aliases && aliases.length > 0 ? aliases.join(", ") : "None"}
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Franchises:</strong> {franchises && franchises.length > 0 ? franchises.join(", ") : "None"}
      </Typography>
    </Box>
  );
};

export default ReviewInfo;