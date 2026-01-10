import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { teamServcie } from "../../api/teams/teams.api";
import playerApi from "../../api/players/playerApi";
import { PlayerInfo } from "../../api/ball_user/types";
import debounce from "lodash.debounce";
import { Nationality, PlayerRole } from "../../utils/type";

const TeamPlayerManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamPlayers, setTeamPlayers] = useState<PlayerInfo[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<number | null>(null);

  const handleToggleAll = () => {
    const visibleIds = searchResults.map((player) => player.id);
    const areAllSelected = visibleIds.every((id) => selectedPlayerIds.includes(id));

    if (areAllSelected) {
      setSelectedPlayerIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      setTeamPlayers((prev) => prev.filter((p) => !visibleIds.includes(p.id)));

      if (visibleIds.includes(captainId!)) setCaptainId(null);
      if (visibleIds.includes(viceCaptainId!)) setViceCaptainId(null);
    } else {
      // Select all visible
      const newSelectedIds = [...new Set([...selectedPlayerIds, ...visibleIds])];
      setSelectedPlayerIds(newSelectedIds);

      // Add missing players from searchResults to teamPlayers
      const newPlayers = searchResults.filter(
        (p) => !teamPlayers.some((tp) => tp.id === p.id)
      );
      setTeamPlayers((prev) => [...prev, ...newPlayers]);
    }
  };


  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");

  // ✅ Fetch team players on mount
  useEffect(() => {
    if (!id) return;

    const fetchTeamPlayers = async () => {
      setLoading(true);
      try {
        const res = await teamServcie.getPlayers(Number(id));
        const response = res.data.data;

        setTeamPlayers(response.players);
        setSelectedPlayerIds(response.players.map((p: any) => p.id));

        if (response.captainId) setCaptainId(response.captainId);
        if (response.viceCaptainId) setViceCaptainId(response.viceCaptainId);
      } catch (err) {
        console.error(err);
        setError("Failed to load team players");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamPlayers();
  }, [id]);

  // ✅ Debounced player search
  const debouncedSearch = useCallback(
    debounce(async (query: string, role: string, nationality: string) => {
      setSearchLoading(true);
      try {
        const res = await playerApi.queryPlayers({
          search: query || undefined,
          role: role || undefined,
          nationality: nationality || undefined,
        });
        setSearchResults(res.data.data);
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery, roleFilter, nationalityFilter);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, roleFilter, nationalityFilter, debouncedSearch]);

  // ✅ Select / Deselect player
  const togglePlayer = (player: PlayerInfo) => {
    if (selectedPlayerIds.includes(player.id)) {
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== player.id));
      setTeamPlayers((prev) => prev.filter((p) => p.id !== player.id));
      if (captainId === player.id) setCaptainId(null);
      if (viceCaptainId === player.id) setViceCaptainId(null);
    } else {
      setSelectedPlayerIds((prev) => [...prev, player.id]);
      setTeamPlayers((prev) => [...prev, player]);
      if (!captainId) setCaptainId(player.id);
    }
  };

  // ✅ Save team players
  const handleSave = async () => {
    if (!id) return;
    if (!captainId || !viceCaptainId) {
      alert("Please select both Captain and Vice-Captain before saving.");
      return;
    }
    if (captainId === viceCaptainId) {
      alert("Captain and Vice-Captain cannot be the same player.");
      return;
    }

    setSaving(true);
    try {
      await teamServcie.addPlayers(selectedPlayerIds, Number(id), captainId, viceCaptainId);
      navigate("/teams");
    } catch (err) {
      console.error(err);
      alert("Failed to update team players.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={6}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth="1200px" mx="auto" py={4}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Team Setup
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate("/teams")}>
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Team"}
            </Button>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />

        {/* Filters */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          <TextField
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          <TextField
            select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(PlayerRole).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Nationality"
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(Nationality).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {/* Table View */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={
                      searchResults.some((p) => selectedPlayerIds.includes(p.id)) &&
                      !searchResults.every((p) => selectedPlayerIds.includes(p.id))
                    }
                    checked={
                      searchResults.length > 0 &&
                      searchResults.every((p) => selectedPlayerIds.includes(p.id))
                    }
                    onChange={handleToggleAll}
                  />
                </TableCell>
                <TableCell>Player</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Captain</TableCell>
                <TableCell align="center">Vice-Captain</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {searchLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                searchResults.map((player) => {
                  const isSelected = selectedPlayerIds.includes(player.id);
                  return (
                    <TableRow key={player.id} hover>
                      {/* Select Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => togglePlayer(player)}
                        />
                      </TableCell>

                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.role}</TableCell>

                      {/* Captain Select */}
                      <TableCell align="center">
                        <Checkbox
                          checked={captainId === player.id}
                          disabled={!isSelected || viceCaptainId === player.id}
                          onChange={() => setCaptainId(player.id)}
                        />
                      </TableCell>

                      {/* Vice Captain Select */}
                      <TableCell align="center">
                        <Checkbox
                          checked={viceCaptainId === player.id}
                          disabled={!isSelected || captainId === player.id}
                          onChange={() => setViceCaptainId(player.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TeamPlayerManagementPage;
