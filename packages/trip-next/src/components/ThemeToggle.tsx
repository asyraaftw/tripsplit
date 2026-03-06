"use client";

import { IconButton } from "@mui/material";
import { useThemeMode } from "./ThemeProvider";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      aria-label="toggle dark mode"
      sx={{ position: "fixed", top: 16, right: 16 }}
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </IconButton>
  );
}
