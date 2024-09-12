"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Gamepad,
} from "@mui/icons-material";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { title: "Home", path: user ? "/home" : "/" },
    { title: "All Games", path: "/games" },
    { title: "API", path: "/api/games", target: "_blank" },
    { title: "Docs", path: "/docs", target: "_blank" },
  ];

  const userOnlyItems = [{ title: "Add Game", path: "/add-game" }];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.title}
            component={Link}
            href={item.path}
            target={item.target}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
        {user &&
          userOnlyItems.map((item) => (
            <ListItem key={item.title} component={Link} href={item.path}>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "background.paper", boxShadow: "none" }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Gamepad sx={{ mr: 1, color: "#8f44fd" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            GBXD API
          </Typography>
        </Box>
        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.title}
                color="inherit"
                component={Link}
                href={item.path}
                sx={{ mx: 1, color: "white" }}
                target={item.target}
              >
                {item.title}
              </Button>
            ))}
            {user &&
              userOnlyItems.map((item) => (
                <Button
                  key={item.title}
                  color="inherit"
                  component={Link}
                  href={item.path}
                  sx={{ mx: 1, color: "white" }}
                >
                  {item.title}
                </Button>
              ))}
            {user ? (
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <Avatar
                  src={user.photoURL || undefined}
                  alt={user.displayName || "User avatar"}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2" sx={{ mr: 2, color: "white" }}>
                  {user.displayName || user.email}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ borderColor: "#ff5555", color: "#ff5555" }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                onClick={signInWithGoogle}
                sx={{
                  backgroundColor: "#8f44fd",
                  color: "white",
                  "&:hover": { backgroundColor: "#7c3ce3" },
                }}
              >
                Login with Google
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
      <AnimatePresence>
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Box sx={{ textAlign: "right", p: 1 }}>
                <IconButton onClick={handleDrawerToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {drawer}
              {user && (
                <Box
                  sx={{
                    p: 2,
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User avatar"}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: "white" }}>
                      {user.displayName || user.email}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{ borderColor: "#ff5555", color: "#ff5555" }}
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </AppBar>
  );
}
