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
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Search, Games, Code, Gamepad, Add } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

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

const FeatureCard = ({ icon, title, description, link }) => (
  <Card className="h-full flex flex-col">
    <CardContent className="flex-grow">
      <Box className="flex items-center mb-4">
        {icon}
        <Typography variant="h6" className="ml-2">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" component={Link} href={link}>
        Explore
      </Button>
    </CardActions>
  </Card>
);

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <CssBaseline />
      <div className="min-h-screen bg-[#151515]">
        <Container maxWidth="lg">
          <Box className="py-16 md:py-24">
            <Typography
              variant="h2"
              component="h1"
              className="font-bold mb-4 text-white"
            >
              Welcome back, {user.displayName}!
            </Typography>
            <Typography variant="h5" className="mb-6 text-gray-300">
              Explore and manage your game collection with Gameboxd
            </Typography>
          </Box>

          <Box>
            <Typography variant="h3" className="text-center mb-24 text-white">
              What would you like to do?
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Box className="h-full">
                  <FeatureCard
                    icon={<Search className="text-[#8f44fd]" />}
                    title="Search Games"
                    description="Find new games to add to your collection."
                    link="/games"
                  />
                </Box>
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3}>
                <FeatureCard
                  icon={<Games className="text-[#ff5555]" />}
                  title="My Collection"
                  description="View and manage your game collection."
                  link="/collection"
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3}>
                <Box className="h-full">
                  <FeatureCard
                    icon={<Add className="text-[#50fa7b]" />}
                    title="Add Game"
                    description="Add a new game to the database."
                    link="/add-game"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box className="h-full">
                  <FeatureCard
                    icon={<Code className="text-[#bd93f9]" />}
                    title="API"
                    description="Use our API to access game data."
                    link="/api"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
