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
  Grid,
  Button,
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { AppLink } from '../../components';
import { useEffect, useState, useCallback } from 'react';
import { ShortTournamentResponse } from '../../api/tournamnet/tournamentResponse';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { tournamentService } from '../../api/tournamnet/tournament.api';

const ManageTournamentsPage = () => {
  const theme = useTheme();
  const [tournamentInfo, setTournamentInfo] = useState<ShortTournamentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  const fetchTournaments = useCallback(
    async (search?: string) => {
      try {
        setLoading(true);
        const res = await tournamentService.queryTournament(search);
        setTournamentInfo(res.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load Series.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTournaments(debouncedSearch);
  }, [debouncedSearch, fetchTournaments]);


  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    tournamentService.deleteTournament(id).then(() => fetchTournaments());
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4} color={theme.palette.primary.main}>
        Manage Series
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          width={'100%'}
          mb={2}
          flexWrap="wrap"
        >
          <Typography variant="h6">Series List</Typography>

          <Stack direction="row" spacing={2} alignItems="center">

            <TextField
              variant="outlined"
              size="small"
              label="Search Series"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              component={AppLink}
              to="/tournaments/new"
            >
              Create Series
            </Button>
          </Stack>

        </Stack>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : tournamentInfo.length === 0 ? (
          <Alert severity="info">No Series found.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tournamentInfo.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <img src={t.image} alt={t.name} style={{ width: 50, height: 50 }} />
                    </TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.tournamentStatus}
                        color={
                          t.tournamentStatus === 'UP_COMING' ? 'info' :
                            t.tournamentStatus === 'FINISHED' ? 'default' :
                              t.tournamentStatus === 'LIVE' ? 'success' :
                                'default'
                        }
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{new Date(t.startDate).toDateString()}</TableCell>
                    <TableCell>{new Date(t.endDate).toDateString()}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton component={AppLink} to={`/tournaments/${t.id}`} size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton component={AppLink} to={`/tournaments/edit/${t.id}`} size="small" color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDelete(t.id)} size="small">
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

export default ManageTournamentsPage;
