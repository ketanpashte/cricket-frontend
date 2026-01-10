import React, { useEffect, useState } from "react";
import { Box, Card, Stack, Typography, Snackbar, Alert } from "@mui/material";
import ScoringControls from "./forms/ScoringControls";
import { useMatch } from "../context/MatchContext";
import StartOverForm from "./forms/StartOverForm";
import AddBatterForm from "./forms/AddBatterForm";
import { AppButton } from "../../../components";
import StartInningForm from "./forms/StartInningForm";

const AdminMatchControlPanel = () => {
  const { currentInnings, matchInfo, undo, canUndo } = useMatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleUndo = async () => {
    await undo();
    setSnackbarOpen(true);
  };

  // ✅ Keyboard shortcut (Ctrl+Z or Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (canUndo) {
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canUndo]);

  const renderForm = () => {
    if (!currentInnings) {
      return <Box>Loading...</Box>;
    }

    switch (matchInfo?.state) {
      case "COMPLETED":
        return (
          <Card sx={{ p: 3 }}>
            {matchInfo.result && (
              <Box mt={3}>
                <Typography variant="h6" fontWeight="bold">
                  Match Result: {matchInfo.result}
                </Typography>
              </Box>
            )}
          </Card>
        );
      case "NOT_STARTED":
        return (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Match has not started yet.
            </Typography>
          </Card>
        );
      case "IN_PROGRESS":
        switch (currentInnings.state) {
          case "BETWEEN_OVERS":
            if (currentInnings.currentStrikerId == null) {
              return <AddBatterForm />;
            }
            return <StartOverForm />;

          case "COMPLETED":
            return <StartInningForm />;

          case "IN_PROGRESS":
            return (
              <Stack spacing={2}>
                {currentInnings.currentStrikerId === null ||
                currentInnings.currentNonStrikerId === null ? (
                  <AddBatterForm />
                ) : currentInnings.overCompleted === true ? (
                  <StartOverForm />
                ) : (
                  <ScoringControls />
                )}
              </Stack>
            );

          default:
            return (
              <Box>
                {currentInnings.currentStrikerId === null ||
                currentInnings.currentNonStrikerId === null ? (
                  <AddBatterForm />
                ) : currentInnings.overCompleted === true ||
                  currentInnings.bowlers.length === 0 ? (
                  <StartOverForm />
                ) : (
                  <ScoringControls />
                )}
              </Box>
            );
        }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box>
        <AppButton
          color="warning"
          onClick={handleUndo}
          fullWidth
          sx={{ alignSelf: "flex-start", mb: 2 }}
          disabled={!canUndo} // ✅ Disable button when undo not possible
        >
          Undo
        </AppButton>
        {renderForm()}
      </Box>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Last action undone successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMatchControlPanel;
