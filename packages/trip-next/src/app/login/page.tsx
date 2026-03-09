"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { groupTripApi } from "@/api/groupTrip";
import { AppSnackbar, useSnackbar } from "@/components/Snackbar";

export default function LoginPage() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [authKey, setAuthKey] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    snackbar.hide();

    try {
      await groupTripApi.login({ authKey, password });
      snackbar.show("Login successful!", "success");
      router.push("/main");
    } catch (err) {
      snackbar.show(
        err instanceof Error ? err.message : "Failed to connect to server",
        "error",
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%", mx: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              sx={{ mb: 1 }}
            >
              TripSplit
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              Sign in to your account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Auth Key"
                type="text"
                fullWidth
                required
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              >
                Sign In
              </Button>

              <Typography variant="body2" textAlign="center">
                Don&apos;t have a group?{" "}
                <Link
                  href="/register"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <AppSnackbar {...snackbar} onClose={snackbar.hide} />
    </>
  );
}
