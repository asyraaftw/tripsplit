"use client";

import { Alert, Snackbar as MuiSnackbar } from "@mui/material";
import { useState } from "react";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("info");

  const show = (msg: string, sev: SnackbarSeverity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return { open, message, severity, show, hide };
}

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
}

export function AppSnackbar({
  open,
  message,
  severity,
  onClose,
}: AppSnackbarProps) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose} variant="filled">
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
