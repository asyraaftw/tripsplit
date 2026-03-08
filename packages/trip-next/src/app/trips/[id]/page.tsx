"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Trip {
  id: number;
  name: string;
  baseCurrency: string;
  createdBy: number;
  startDate: string | null;
  endDate: string | null;
}

interface Expense {
  id: number;
  tripId: number;
  payerId: number;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then(setTrip)
      .catch(console.error);

    fetch(`/api/trips/${id}/expenses`)
      .then((res) => res.json())
      .then(setExpenses)
      .catch(console.error);
  }, [id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 3, flex: 1 }}>
        <Button component={Link} href="/trips" sx={{ mb: 2 }}>
          ← Back to Trips
        </Button>

        {trip ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight={600}>
                {trip.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Currency: {trip.baseCurrency}
                {trip.startDate &&
                  ` • ${trip.startDate}${trip.endDate ? ` – ${trip.endDate}` : ""}`}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Expenses
              </Typography>
              <Button variant="contained" size="small">
                Add Expense
              </Button>
            </Box>

            {expenses.length === 0 ? (
              <Typography color="text.secondary">
                No expenses recorded for this trip yet.
              </Typography>
            ) : (
              <Paper variant="outlined">
                <List disablePadding>
                  {expenses.map((expense, index) => (
                    <Box key={expense.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {expense.description.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography fontWeight={500}>
                                {expense.description}
                              </Typography>
                              <Typography fontWeight={600}>
                                {expense.currency} {expense.amount.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={new Date(
                            expense.createdAt,
                          ).toLocaleDateString()}
                        />
                      </ListItem>
                      {index < expenses.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Paper>
            )}
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Box>
  );
}
