"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Typography, Box } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Navbar from "./components/Navbar";

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

const loaders = [
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 100 }} />,
    text: "Loading game controller...",
  },
  { icon: "🌎", text: "Generating Minecraft world..." },
  { icon: "🏆", text: "Polishing trophies..." },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentLoader, setCurrentLoader] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const loaderInterval = setInterval(() => {
      setCurrentLoader((prev) => (prev + 1) % loaders.length);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(loaderInterval);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="min-h-screen">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-screen"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {typeof loaders[currentLoader].icon === "string" ? (
                  <Typography variant="h1">
                    {loaders[currentLoader].icon}
                  </Typography>
                ) : (
                  loaders[currentLoader].icon
                )}
              </motion.div>
              <Typography variant="h6" className="mt-4">
                {loaders[currentLoader].text}
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Navbar />
              <Container maxWidth="lg">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="calc(100vh - 64px)"
                >
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Typography
                      variant="h2"
                      component="h1"
                      gutterBottom
                      align="center"
                    >
                      Welcome to Gameboxd API
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Typography variant="h4" align="center">
                      The official games API for gameboxd
                    </Typography>
                  </motion.div>
                </Box>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
