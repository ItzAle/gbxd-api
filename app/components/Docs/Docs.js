"use client";

import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8f44fd",
    },
    secondary: {
      main: "#ff5555",
    },
    background: {
      default: "#151515",
      paper: "#202020",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const endpoints = [
  {
    name: "Add Game",
    method: "POST",
    url: "/api/add-game",
    description: "Adds a new game to the database. Requires authentication.",
    authentication: "Bearer token required in the Authorization header.",
    requestBody: `{
  "name": "Game Name",
  "releaseDate": "YYYY-MM-DD",
  "description": "Detailed game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`,
    response: `{
  "id": "unique-document-id",
  "name": "Game Name",
  "releaseDate": "YYYY-MM-DD",
  "description": "Detailed game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"],
  "createdAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "updatedAt": "YYYY-MM-DDTHH:mm:ss.sssZ"
}`,
    errorResponses: [
      { code: 400, description: "Invalid request body" },
      { code: 401, description: "Unauthorized - Invalid or missing token" },
      { code: 409, description: "Game already exists" },
    ],
  },
  {
    name: "Get All Games",
    method: "GET",
    url: "/api/games",
    description:
      "Retrieves all games from the database with optional pagination.",
    queryParams: [
      { name: "page", description: "Page number (default: 1)" },
      {
        name: "limit",
        description: "Number of games per page (default: 20, max: 100)",
      },
      { name: "sort", description: "Sort field (e.g., 'releaseDate', 'name')" },
      {
        name: "order",
        description: "Sort order ('asc' or 'desc', default: 'desc')",
      },
    ],
    response: `{
  "games": [
    {
      "id": "unique-document-id",
      "name": "Game Name",
      "releaseDate": "YYYY-MM-DD",
      "description": "Game description.",
      "platforms": ["Platform1", "Platform2"],
      "coverImage": "https://example.com/image.jpg",
      "publisher": "Publisher Name",
      "developer": "Developer Name",
      "genres": ["Genre1", "Genre2"]
    },
    // ... more games ...
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalGames": 198,
    "gamesPerPage": 20
  }
}`,
    errorResponses: [{ code: 400, description: "Invalid query parameters" }],
  },
  {
    name: "Get Game Details",
    method: "GET",
    url: "/api/game/<game-id>",
    description: "Retrieves details of a specific game.",
    response: `{
  "id": "unique-document-id",
  "name": "Game Name",
  "releaseDate": "YYYY-MM-DD",
  "description": "Detailed game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`,
    errorResponses: [{ code: 404, description: "Game not found" }],
  },
  {
    name: "Get Games by Year",
    method: "GET",
    url: "/api/games/year/<year>",
    description: "Retrieves games released in a specific year.",
    response: `{
  "games": [
    {
      "id": "unique-document-id",
      "name": "Game Name",
      "slug": "game-name",
      "releaseDate": "YYYY-MM-DD",
      "description": "Brief game description.",
      "platforms": ["Platform1", "Platform2"],
      "coverImageUrl": "https://example.com/image.jpg",
      "publisher": "Publisher Name",
      "developer": "Developer Name",
      "genres": ["Genre1", "Genre2"]
    },
    // ... more games ...
  ],
  "totalGames": 25,
  "year": 2023
}`,
    errorResponses: [
      { code: 400, description: "Invalid year format" },
      { code: 404, description: "No games found for this year" },
    ],
  },
  {
    name: "Get Games by Platform",
    method: "GET",
    url: "/api/games/platform/<platform-name>",
    description: "Retrieves games available on a specific platform.",
    note: 'Platform name can be full names (e.g., "PlayStation 5") or abbreviations (e.g., "PS5").',
    response: `{
  "games": [
    {
      "id": "unique-document-id",
      "name": "Game Name",
      "slug": "game-name",
      "releaseDate": "YYYY-MM-DD",
      "description": "Brief game description.",
      "platforms": ["Platform1", "Platform2"],
      "coverImageUrl": "https://example.com/image.jpg",
      "publisher": "Publisher Name",
      "developer": "Developer Name",
      "genres": ["Genre1", "Genre2"]
    },
    // ... more games ...
  ],
  "totalGames": 30,
  "platform": "PlayStation 5"
}`,
    errorResponses: [
      { code: 400, description: "Invalid platform name" },
      { code: 404, description: "No games found for this platform" },
    ],
  },
  {
    name: "Get Similar Games",
    method: "GET",
    url: "/api/games/<slug>/similar",
    description: "Retrieves games similar to a specific game.",
    response: `{
  "similarGames": [
    {
      "id": "unique-document-id",
      "name": "Similar Game Name",
      "slug": "similar-game-name",
      "releaseDate": "YYYY-MM-DD",
      "description": "Brief game description.",
      "platforms": ["Platform1", "Platform2"],
      "coverImageUrl": "https://example.com/image.jpg",
      "publisher": "Publisher Name",
      "developer": "Developer Name",
      "genres": ["Genre1", "Genre2"]
    },
    // ... more similar games ...
  ],
  "totalSimilarGames": 10,
  "originalGame": {
    "name": "Original Game Name",
    "slug": "original-game-slug"
  }
}`,
    errorResponses: [
      { code: 404, description: "Game not found" },
      { code: 404, description: "No similar games found" },
    ],
  },
  {
    name: "Get Upcoming Games",
    method: "GET",
    url: "/api/games/upcoming",
    description: "Retrieves upcoming game releases.",
    queryParams: [
      {
        name: "limit",
        description: "Number of games to return (default: 10, max: 50)",
      },
    ],
    response: `{
  "upcomingGames": [
    {
      "id": "unique-document-id",
      "name": "Upcoming Game Name",
      "slug": "upcoming-game-name",
      "releaseDate": "YYYY-MM-DD",
      "description": "Brief game description.",
      "platforms": ["Platform1", "Platform2"],
      "coverImageUrl": "https://example.com/image.jpg",
      "publisher": "Publisher Name",
      "developer": "Developer Name",
      "genres": ["Genre1", "Genre2"]
    },
    // ... more upcoming games ...
  ],
  "totalUpcomingGames": 15
}`,
    errorResponses: [
      { code: 400, description: "Invalid query parameters" },
      { code: 404, description: "No upcoming games found" },
    ],
  },
];

export default function Docs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" },
            }}
          >
            API Docs
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: "text.secondary",
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Welcome to the Gameboxd API documentation. Here you will find
            details about how to use the API endpoints, including examples of
            requests and responses.
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 4,
              borderRadius: "12px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "secondary.main",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
              }}
            >
              Base URL
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              All endpoints are relative to the base URL:
            </Typography>
            <SyntaxHighlighter
              language="bash"
              style={vscDarkPlus}
              customStyle={{ borderRadius: "8px" }}
            >
              {"http://gbxd-api.vercel.app/api/"}
            </SyntaxHighlighter>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: "12px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "secondary.main",
                mb: 3,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
              }}
            >
              Endpoints
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 3,
                ".MuiTab-root": {
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                  minWidth: { xs: 100, sm: 120 },
                },
              }}
            >
              {endpoints.map((endpoint, index) => (
                <Tab key={index} label={endpoint.name} />
              ))}
            </Tabs>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    {endpoints[activeTab].name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {endpoints[activeTab].description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      mb: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color={
                        endpoints[activeTab].method === "GET"
                          ? "primary"
                          : "secondary"
                      }
                      sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                    >
                      {endpoints[activeTab].method}
                    </Button>
                    <SyntaxHighlighter
                      language="bash"
                      style={vscDarkPlus}
                      customStyle={{
                        borderRadius: "8px",
                        flex: 1,
                        width: "100%",
                      }}
                    >
                      {endpoints[activeTab].url}
                    </SyntaxHighlighter>
                  </Box>
                  {endpoints[activeTab].note && (
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    >
                      Note: {endpoints[activeTab].note}
                    </Typography>
                  )}
                  {endpoints[activeTab].queryParams && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Query Parameters
                      </Typography>
                      <ul>
                        {endpoints[activeTab].queryParams.map(
                          (param, index) => (
                            <li key={index}>
                              <Typography variant="body2">
                                <strong>{param.name}</strong> (optional):{" "}
                                {param.description}
                              </Typography>
                            </li>
                          )
                        )}
                      </ul>
                    </Box>
                  )}
                  {endpoints[activeTab].requestBody && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Request Body
                      </Typography>
                      <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        customStyle={{ borderRadius: "8px" }}
                      >
                        {endpoints[activeTab].requestBody}
                      </SyntaxHighlighter>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Response
                    </Typography>
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: "8px" }}
                    >
                      {endpoints[activeTab].response}
                    </SyntaxHighlighter>
                  </Box>
                  {endpoints[activeTab].authentication && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Authentication
                      </Typography>
                      <Typography variant="body2">
                        {endpoints[activeTab].authentication}
                      </Typography>
                    </Box>
                  )}
                  {endpoints[activeTab].errorResponses && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Error Responses
                      </Typography>
                      <ul>
                        {endpoints[activeTab].errorResponses.map(
                          (error, index) => (
                            <li key={index}>
                              <Typography variant="body2">
                                <strong>{error.code}</strong>:{" "}
                                {error.description}
                              </Typography>
                            </li>
                          )
                        )}
                      </ul>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}
