import React, { useState } from "react";
import { Typography, Paper, Stack, Avatar, Divider, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, Box, CircularProgress } from "@mui/material";
import { teamServcie } from "../../../api/teams/teams.api";
import { TeamInfo } from "../../../api/teams/TeamRequest";

type Group = {
  id: number;
  name: string;
  teams: {
    teamId: number;
    teamName: string;
    logUrl?: string;
  }[];
};

type Props = {
  isGroup?: boolean;
  teams?: {
    teamId: number;
    teamName: string;
    logUrl?: string;
  }[];
  groups?: Group[];
};

const ParticipatingTeams: React.FC<Props> = ({ isGroup, teams, groups }) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [openDialog, setDialogOpen] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  const handleTeamClick = async (teamId: number) => {
    setLoadingTeam(true);
    setDialogOpen(true);
    setSelectedTeam(null); // Clear previous
    try {
      const res = await teamServcie.getTeamInfo(teamId);
      setSelectedTeam(res.data.data);
    } catch (e) {
      console.error("Failed to fetch team info", e);
    } finally {
      setLoadingTeam(false);
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Participating Teams
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 2, mt: 1, display: "flex", flexDirection: "column", gap: 3 }}
      >
        {isGroup && groups && groups.length ? (
          groups.map((group) => (
            <Stack key={group.id} spacing={1}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "primary.main" }}
              >
                {group.name}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                {group.teams.length ? (
                  group.teams.map((team) => (
                    <Stack
                      key={team.teamId}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      onClick={() => handleTeamClick(team.teamId)}
                      sx={{
                        border: "1px solid #ddd",
                        p: 1,
                        borderRadius: 2,
                        minWidth: 150,
                        cursor: 'pointer',
                        transition: '0.2s',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Avatar src={team.logUrl || ""} sx={{ width: 32, height: 32 }} />
                      <Typography>{team.teamName}</Typography>
                    </Stack>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No teams in this group.
                  </Typography>
                )}
              </Stack>
              <Divider sx={{ my: 1 }} />
            </Stack>
          ))
        ) : teams && teams.length ? (
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {teams.map((team) => (
              <Stack
                key={team.teamId}
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => handleTeamClick(team.teamId)}
                sx={{
                  border: "1px solid #ddd",
                  p: 1,
                  borderRadius: 2,
                  minWidth: 150,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <Avatar src={team.logUrl || ""} sx={{ width: 32, height: 32 }} />
                <Typography>{team.teamName}</Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography>No teams added.</Typography>
        )}
      </Paper>

      {/* Team Players Dialog */}
      <Dialog open={openDialog} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {loadingTeam ? "Loading..." : selectedTeam?.name || "Team Players"}
        </DialogTitle>
        <DialogContent dividers>
          {loadingTeam ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
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
                  {selectedTeam?.players?.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.role}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {selectedTeam.captainId === player.id && <Chip label="C" color="primary" size="small" />}
                          {selectedTeam.viceCaptainId === player.id && <Chip label="VC" color="success" size="small" />}
                          {player.role === 'WICKET_KEEPER' && <Chip label="WK" color="secondary" size="small" />}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!selectedTeam?.players?.length && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No players found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <Box p={2} display="flex" justifyContent="flex-end">
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </Box>
      </Dialog >
    </>
  );
};

export default ParticipatingTeams;
// 