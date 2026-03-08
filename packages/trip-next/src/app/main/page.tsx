"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import HistoryIcon from "@mui/icons-material/History";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import FlagIcon from "@mui/icons-material/Flag";
// import SettingsIcon from "@mui/icons-material/Settings";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Mock data for demonstration
const groups = [
  { id: 1, name: "Trip to Bali", avatar: "🏝️", balance: -45.5 },
  { id: 2, name: "Apartment", avatar: "🏠", balance: 120.0 },
  { id: 3, name: "Office Lunch", avatar: "🍕", balance: 0 },
];

const friends = [
  { id: 1, name: "Alex Johnson", avatar: "A", balance: 35.0 },
  { id: 2, name: "Sarah Miller", avatar: "S", balance: -22.5 },
  { id: 3, name: "Mike Chen", avatar: "M", balance: 0 },
  { id: 4, name: "Emma Wilson", avatar: "E", balance: 15.75 },
];

const recentActivity = [
  {
    id: 1,
    description: "Dinner at Italian Place",
    paidBy: "You",
    amount: 85.0,
    date: "Mar 6",
    group: "Trip to Bali",
  },
  {
    id: 2,
    description: "Uber to airport",
    paidBy: "Alex",
    amount: 45.0,
    date: "Mar 5",
    group: "Trip to Bali",
  },
  {
    id: 3,
    description: "Groceries",
    paidBy: "You",
    amount: 62.3,
    date: "Mar 4",
    group: "Apartment",
  },
  {
    id: 4,
    description: "Electric bill",
    paidBy: "Sarah",
    amount: 120.0,
    date: "Mar 3",
    group: "Apartment",
  },
  {
    id: 5,
    description: "Team lunch",
    paidBy: "Mike",
    amount: 156.0,
    date: "Mar 2",
    group: "Office Lunch",
  },
];

const Main = () => {
  const totalOwed = friends
    .filter((f) => f.balance > 0)
    .reduce((sum, f) => sum + f.balance, 0);
  const totalOwe = Math.abs(
    friends.filter((f) => f.balance < 0).reduce((sum, f) => sum + f.balance, 0),
  );
  const totalBalance = totalOwed - totalOwe;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: 240,
            borderRight: 1,
            borderColor: "divider",
            display: { xs: "none", md: "block" },
          }}
        >
          <List>
            <ListItemButton selected component={Link} href="/main">
              <ListItemIcon>
                {/* <DashboardIcon color="primary" /> */}
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} href="/trips">
              <ListItemIcon>{/* <HistoryIcon /> */}</ListItemIcon>
              <ListItemText primary="Trips" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>{/* <ReceiptLongIcon /> */}</ListItemIcon>
              <ListItemText primary="All expenses" />
            </ListItemButton>
          </List>

          <Divider />

          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Groups
            </Typography>
          </Box>
          <List dense>
            {groups.map((group) => (
              <ListItemButton key={group.id}>
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, fontSize: "1rem" }}>
                    {group.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={group.name} />
              </ListItemButton>
            ))}
            <ListItemButton>
              <ListItemIcon>{/* <AddIcon fontSize="small" /> */}</ListItemIcon>
              <ListItemText
                primary="Add a group"
                primaryTypographyProps={{ color: "primary" }}
              />
            </ListItemButton>
          </List>

          <Divider />

          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Friends
            </Typography>
          </Box>
          <List dense>
            {friends.slice(0, 3).map((friend) => (
              <ListItemButton key={friend.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {friend.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.name} />
              </ListItemButton>
            ))}
            <ListItemButton>
              <ListItemIcon>{/* <AddIcon fontSize="small" /> */}</ListItemIcon>
              <ListItemText
                primary="Add a friend"
                primaryTypographyProps={{ color: "primary" }}
              />
            </ListItemButton>
          </List>

          <Divider />

          <List>
            <ListItemButton>
              <ListItemIcon>{/* <FlagIcon /> */}</ListItemIcon>
              <ListItemText primary="Invite friends" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>{/* <SettingsIcon /> */}</ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {/* Balance Summary Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              mb: 3,
            }}
          >
            <Card
              sx={{
                bgcolor: totalBalance >= 0 ? "success.light" : "error.light",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total balance
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: totalBalance >= 0 ? "success.dark" : "error.dark",
                    fontWeight: 600,
                  }}
                >
                  {totalBalance >= 0 ? "+" : "-"}$
                  {Math.abs(totalBalance).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  You owe
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: "error.main", fontWeight: 600 }}
                >
                  ${totalOwe.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  You are owed
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: "success.main", fontWeight: 600 }}
                >
                  ${totalOwed.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              // startIcon={<AddIcon />}
              color="primary"
            >
              Add an expense
            </Button>
            <Button variant="outlined" color="success">
              Settle up
            </Button>
          </Box>

          {/* Recent Activity */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Activity
          </Typography>
          <Paper variant="outlined">
            <List disablePadding>
              {recentActivity.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {/* <ReceiptLongIcon /> */}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1" fontWeight={500}>
                            {activity.description}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            ${activity.amount.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {activity.paidBy} paid • {activity.group}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.date}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Right Sidebar - Balances */}
        <Paper
          elevation={0}
          sx={{
            width: 280,
            borderLeft: 1,
            borderColor: "divider",
            p: 2,
            display: { xs: "none", lg: "block" },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Friends Balances
          </Typography>
          <List disablePadding>
            {friends.map((friend) => (
              <ListItem key={friend.id} disablePadding sx={{ mb: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {friend.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                  secondary={
                    friend.balance === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        settled up
                      </Typography>
                    ) : friend.balance > 0 ? (
                      <Typography variant="body2" color="success.main">
                        owes you ${friend.balance.toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error.main">
                        you owe ${Math.abs(friend.balance).toFixed(2)}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Group Balances
          </Typography>
          <List disablePadding>
            {groups.map((group) => (
              <ListItem key={group.id} disablePadding sx={{ mb: 1 }}>
                <ListItemAvatar>
                  <Avatar>{group.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={group.name}
                  secondary={
                    group.balance === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        settled up
                      </Typography>
                    ) : group.balance > 0 ? (
                      <Typography variant="body2" color="success.main">
                        you are owed ${group.balance.toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error.main">
                        you owe ${Math.abs(group.balance).toFixed(2)}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add expense"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { md: "none" },
        }}
      >
        {/* <AddIcon /> */}
      </Fab>
    </Box>
  );
};

export default Main;
