"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

export default function Docs() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="mt-4 text-lg">
            Welcome to the API documentation. Here you will find details about
            how to use the API endpoints, including examples of requests and
            responses.
          </p>
        </header>

        <section className="w-full max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold">Base URL</h2>
          <p className="mt-2">All endpoints are relative to the base URL:</p>
          <pre className="bg-gray-800 p-4 rounded-md">
            <code>http://localhost:3000/api/</code>
          </pre>
        </section>

        <section className="w-full max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold">Endpoints</h2>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">1. Add Game</h3>
            <p className="mt-2">Endpoint to add a new game to the database.</p>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>POST /api/add-game</code>
            </pre>
            <h4 className="mt-4 text-lg font-semibold">Request Body</h4>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>{`{
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`}</code>
            </pre>
            <h4 className="mt-4 text-lg font-semibold">Response</h4>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>{`{
  "id": "document-id",
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`}</code>
            </pre>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold">2. Get All Games</h3>
            <p className="mt-2">
              Endpoint to retrieve all games from the database.
            </p>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>GET /api/games</code>
            </pre>
            <h4 className="mt-4 text-lg font-semibold">Response</h4>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>{`[
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
]`}</code>
            </pre>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold">3. Get Game Details</h3>
            <p className="mt-2">
              Endpoint to retrieve details of a specific game.
            </p>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>GET /api/game/{`<game-id>`}</code>
            </pre>
            <h4 className="mt-4 text-lg font-semibold">Response</h4>
            <pre className="bg-gray-800 p-4 rounded-md">
              <code>{`{
  "id": "document-id",
  "name": "Game Name",
  "releaseDate": "DD-MM-YYYY",
  "description": "Game description.",
  "platforms": ["Platform1", "Platform2"],
  "coverImage": "https://example.com/image.jpg",
  "publisher": "Publisher Name",
  "developer": "Developer Name",
  "genres": ["Genre1", "Genre2"]
}`}</code>
            </pre>
          </div>
        </section>
      </main>
    </ThemeProvider>
  );
}
