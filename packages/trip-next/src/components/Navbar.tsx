"use client";

import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { useThemeMode } from "./ThemeProvider";

export default function Navbar() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600, textAlign: "center" }}
        >
          TripSplit
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="toggle dark mode"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
