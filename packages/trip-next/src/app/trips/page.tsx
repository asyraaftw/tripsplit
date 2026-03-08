"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Typography,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Trip {
  id: number;
  name: string;
  baseCurrency: string;
  createdBy: number;
  startDate: string | null;
  endDate: string | null;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetch("/api/trips")
      .then((res) => res.json())
      .then(setTrips)
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 3, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            My Trips
          </Typography>
          <Button variant="contained" component={Link} href="/trips/new">
            New Trip
          </Button>
        </Box>

        {trips.length === 0 ? (
          <Typography color="text.secondary">
            No trips yet. Create one to get started!
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {trips.map((trip) => (
              <Card key={trip.id} variant="outlined">
                <CardActionArea component={Link} href={`/trips/${trip.id}`}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {trip.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {trip.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {trip.baseCurrency}
                          {trip.startDate &&
                            ` • ${trip.startDate}${trip.endDate ? ` – ${trip.endDate}` : ""}`}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
