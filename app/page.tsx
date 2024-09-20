"use client";

import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { Search, Games, Code, Gamepad } from "@mui/icons-material";
import Image from "next/image";
import { ReactNode } from "react";
import image from "../images/placeholder.png";
import Link from "next/link";
import { auth, signInWithGoogle } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

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

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="!bg-[#202020] !p-6 !rounded-lg !shadow-lg !h-full !flex !flex-col"
  >
    <Box className="!flex !items-center !mb-4">
      {icon}
      <Typography variant="h6" className="!ml-2">
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" className="!flex-grow">
      {description}
    </Typography>
  </motion.div>
);

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (user) {
    router.push("/home");
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <div className="!min-h-screen !bg-[#151515]">
        <Container maxWidth="lg">
          <Box className="!py-16 md:!py-24">
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    className="!font-bold !mb-4 !text-white"
                  >
                    Gameboxd API
                  </Typography>
                  <Typography variant="h5" className="!mb-6 !text-gray-300">
                    Unleash the power of games data with our comprehensive API
                  </Typography>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    className="!bg-[#8f44fd] hover:!bg-[#7c3ce3] !text-white !font-bold !py-3 !px-6 !rounded-full"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image
                    src={image}
                    alt="API Visualization"
                    width={600}
                    height={400}
                    className="!rounded-lg !shadow-2xl"
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          <Box className="!py-16">
            <Typography
              variant="h3"
              className="!text-center !mb-12 !text-white"
            >
              Features
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  icon: <Search className="!text-[#8f44fd]" />,
                  title: "Powerful Search",
                  description:
                    "Find games quickly with our advanced search capabilities.",
                },
                {
                  icon: <Games className="!text-[#ff5555]" />,
                  title: "Extensive Database",
                  description:
                    "Access a vast collection of games, platforms, and genres.",
                },
                {
                  icon: <Code className="!text-[#50fa7b]" />,
                  title: "Easy Integration",
                  description:
                    "Simple API calls to integrate game data into your applications.",
                },
                {
                  icon: <Gamepad className="!text-[#bd93f9]" />,
                  title: "Real-time Updates",
                  description:
                    "Stay up-to-date with the latest game releases and updates.",
                },
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} className="!flex">
                  <FeatureCard {...feature} />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="!py-16 !text-center">
            <Typography variant="h3" className="!mb-8 !text-white">
              Ready to level up your game data?
            </Typography>
            <Button
              onClick={signInWithGoogle}
              variant="contained"
              size="large"
              className="!bg-[#ff5555] hover:!bg-[#ff3333] !text-white !font-bold !py-3 !px-6 !rounded-full"
            >
              Sign Up for API Access
            </Button>
          </Box>

          <Box className="!py-8 !text-center">
            <Button
              variant="contained"
              size="large"
              href="/donate"
              className="!bg-[#4CAF50] hover:!bg-[#45a049] !text-white !font-bold !py-3 !px-6 !rounded-full !ml-4"
            >
              Donate
            </Button>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
