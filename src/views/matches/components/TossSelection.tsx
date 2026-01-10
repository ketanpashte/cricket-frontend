import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Avatar,
  Stack,
  Button,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper
} from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";

import { MatchResponse } from "../../../api/match/matchResponse";
import { TeamInfo } from "../../../api/teams/TeamRequest";
import MatchApi from "../../../api/ball_user/MatchApi";
import TeamSelection from "./TeamSelection";

interface Props {
  match: MatchResponse;
  teamA?: TeamInfo;
  teamB?: TeamInfo;
  onMatchStarted: () => void;
}

const steps = ["Toss Selection", "Player Selection", "Review & Start"];

const TossSelection: React.FC<Props> = ({ match, teamA, teamB, onMatchStarted }) => {
  const [activeStep, setActiveStep] = useState(0);

  const [selectedPlayersA, setSelectedPlayersA] = useState<{ id: number; name: string, role: string }[]>([]);
  const [selectedPlayersB, setSelectedPlayersB] = useState<{ id: number; name: string, role: string }[]>([]);
  const [benchA, setBenchA] = useState<{ id: number; name: string, role: string }[]>([]);
  const [benchB, setBenchB] = useState<{ id: number; name: string, role: string }[]>([]);

  const [captainA, setCaptainA] = useState<number>(0);
  const [viceCaptainA, setViceCaptainA] = useState<number>(0);
  const [wicketKeeperA, setWicketKeeperA] = useState<number>(0);

  const [captainB, setCaptainB] = useState<number>(0);
  const [viceCaptainB, setViceCaptainB] = useState<number>(0);
  const [wicketKeeperB, setWicketKeeperB] = useState<number>(0);

  const [tossWinnerTeamId, setTossWinnerTeamId] = useState<number | undefined>();
  const [electedTo, setElectedTo] = useState<"bat" | "bowl">("bat");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats for Toss Confirmation Dialog
  const [tossConfirmOpen, setTossConfirmOpen] = useState(false);
  const [pendingTossWinner, setPendingTossWinner] = useState<TeamInfo | undefined>();
  const [pendingElectedTo, setPendingElection] = useState<"bat" | "bowl">("bat");

  useEffect(() => {
    if (teamA?.players) {
      const aPlayers = teamA.players.slice(0, 11);
      const aBench = teamA.players.slice(11);
      setSelectedPlayersA(aPlayers);
      setBenchA(aBench);
      setCaptainA(teamA.captainId ?? 0);
      setViceCaptainA(teamA.viceCaptainId ?? 0);
      setWicketKeeperA(teamA.players[2]?.id ?? 0);
    }
    if (teamB?.players) {
      const bPlayers = teamB.players.slice(0, 11);
      const bBench = teamB.players.slice(11);
      setSelectedPlayersB(bPlayers);
      setBenchB(bBench);
      setCaptainB(teamB.captainId ?? 0);
      setViceCaptainB(teamB.viceCaptainId ?? 0);
      setWicketKeeperB(bPlayers[2]?.id ?? 0);
    }
  }, [teamA, teamB]);

  const handleStart = async () => {
    try {
      if (!tossWinnerTeamId) throw new Error("Select Toss Winner");
      setLoading(true);
      await MatchApi.createMatch({
        matchId: match.id,
        teamAPlayers: selectedPlayersA.map((p) => p.id),
        teamBPlayers: selectedPlayersB.map((p) => p.id),
        teamACaptainId: captainA,
        teamAViceCaptainId: viceCaptainA,
        teamAWicketKeeperId: wicketKeeperA,
        teamBCaptainId: captainB,
        teamBViceCaptainId: viceCaptainB,
        teamBWicketKeeperId: wicketKeeperB,
        electedTeamId: tossWinnerTeamId!!,
        electedTo,
        overs: match.totalOvers,
      });
      onMatchStarted();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to start match";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTossClick = (team: TeamInfo, decision: "bat" | "bowl") => {
    setPendingTossWinner(team);
    setPendingElection(decision);
    setTossConfirmOpen(true);
  };

  const confirmTossSelection = () => {
    if (pendingTossWinner) {
      setTossWinnerTeamId(pendingTossWinner.id);
      setElectedTo(pendingElectedTo);
      setTossConfirmOpen(false);
      setActiveStep(1); // Move to Player Selection
      setError(null);
    }
  };

  const handleNext = () => {
    // Validation for Step 0 (Toss)
    if (activeStep === 0) {
      if (!tossWinnerTeamId) return setError("Please select a Toss Winner.");
    }

    // Validation for Step 1 (Player Selection)
    if (activeStep === 1) {
      if (selectedPlayersA.length < 11)
        return setError(`Team ${teamA?.name} must have 11 players selected.`);
      if (selectedPlayersB.length < 11)
        return setError(`Team ${teamB?.name} must have 11 players selected.`);

      if (!captainA) return setError(`Select Captain for Team ${teamA?.name}.`);
      if (!captainB) return setError(`Select Captain for Team ${teamB?.name}.`);
      // Warning: Relaxed other validations as per previous sessions, strictly removed to avoid blockers
    }

    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const TossSelectCard = ({ team }: { team?: TeamInfo }) => {
    if (!team) return null;
    const isWinner = tossWinnerTeamId === team.id;

    return (
      <Paper elevation={isWinner ? 6 : 2} sx={{
        p: 3, borderRadius: 3, height: '100%',
        border: isWinner ? "2px solid #1976d2" : "1px solid rgba(255,255,255,0.05)",
        bgcolor: isWinner ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
      }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar src={team.logoUrl} sx={{ width: 100, height: 100, mb: 1, border: '4px solid', borderColor: 'background.paper', boxShadow: 3 }} />
          <Typography variant="h5" fontWeight="bold">{team.name}</Typography>
          <Divider flexItem sx={{ width: '100%' }} />

          <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">Select Decision</Typography>

          <Stack direction="row" spacing={2} width="100%">
            <Button
              fullWidth
              variant={isWinner && electedTo === 'bat' ? "contained" : "outlined"}
              color="primary"
              size="large"
              startIcon={<SportsCricketIcon />}
              onClick={() => handleTossClick(team, 'bat')}
              sx={{ borderRadius: 2, height: 48 }}
            >
              Batting
            </Button>
            <Button
              fullWidth
              variant={isWinner && electedTo === 'bowl' ? "contained" : "outlined"}
              color="secondary"
              size="large"
              startIcon={<SportsBaseballIcon />}
              onClick={() => handleTossClick(team, 'bowl')}
              sx={{ borderRadius: 2, height: 48 }}
            >
              Bowling
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Toss Selection */}
      {activeStep === 0 && (
        <Stack spacing={4}>
          <Typography variant="h5" align="center" fontWeight="bold">
            Who won the toss?
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="stretch" px={4} py={4}>
            {/* Team A */}
            <Box flex={1}>
              <TossSelectCard team={teamA} />
            </Box>

            <Box display="flex" alignItems="center" justifyContent="center">
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', color: 'text.primary', fontWeight: 'bold' }}>VS</Avatar>
            </Box>

            {/* Team B */}
            <Box flex={1}>
              <TossSelectCard team={teamB} />
            </Box>
          </Stack>
        </Stack>
      )}

      {/* Step 2: Player Selection */}
      {activeStep === 1 && (
        <TeamSelection
          teamA={teamA}
          teamB={teamB}
          selectedPlayersA={selectedPlayersA}
          selectedPlayersB={selectedPlayersB}
          setSelectedPlayersA={setSelectedPlayersA}
          setSelectedPlayersB={setSelectedPlayersB}
          benchA={benchA}
          benchB={benchB}
          setBenchA={setBenchA}
          setBenchB={setBenchB}
          captainA={captainA}
          viceCaptainA={viceCaptainA}
          wicketKeeperA={wicketKeeperA}
          captainB={captainB}
          viceCaptainB={viceCaptainB}
          wicketKeeperB={wicketKeeperB}
          setCaptain={(id, team) => (team === "A" ? setCaptainA(id) : setCaptainB(id))}
          setViceCaptain={(id, team) => (team === "A" ? setViceCaptainA(id) : setViceCaptainB(id))}
          setWicketKeeper={(id, team) => (team === "A" ? setWicketKeeperA(id) : setWicketKeeperB(id))}
        />
      )}

      {/* Step 3: Review */}
      {activeStep === 2 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Review Match Configuration
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Toss Winner</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {tossWinnerTeamId === teamA?.id ? teamA?.name : teamB?.name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Use Decision</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                  {electedTo}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="body2" color="text.secondary">
            Confirming will start the match immediately. Ensure all player selections are final.
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Actions */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !tossWinnerTeamId} // Disable next on step 0 if no toss selection
          >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleStart}
            disabled={loading}
            color="success"
          >
            {loading ? "Starting..." : "Start Match"}
          </Button>
        )}
      </Stack>

      {/* Confirm Toss Dialog */}
      <Dialog open={tossConfirmOpen} onClose={() => setTossConfirmOpen(false)}>
        <DialogTitle>Confirm Toss Result</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selected team <b>{pendingTossWinner?.name}</b> won the toss and selected <b>{pendingElectedTo === 'bat' ? 'Batting' : 'Bowling'}</b>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTossConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmTossSelection} variant="contained" autoFocus>
            Confirm & Next
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TossSelection;
