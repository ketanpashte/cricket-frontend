import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert, Paper } from "@mui/material";
import { TournamnetInfoResponse } from "../../api/tournamnet/tournamentResponse";
import { tournamentService } from "../../api/tournamnet/tournament.api";
import TournamentHeader from "./components/TournamentHeader";
import TournamentDetails from "./components/TournamentDetails";
import ParticipatingTeams from "./components/ParticipatingTeams";
import MatchList from "./components/MatchList";
import WinnerSection from "./components/WinnerSection";
import HighlightsSection from "./components/HighlightsSection";

const TournamentInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<TournamnetInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTournament = React.useCallback(async () => {
    if (!id) return;
    try {
      const response = await tournamentService.getTournamentInfo(Number(id));
      setTournament(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tournament information");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("No tournament ID provided");
      setLoading(false);
      return;
    }
    fetchTournament();
  }, [id, fetchTournament]);

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!tournament) {
    return (
      <Box sx={{ mt: 6 }}>
        <Alert severity="info">No tournament data available.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
        {/* Header */}
        <TournamentHeader tournament={tournament} />

        {/* Details */}
        <TournamentDetails tournament={tournament} />

        {/* Teams */}
        <ParticipatingTeams teams={tournament.participatingTeams} isGroup={tournament.group} groups={tournament.groups} />


        {/* Matching Matches */}
        <MatchList matches={tournament.matches} tournamentId={tournament.id} navigate={navigate} />

        {/* Highlights */}
        <HighlightsSection tournament={tournament} onUpdate={fetchTournament} />

        {/* Winner */}
        {tournament.winner && <WinnerSection winner={tournament.winner} />}
      </Paper>
    </Box>
  );
};

export default TournamentInfoPage;
