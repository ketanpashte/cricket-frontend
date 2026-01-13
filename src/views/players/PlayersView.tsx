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
} from '@mui/material';
import { AppButton, AppLink } from '../../components';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import playerApi from '../../api/players/playerApi';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ExportCsvButton from './ExportButton';
import ImportCsvButton from './ImportButton';
import { ShortPlayer } from '../../api/players/res/players';



const ManagePlayersPage = () => {
  const theme = useTheme();
  const [players, setPlayers] = useState<ShortPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');

  const fetchPlayers = useCallback(async (query: string = '', country: string = '') => {
    setLoading(true);
    try {
      const response = await playerApi.queryPlayers({
        search: query,
        nationality: country
      });
      setPlayers(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      const msg = err.response?.data?.message || err.message || 'Failed to load players.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const debouncedCountry = useDebouncedValue(countryQuery, 500);

  useEffect(() => {
    fetchPlayers(debouncedSearch, debouncedCountry);
  }, [debouncedSearch, debouncedCountry, fetchPlayers]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerApi.deletePlayer(id);
        fetchPlayers(searchQuery, countryQuery);
      } catch (err: any) {
        console.error("Delete failed", err);
        const serverMessage = err.response?.data?.message || err.message || 'Failed to delete player';
        setError(serverMessage);
      }
    }
  };

  return (
    <Box
      sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}
    >
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
          <ExportCsvButton
            url={process.env.REACT_APP_URL_API + "/players/export"}
            variant="outlined"
            color="primary"
          />
          <ImportCsvButton
            importUrl={process.env.REACT_APP_URL_API + "/players/import"}
            onImportSuccess={() => fetchPlayers(searchQuery, countryQuery)}
          />
        </Stack>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Manage Players
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <TextField
              variant="outlined"
              size="small"
              label="Search Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              variant="outlined"
              size="small"
              label="Search Country"
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              sx={{ minWidth: 200 }}
            />

            <AppButton
              component={AppLink}
              to="/players/new"
              variant="contained"
              color="primary"
              startIcon={<Add />}
            >
              Add
            </AppButton>
          </Stack>
        </Stack>
      </Paper>


      {/* Table Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : players.length === 0 ? (
          <Typography variant="body1" textAlign="center" py={4}>
            No players found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Nationality</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.role}</TableCell>
                    <TableCell>{player.nationality}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Player">
                          <IconButton
                            component={AppLink}
                            to={`/players/${player.id}`}
                            aria-label="view"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Player">
                          <IconButton
                            component={AppLink}
                            to={`/players/edit/${player.id}`}
                            aria-label="edit"
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Player">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(player.id)}
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

export default ManagePlayersPage;
