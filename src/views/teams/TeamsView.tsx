import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import { AppButton, AppLink } from '../../components';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { TeamInfo } from '../../api/teams/TeamRequest';
import { teamServcie } from '../../api/teams/teams.api';

const ManageTeamsPage = () => {
  const theme = useTheme();
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  const fetchTeams = useCallback(async (query: string = '') => {
    setLoading(true);
    try {
      const response = await teamServcie.queryTeams(query);
      setTeams(response.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (teamId: number) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await teamServcie.deleteTeam(teamId);
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (err) {
      alert('Failed to delete team. Please try again.');
    }
  };

  useEffect(() => {
    fetchTeams(debouncedSearch);
  }, [debouncedSearch, fetchTeams]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          width: '100%',
          maxWidth: 1200,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={{ xs: 2, md: 0 }}
          mb={3}
          flexWrap="wrap"
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            Manage Teams
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <TextField
              variant="outlined"
              size="small"
              label="Search Teams"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <Tooltip title="Add New Team">
              <AppButton
                color="primary"
                component={AppLink}
                to="/teams/new"
                variant="contained"
                startIcon={<Add />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Team
              </AppButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : teams.length === 0 ? (
          <Alert severity="info">No teams found.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Short Code</TableCell>
                  <TableCell>Captain</TableCell>
                  <TableCell align="right" sx={{ width: 160 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id} hover>
                    <TableCell>
                      {team.logoUrl ? (
                        <img
                          src={team.logoUrl}
                          alt={`${team.name} logo`}
                          style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.grey[300],
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={team.shortCode}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{team.captainName || '-'}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View Team">
                          <IconButton
                            component={AppLink}
                            to={`/teams/${team.id}`}
                            aria-label="view"
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Team">
                          <IconButton
                            component={AppLink}
                            to={`/teams/edit/${team.id}`}
                            aria-label="edit"
                            color="primary"
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Team">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(team.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ManageTeamsPage;
