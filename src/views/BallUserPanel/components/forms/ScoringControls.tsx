import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  Drawer,
  Button,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useMatch } from "../../context/MatchContext";
import { DismissType, DismissTypeMeta } from "../../../../api/ball_user/types";
import {
  RUNS,
  BOUNDARIES,
  WIDES,
  BYES,
  LEG_BYES,
  NO_BALLS,
  WICKETS,
} from "./Scores";

const AdminMatchControlPanel = () => {
  const { currentInnings, addScore, addScoreWithDismissal } = useMatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Dismissal states
  const [score, setScore] = useState<string | null>(null);
  const [dismissModalOpen, setDismissModalOpen] = useState(false);
  const [dismissType, setDismissType] = useState("");
  const [dismissBy, setDismissBy] = useState<number | undefined>();

  // ✅ Score selection logic
  const handleScoreSelect = async (value: string) => {
    if (value.includes("W")) {
      setScore(value);
      setDismissModalOpen(true);
      return;
    }
    await addScore({ outcome: value });
  };

  const handleDismissSubmit = async () => {
    if (!dismissType) return;
    await addScoreWithDismissal({
      outcome: score!,
      dismissalType: dismissType as DismissType,
      fielderId: dismissBy,
    });
    setDismissModalOpen(false);
    setDismissType("");
    setDismissBy(undefined);
  };

  // ✅ Dynamic Keyboard Bindings from Score Objects
  useEffect(() => {
    const keyMap: Record<string, string> = {};
    const allOptions = [
      ...RUNS,
      ...BOUNDARIES,
      ...WIDES,
      ...BYES,
      ...LEG_BYES,
      ...NO_BALLS,
      ...WICKETS,
    ];

    allOptions.forEach((opt) => {
      if (opt.shortcut) {
        keyMap[opt.shortcut.toLowerCase()] = opt.value;
      }
    });

    const handleKeyPress = (e: KeyboardEvent) => {
      if (dismissModalOpen) return;
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        handleScoreSelect(keyMap[key]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [dismissModalOpen]);

  if (!currentInnings) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <SportsCricketIcon color="primary" /> Runs
        </Typography>
        <Stack direction="row" gap={1} mb={2} flexWrap="wrap">
          {[...RUNS, ...BOUNDARIES].map((opt) => (
            <Tooltip
              key={opt.value}
              title={opt.shortcut ? `Shortcut: ${opt.shortcut}` : ""}
              arrow
            >
              <Chip
                label={`${opt.label}${opt.shortcut ? ` (${opt.shortcut})` : ""}`}
                color={
                  opt.value === "4" || opt.value === "6" ? "success" : "primary"
                }
                onClick={() => handleScoreSelect(opt.value)}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  minWidth: 90,
                  height: 40,
                }}
              />
            </Tooltip>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* ✅ Extras */}
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <EmojiEventsIcon color="secondary" /> Extras
        </Typography>
        <Stack direction="row" gap={2} flexWrap="wrap" mb={2}>
          {[...WIDES, ...NO_BALLS, ...BYES, ...LEG_BYES].map((opt) => {
            let color: "primary" | "secondary" | "success" | "warning" | "error" | "info" =
              "primary";

            if (WIDES.includes(opt)) color = "info";
            if (NO_BALLS.includes(opt)) color = "error";
            if (BYES.includes(opt)) color = "success";
            if (LEG_BYES.includes(opt)) color = "secondary";

            return (
              <Tooltip
                key={opt.value}
                title={opt.shortcut ? `Shortcut: ${opt.shortcut}` : ""}
                arrow
              >
                <Chip
                  label={`${opt.label}${opt.shortcut ? ` (${opt.shortcut})` : ""}`}
                  color={color}
                  onClick={() => handleScoreSelect(opt.value)}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    minWidth: 100,
                    height: 40,
                  }}
                />
              </Tooltip>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* ✅ Wickets */}
        <Typography variant="subtitle2" gutterBottom>
          Wickets
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {WICKETS.map((opt) => (
            <Tooltip
              key={opt.value}
              title={opt.shortcut ? `Shortcut: ${opt.shortcut}` : ""}
              arrow
            >
              <Chip
                label={`${opt.label}${opt.shortcut ? ` (${opt.shortcut})` : ""}`}
                color="error"
                onClick={() => handleScoreSelect(opt.value)}
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  minWidth: 100,
                  height: 40,
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      </Card>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Last action undone successfully!
        </Alert>
      </Snackbar>

      {/* ✅ Help FAB */}
      <Fab
        color="info"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setHelpOpen(true)}
      >
        <HelpOutlineIcon />
      </Fab>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogContent>
          <ul>
            {[...RUNS, ...BOUNDARIES, ...WIDES, ...NO_BALLS, ...BYES, ...LEG_BYES, ...WICKETS]
              .filter((opt) => opt.shortcut)
              .map((opt) => (
                <li key={opt.value}>
                  <strong>{opt.shortcut}</strong> - {opt.label}
                </li>
              ))}
            <li><strong>Ctrl+Z</strong> - Undo</li>
          </ul>
        </DialogContent>
      </Dialog>

      {/* ✅ Dismissal Drawer */}
      <Drawer anchor="bottom" open={dismissModalOpen} onClose={() => setDismissModalOpen(false)}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography variant="h6">Dismissal Details</Typography>
          <Select
            value={dismissType}
            onChange={(e) => setDismissType(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">Select Dismissal Type</MenuItem>
            {Object.entries(DismissTypeMeta).map(([key, meta]) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
          {(dismissType === "CAUGHT" || dismissType === "RUN_OUT") && (
            <Select
              value={dismissBy || ""}
              onChange={(e) => setDismissBy(Number(e.target.value))}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">Select Fielder</MenuItem>
              {currentInnings?.bowlingTeam?.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          )}
          <Button variant="contained" color="primary" onClick={handleDismissSubmit}>
            Confirm Dismissal
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default AdminMatchControlPanel;
