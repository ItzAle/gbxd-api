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
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //   const handleProfileClick = () => {
  //     if (user) {
  //       router.push(`/profile/${user.uid}`);
  //     }
  //   };

  const navItems = [
    { title: "Home", path: "/" },
    { title: "All Games", path: "/games" },
    { title: "API", path: "/api/games", target: "_blank" },
    { title: "DOCS", path: "/docs", target: "_blank" },
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
          <ListItem button key={item.title} component={Link} href={item.path}>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
        {user &&
          userOnlyItems.map((item) => (
            <ListItem
              button
              key={item.title}
              component={Link}
              href={item.path}
              target={item.target}
            >
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "background.paper" }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GBXD API
        </Typography>
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.title}
                color="inherit"
                component={Link}
                href={item.path}
                sx={{ mx: 1 }}
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
                  target={item.target}
                  sx={{ mx: 1 }}
                >
                  {item.title}
                </Button>
              ))}
          </Box>
        )}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || "User avatar"}
              sx={{ width: 32, height: 32, mr: 1 }}
              //   onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
            <Typography
              variant="body2"
              sx={{ mr: 2, cursor: "pointer" }}
              //   onClick={handleProfileClick}
            >
              {user.displayName || user.email}
            </Typography>
            <Button color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="secondary" onClick={signInWithGoogle}>
            Login with Google
          </Button>
        )}
      </Toolbar>
      <AnimatePresence>
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Box sx={{ textAlign: "right", p: 1 }}>
                <IconButton onClick={handleDrawerToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {drawer}
            </motion.div>
          </Drawer>
        )}
      </AnimatePresence>
    </AppBar>
  );
}
