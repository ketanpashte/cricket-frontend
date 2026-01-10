import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Grid,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { AppAlert, AppButton } from "../../components";
import { useAppStore } from "../../store";
import MatchDetails from "./components/MatchDetails";
import TipsSection from "./components/TipsSection";
import MatchResult from "./components/MatchResult";
import TossSelection from "./components/TossSelection";

import { MatchResponse } from "../../api/match/matchResponse";
import { MatchService } from "../../api/match/matches.api";
import { Tip, TipService } from "../../api/match/tips/tip.api";
import { teamServcie } from "../../api/teams/teams.api";
import { TeamInfo } from "../../api/teams/TeamRequest";

import { WeatherInfoRequest, WeatherInfoResponse } from "../../api/match/weather/types";
import WeatherForm from "./components/weatherForm";
import { getWeather, saveWeatherInfo } from "../../api/match/weather/weatherApi";
import { PlayerRole } from "../../utils";
import WeatherCard from "./components/WeatherInfoResponse";
import { VenueScoringDto } from "../../api/venue/types";
import { VenueService } from "../../api/venue/api";
import VenueScoringPatternCard from "./components/VenueScoring";
import VenueScoringForm from "../venue/ScoringPtternFrom";
import MatchApi from "../../api/ball_user/MatchApi";
import { MatchResult as MatchResultType } from "../../api/ball_user/types";

const MatchInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [teamA, setTeamA] = useState<TeamInfo>();
  const [teamB, setTeamB] = useState<TeamInfo>();
  const [newTip, setNewTip] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);

  const [weatherOpen, setWeatherOpen] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfoResponse | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [venueScoringPattern, setVenueScoringPattern] = useState<VenueScoringDto | undefined>();

  const [_, dispatch] = useAppStore();
  const matchService = useRef(new MatchService(dispatch)).current;
  const tipService = useRef(new TipService(dispatch)).current;
  const venueService = useRef(new VenueService()).current;

  const [openScoringModal, setOpenScoringModal] = useState(false);
  const [liveMatchData, setLiveMatchData] = useState<MatchResultType | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No match ID provided");
      setLoading(false);
      return;
    }
    fetchMatch();
    fetchTips();
    fetchWeather();
  }, [id]);

  useEffect(() => {
    if (match) fetchTeamInfo();
  }, [match]);

  useEffect(() => {
    if (match && match.venueId)
      venueService.getByVenueScoringId(match.venueId).then((res) => setVenueScoringPattern(res.data));
  }, [match]);

  useEffect(() => {
    if (match?.liveMatchId) {
      MatchApi.getMatchById(match.liveMatchId.toString())
        .then((res) => setLiveMatchData(res))
        .catch((err) => console.error("Failed to fetch live match data", err));
    }
  }, [match?.liveMatchId]);

  const fetchMatch = async () => {
    try {
      const response = await matchService.getMatchInfoInfo(Number(id));
      setMatch(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load match info");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamInfo = async () => {
    try {
      const [teamARes, teamBRes] = await Promise.all([
        teamServcie.getTeamInfo(match!.teamA.teamId),
        teamServcie.getTeamInfo(match!.teamB.teamId),
      ]);

      const sortedTeamA = {
        ...teamARes.data.data,
        players: sortPlayersByRole(teamARes.data.data.players),
      };

      const sortedTeamB = {
        ...teamBRes.data.data,
        players: sortPlayersByRole(teamBRes.data.data.players),
      };

      setTeamA(sortedTeamA);
      setTeamB(sortedTeamB);
    } catch (err) {
      console.error("Error fetching team info", err);
    }
  };

  const sortPlayersByRole = (players: { id: number; name: string; role: string }[]) => {
    const rolePriority: Record<PlayerRole, number> = {
      [PlayerRole.WICKET_KEEPER]: 1,
      [PlayerRole.BATSMAN]: 2,
      [PlayerRole.ALL_ROUNDER]: 3,
      [PlayerRole.BOWLER]: 4,
    };
    return players.sort((a, b) => {
      const priorityA = rolePriority[a.role as PlayerRole] ?? 99;
      const priorityB = rolePriority[b.role as PlayerRole] ?? 99;
      return priorityA - priorityB;
    });
  };


  const fetchTips = async () => {
    try {
      const tips = await tipService.getTips(Number(id));
      setTips(tips);
    } catch (err) {
      console.error("Failed to fetch tips", err);
    }
  };
  const fetchWeather = async () => {
    try {
      const response = await getWeather(Number(id));
      setWeatherInfo(response);
    } catch (err) {
      console.error("Failed to fetch weather info", err);
    }
  };

  const handleAddTip = async () => {
    if (!newTip.trim()) return;
    try {
      await tipService.addTip(Number(id), newTip.trim());
      setNewTip("");
      fetchTips();
    } catch (err) {
      console.error("Add tip failed", err);
    }
  };

  const handleDeleteTip = async (tipId: number) => {
    try {
      await tipService.deleteTip(tipId);
      fetchTips();
    } catch (err) {
      console.error("Delete tip failed", err);
    }
  };

  const handleForceRestart = async () => {
    if (!match?.liveMatchId || !id) return;
    if (!window.confirm("Are you sure you want to restart the match?")) return;

    try {
      await matchService.forceRestart(match.id);
      alert("Match has been restarted.");
      fetchMatch();
    } catch (err) {
      alert("Failed to restart match.");
    }
  };

  const handleWeatherSubmit = async (data: WeatherInfoRequest) => {
    setWeatherLoading(true);
    try {
      await saveWeatherInfo(Number(id), data);
      await fetchWeather(); // refresh after save
      setWeatherOpen(false);
    } catch (err) {
      console.error("Failed to save weather info", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 6 }}>
        <AppAlert variant="filled" severity="error">
          {error}
        </AppAlert>
      </Box>
    );
  }

  if (!match) {
    return (
      <Box sx={{ mt: 6 }}>
        <AppAlert severity="info">No match data available.</AppAlert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", py: 3, px: 2 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #eee",
          py: 1,
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {match.teamA.teamName} vs {match.teamB.teamName} - {match.totalOvers} Overs
        </Typography>
        <Stack direction="row" spacing={2}>
          <AppButton variant="outlined" onClick={() => setWeatherOpen(true)}>
            Weather Info
          </AppButton>
          {match.liveMatchId ? (
            <>
              <AppButton LinkComponent={Link} to={`/live/${match.liveMatchId}`}>
                Live Panel
              </AppButton>
              <AppButton variant="outlined" color="error" onClick={handleForceRestart}>
                Force Restart
              </AppButton>
            </>
          ) : (
            <AppButton variant="contained" color="primary" onClick={() => setSetupOpen(true)}>
              Setup Match
            </AppButton>
          )}
        </Stack>
      </Box>

      {/* Main Content */}
      <Stack spacing={3} mt={3}>
        <Card>
          <CardContent>
            <MatchDetails match={match} teamAInfo={teamA} teamBInfo={teamB} liveMatchData={liveMatchData} />
          </CardContent>
        </Card>
        {/* Post-Match Result */}
        {(match.tossWinner || match.winningTeam) && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <EmojiEventsIcon sx={{ mr: 1, color: "secondary.main" }} />
                Match Result
              </Typography>
              <MatchResult match={match} />
            </CardContent>
          </Card>
        )}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }} >
            {weatherInfo && (
              <WeatherCard weather={weatherInfo} />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {venueScoringPattern && (
              <VenueScoringPatternCard onEdit={() => setOpenScoringModal(true)} scoringData={venueScoringPattern} />
            )}
          </Grid>
        </Grid>

        {/* Tips Section */}
        <Card>
          <CardContent>
            <TipsSection
              tips={tips}
              newTip={newTip}
              onChange={setNewTip}
              onAdd={handleAddTip}
              onDelete={handleDeleteTip}
            />
          </CardContent>
        </Card>
      </Stack>

      {/* Toss & Player Selection Dialog */}
      <Dialog
        fullWidth
        maxWidth="xl"
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper',
            backgroundImage: 'none', // Remove default gradient if any
            position: 'relative',
            maxHeight: '90vh'
          }
        }}
        scroll="paper"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={3} py={2} borderBottom="1px solid rgba(255,255,255,0.1)">
          <Typography variant="h5" fontWeight="bold">Toss & Player Selection</Typography>
          <AppButton variant="text" onClick={() => setSetupOpen(false)} sx={{ minWidth: 'auto', px: 2 }}>Close</AppButton>
        </Stack>

        <DialogContent sx={{ p: 0 }}>
          <TossSelection
            match={match}
            teamA={teamA}
            teamB={teamB}
            onMatchStarted={() => {
              fetchMatch();
              setSetupOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={weatherOpen} onClose={() => setWeatherOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Weather Info</DialogTitle>
        <DialogContent>
          <WeatherForm
            initialValues={
              weatherInfo || {
                condition: "",
                temperature: 0,
                humidity: 0,
                windSpeed: 0,
                rainProbability: 0,
                icon: "",
              }
            }
            loading={weatherLoading}
            onSubmit={handleWeatherSubmit}
          />
        </DialogContent>
        <DialogActions>
          <AppButton variant="outlined" onClick={() => setWeatherOpen(false)}>
            Close
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openScoringModal}
        onClose={() => setOpenScoringModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Venue Scoring</DialogTitle>
        <DialogContent>
          {match.venueId ? (
            <VenueScoringForm venueId={match.venueId} onClose={() => {
              setOpenScoringModal(false);
              fetchMatch();
            }} />
          ) : (
            <Typography>Select a venue to edit scoring</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MatchInfoPage;
