"use client";

import { groupTripApi } from "@/api/groupTrip";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AppSnackbar, useSnackbar } from "@/components/Snackbar";

const steps = ["Group Details", "Member Names", "Confirmation"];

export default function RegisterPage() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [numberOfPax, setNumberOfPax] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      const paxCount = Number(numberOfPax);
      setMemberNames((prev) =>
        Array.from({ length: paxCount }, (_, i) => prev[i] ?? ""),
      );
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const updateMemberName = (index: number, value: string) => {
    setMemberNames((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    snackbar.hide();

    try {
      await groupTripApi.register({
        groupName,
        email,
        password,
        pax: Number(numberOfPax),
        members: memberNames,
      });
      snackbar.show("Registration successful! Please log in.", "success");
      router.push("/login");
    } catch (err) {
      snackbar.show(
        err instanceof Error ? err.message : "Failed to connect to server",
        "error",
      );
    }
  };

  const isFormValid =
    groupName &&
    email &&
    numberOfPax &&
    Number(numberOfPax) >= 2 &&
    Number(numberOfPax) <= 10;

  const areMemberNamesFilled = memberNames.every((name) => name.trim() !== "");

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
        <Card sx={{ maxWidth: 450, width: "100%", mx: 2 }}>
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
              Create a new account
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 3 }} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box>
                <TextField
                  label="Group Name"
                  fullWidth
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  label="Number of Pax"
                  type="number"
                  fullWidth
                  required
                  value={numberOfPax}
                  onChange={(e) => setNumberOfPax(e.target.value)}
                  slotProps={{ htmlInput: { min: 2, max: 10 } }}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  disabled={!isFormValid}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Enter a name for each member:
                </Typography>
                {memberNames.map((name, index) => (
                  <TextField
                    key={index}
                    label={`Member ${index + 1}`}
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => updateMemberName(index, e.target.value)}
                    sx={{ mb: 2 }}
                    size="small"
                  />
                ))}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    disabled={!areMemberNamesFilled}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Please confirm your details:
                </Typography>

                <Box
                  sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Group Name:</strong> {groupName}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {email}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Number of Pax:</strong> {numberOfPax}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Members:</strong>
                  </Typography>
                  {memberNames.map((name, index) => (
                    <Typography key={index} variant="body2" sx={{ pl: 1 }}>
                      {index + 1}. {name}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="small"
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            )}

            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                href="/login"
                style={{ textDecoration: "none" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <AppSnackbar {...snackbar} onClose={snackbar.hide} />
    </>
  );
}
