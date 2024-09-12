"use client";

import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Container, Typography, Box, Button } from "@mui/material";
import { Google } from "@mui/icons-material";
import { auth, signInWithGoogle } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8f44fd",
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

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [error, setError] = useState(null);

  if (user) {
    router.push("/home");
    return null;
  }

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        setError("Login window closed. Please try again.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Authentication error:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-[#151515] flex items-center justify-center">
        <Container maxWidth="sm">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Typography
              variant="h2"
              component="h1"
              className="font-bold mb-8 text-white"
            >
              Welcome to Gameboxd
            </Typography>
            <Typography variant="h5" className="mb-8 text-gray-300">
              Sign in to access our game API
            </Typography>
            {error && (
              <Typography color="error" className="mb-4">
                {error}
              </Typography>
            )}
            <Button
              onClick={handleSignIn}
              variant="contained"
              size="large"
              startIcon={<Google />}
              className="bg-[#8f44fd] hover:bg-[#7c3ce3] text-white font-bold py-3 px-6 rounded-full"
            >
              Sign in with Google
            </Button>
          </motion.div>
        </Container>
      </div>
    </ThemeProvider>
  );
}
