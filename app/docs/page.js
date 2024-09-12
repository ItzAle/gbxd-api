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
import Navbar from "../components/Navbar";
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
    description: "Endpoint to add a new game to the database.",
    requestBody: `{
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`,
    response: `{
  "id": "document-id",
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`,
  },
  {
    name: "Get All Games",
    method: "GET",
    url: "/api/games",
    description: "Endpoint to retrieve all games from the database.",
    response: `[
  {
    "id": "document-id",
    "name": "Game Name",
    "releaseDate": "DD-MM-YYYY",
    "description": "Game description.",
    "platforms": ["Platform1", "Platform2"],
    "coverImage": "https://example.com/image.jpg",
    "publisher": "Publisher Name",
    "developer": "Developer Name",
    "genres": ["Genre1", "Genre2"]
  },
  ...
]`,
  },
  {
    name: "Get Game Details",
    method: "GET",
    url: "/api/game/<game-id>",
    description: "Endpoint to retrieve details of a specific game.",
    response: `{
  "id": "document-id",
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`,
  },
  {
    name: "Get Games by Year",
    method: "GET",
    url: "/api/games/year/<year>",
    description: "Endpoint to retrieve games released in a specific year.",
    response: "Returns an array of games released in the specified year.",
  },
  {
    name: "Get Games by Platform",
    method: "GET",
    url: "/api/games/platform/<platform-name>",
    description: "Endpoint to retrieve games available on a specific platform.",
    note: 'Platform name can be full names (e.g., "PlayStation 5") or abbreviations (e.g., "PS5").',
    response: "Returns an array of games available on the specified platform.",
  },
  {
    name: "Get Similar Games",
    method: "GET",
    url: "/api/games/<slug>/similar",
    description: "Endpoint to retrieve games similar to a specific game.",
    response: "Returns an array of games similar to the specified game.",
  },
  {
    name: "Get Upcoming Games",
    method: "GET",
    url: "/api/games/upcoming",
    description: "Endpoint to retrieve upcoming game releases.",
    queryParams: [
      { name: "limit", description: "Number of games to return (default: 10)" },
    ],
    response: "Returns an array of upcoming games, sorted by release date.",
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
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            API Documentation
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: "text.secondary" }}>
            Welcome to the Gameboxd API documentation. Here you will find
            details about how to use the API endpoints, including examples of
            requests and responses.
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: "12px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "secondary.main" }}
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
              p: 4,
              borderRadius: "12px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "secondary.main", mb: 3 }}
            >
              Endpoints
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
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
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    {endpoints[activeTab].name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {endpoints[activeTab].description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Button
                      variant="contained"
                      color={
                        endpoints[activeTab].method === "GET"
                          ? "primary"
                          : "secondary"
                      }
                      sx={{ mr: 2 }}
                    >
                      {endpoints[activeTab].method}
                    </Button>
                    <SyntaxHighlighter
                      language="bash"
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: "8px", flex: 1 }}
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
                </Box>
              </motion.div>
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}
