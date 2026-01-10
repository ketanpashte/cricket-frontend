import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teamServcie } from "../../api/teams/teams.api";
import { TeamInfo } from "../../api/teams/TeamRequest";
import {
  Box,
  Card,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Stack,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material";
import { AppLink, AppButton } from "../../components";
import { Edit, GroupAdd } from "@mui/icons-material";

const TeamInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No team ID provided");
      setLoading(false);
      return;
    }

    const fetchTeam = async () => {
      try {
        const response = await teamServcie.getTeamInfo(Number(id));
        setTeam(response.data.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load team information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

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

  if (!team) {
    return (
      <Box sx={{ mt: 6 }}>
        <Alert severity="info">No team data available.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* ✅ Team Header with background image & full info */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          mb: 4,
          boxShadow: 4,
        }}
      >
        {team.bgImage && (
          <Box
            sx={{
              backgroundImage: `url(${team.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: 260,
              filter: "brightness(0.6)",
            }}
          />
        )}

        {/* Overlay Content */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{
            position: "absolute",
            bottom: 20,
            left: 20,
            color: "white",
          }}
        >
          <Avatar
            src={team.logoUrl}
            alt={team.name}
            variant="rounded"
            sx={{
              width: 100,
              height: 100,
              border: "3px solid white",
              boxShadow: 4,
              bgcolor: team.colorCode || "primary.main",
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {team.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
              #{team.shortCode}
            </Typography>

            <Stack direction="row" spacing={4} mt={1}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Coach
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {team.coach || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Captain
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {team.captainName || `Player #${team.captainId}`}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>


      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color={team.colorCode || "primary.main"}
          >
            Team Overview
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Edit Basic Info">
              <AppButton
                component={AppLink}
                to={`/teams/edit/${team.id}`}
                variant="outlined"
                color="primary"
                startIcon={<Edit />}
              >
                Edit Info
              </AppButton>
            </Tooltip>

            <Tooltip title="Manage Players">
              <AppButton
                component={AppLink}
                to={`/teams/players/${team.id}`}
                variant="contained"
                color="secondary"
                startIcon={<GroupAdd />}
              >
                Manage Players
              </AppButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Team Info Section */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Coach
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {team.coach || "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Captain
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {team.captainName || `Player #${team.captainId}`}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Squad Players */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          color={team.colorCode || "primary.main"}
        >
          Squad Players
        </Typography>

        {team.players && team.players.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: team.colorCode || "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Player Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>Nationality</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">
                    Captain
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }} align="center">
                    Vice-Captain
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team.players.map((player) => {
                  const isCaptain = team.captainId === player.id;
                  const isViceCaptain = (team as any).viceCaptainId === player.id;
                  return (
                    <TableRow
                      key={player.id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {player.name}
                        </Stack>
                      </TableCell>
                      <TableCell>{(player as any).role || "N/A"}</TableCell>
                      <TableCell>{(player as any).nationality || "N/A"}</TableCell>
                      <TableCell align="center">
                        {isCaptain && <Chip label="Captain" color="success" size="small" />}
                      </TableCell>
                      <TableCell align="center">
                        {isViceCaptain && <Chip label="Vice-Captain" color="info" size="small" />}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ mt: 2 }}>No players selected.</Typography>
        )}
      </Card>
    </Box>
  );
};

export default TeamInfoPage;
