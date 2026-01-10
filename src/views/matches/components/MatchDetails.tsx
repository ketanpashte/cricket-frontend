import React, { useState } from "react";
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, Paper, Stack, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import { AccessTime, LocationOn } from "@mui/icons-material";
import { MatchResponse } from "../../../api/match/matchResponse";
import { TeamInfo } from "../../../api/teams/TeamRequest";
import { MatchResult } from "../../../api/ball_user/types";

interface Props {
  match: MatchResponse;
  teamAInfo?: TeamInfo;
  teamBInfo?: TeamInfo;
  liveMatchData?: MatchResult | null;
}

const MatchDetails: React.FC<Props> = ({ match, teamAInfo, teamBInfo, liveMatchData }) => {
  const teamA = match?.teamA ?? {};
  const teamB = match?.teamB ?? {};

  const [viewTeam, setViewTeam] = useState<{ name: string; players: any[] } | undefined>(undefined);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleViewTeam = (teamId: number) => {
    let teamName = "";
    let players: any[] = [];
    let captainId = 0;
    let viceCaptainId = 0;
    let wicketKeeperId = 0;

    // Check live match data first (has accurate match-specific roles)
    if (liveMatchData) {
      if (liveMatchData.teamAId === teamId) {
        teamName = liveMatchData.teamA;
        players = liveMatchData.teamAPlayers || [];
      } else if (liveMatchData.teamBId === teamId) {
        teamName = liveMatchData.teamB;
        players = liveMatchData.teamBPlayers || [];
      }
    } else {
      // Fallback to static info
      let info: TeamInfo | undefined;
      if (teamA.teamId === teamId) info = teamAInfo;
      else if (teamB.teamId === teamId) info = teamBInfo;

      if (info) {
        teamName = info.name;
        players = info.players.map(p => ({
          ...p,
          isCaptain: info?.captainId === p.id,
          isViceCaptain: info?.viceCaptainId === p.id
          // TeamInfo doesn't track WK usually unless added to logic, but we can stick to C/VC
        }));
      }
    }

    if (players.length > 0) {
      setViewTeam({ name: teamName, players });
      setOpenViewDialog(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with team logos */}
      <Grid container spacing={4} sx={{ mb: 4, textAlign: "center" }}>
        <Grid size={{ sm: 12, md: 6 }}>
          <Paper
            sx={{
              position: "relative",
              p: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 2,
            }}
          >
            {/* Background overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: teamA.colorCode || "#f44336",
                backgroundImage: teamA.bgImageUrl ? `url(${teamA.bgImageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.3,
                zIndex: 0,
              }}
            />
            {/* Foreground content */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Avatar
                src={teamA.logUrl}
                alt={`${teamA.teamName} logo`}
                sx={{ width: 80, height: 80, border: 2, borderColor: "#fff", mb: 2 }}
              />
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
                {teamA.teamName || "Team A"}
              </Typography>
            </Box>
          </Paper>

        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <Paper
            sx={{
              position: "relative",
              p: 4,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 2,
            }}
          >
            {/* Background overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: teamB.colorCode || "#f44336",
                backgroundImage: teamB.bgImageUrl ? `url(${teamB.bgImageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.3,
                zIndex: 0,
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Avatar
                src={teamB.logUrl}
                alt={`${teamB.teamName} logo`}
                sx={{ width: 80, height: 80, border: 2, borderColor: "#fff", mb: 2 }}
              />
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
                {teamB.teamName || "Team A"}
              </Typography>
            </Box>
          </Paper>

        </Grid>
      </Grid>

      {/* Match Header */}
      <Card sx={{ mb: 4, backgroundColor: "#0D47A1", color: "#fff", borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", }}>
            {match?.tournamentName || "Indian Premier League 2025"}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: "bold" }}>
              {teamA.teamName || "Team A"} vs {teamB.teamName || "Team B"}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid size={{ sm: 12, md: 6 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                {match?.startTime ? new Date(match.startTime).toLocaleString() : "-"}
              </Typography>
            </Grid>
            <Grid size={{ sm: 12, md: 6 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                {match?.venue || "-"}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2 }}>
              Umpires
            </Typography>
            <Grid container spacing={2}>
              {/* Ground Umpire 1 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {match.groundUmpire1?.[0] || "G1"}
                  </Avatar>
                  <Stack direction="column">
                    <Typography variant="body1">
                      {"Ground Umpire 1"}
                    </Typography>
                    <Typography variant="body1">
                      {match.groundUmpire1 || "--"}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              {/* Ground Umpire 2 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {match.groundUmpire2?.[0] || "G2"}
                  </Avatar>
                  <Stack direction="column">
                    <Typography variant="body1">
                      {"Ground Umpire 2"}
                    </Typography>
                    <Typography variant="body1">
                      {match.groundUmpire2 || "--"}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              {/* Third Umpire */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {match.thirdUmpire?.[0] || "T"}
                  </Avatar>
                  <Stack direction="column">
                    <Typography variant="body1">
                      {"Third Umpire"}
                    </Typography>
                    <Typography variant="body1">
                      {match.thirdUmpire || "--"}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

        </CardContent>
      </Card>



      {/* Team Squads */}
      <Grid container spacing={4}>
        {[teamA, teamB].map((team, idx) => (
          <Grid size={{ sm: 12, md: 6 }} key={idx}>
            <Card
              sx={{
                backgroundColor: team.colorCode || "#333",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {team.teamName}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewTeam(team.teamId)}
                sx={{ borderColor: "#fff", color: "#fff", "&:hover": { borderColor: "#fff", backgroundColor: "#fff", color: "#333" } }}
              >
                View
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>


      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewTeam?.name || "Team Players"}</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Badges</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewTeam?.players?.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.role}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {player.isCaptain && <Chip label="C" color="primary" size="small" />}
                        {player.isViceCaptain && <Chip label="VC" color="success" size="small" />}
                        {(player.isWicketKeeper || player.role === 'WICKET_KEEPER') && <Chip label="WK" color="secondary" size="small" />}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!viewTeam?.players?.length && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No players found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Box p={2} display="flex" justifyContent="flex-end">
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MatchDetails;
