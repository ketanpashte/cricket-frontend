import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  Alert,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
} from '@mui/material';
import { Edit, Delete, Visibility, Settings } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { AppLink, AppLoading } from '../../components';
import { MatchResponse } from '../../api/match/matchResponse';
import { useAppStore } from '../../store';
import { MatchService } from '../../api/match/matches.api';

const ManageMatchesPage = () => {
  const theme = useTheme();
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [state, dispatch] = useAppStore();
  const matchService = useRef<MatchService>(new MatchService(dispatch)).current;

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await matchService.queryMatches();
      setMatches(res);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = (matchId: number) => {
    matchService.deleteMatch(matchId)
      .then(() => fetchMatches())
      .catch((error) => {
        dispatch({
          type: 'SHOW_ALERT',
          payload: { type: 'error', message: error.message || 'Failed to delete match' },
        });
      });
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <AppLoading />
      </Box>
    );
  }

  if (state.globalAlert?.message) {
    return (
      <Box p={4}>
        <Alert severity="error">{state.globalAlert?.message}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={3}
          py={2}
        >
          <Typography variant="h5" fontWeight="bold" color={theme.palette.primary.main}>
            Manage Matches
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={AppLink}
            to="/matches/new"
          >
            Add Match
          </Button>
        </Box>

        <Divider />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Teams</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Start Time</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id} hover>
                  <TableCell>{match.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={match.teamA.logUrl} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2">{match.teamA.teamName}</Typography>
                      <Typography variant="body2" color="text.secondary">vs</Typography>
                      <Avatar src={match.teamB.logUrl} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2">{match.teamB.teamName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={match.matchStatus}
                      color={
                        match.matchStatus === 'CANCELLED' ? 'error' :
                          match.matchStatus === 'COMPLETED' ? 'success' :
                            match.matchStatus === 'IN_PROGRESS' ? 'warning' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{dayjs(match.startTime).format('MMM D, YYYY hh:mm A')}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton component={AppLink} to={`/matches/${match.id}`}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {(match.matchStatus === 'NOT_STARTED' || match.matchStatus === 'IN_PROGRESS') && (
                      <Tooltip title="Set Session">
                        <IconButton component={AppLink} to={`/matches/session/${match.id}`} color="secondary">
                          <Settings />
                        </IconButton>
                      </Tooltip>
                    )}

                    {match.matchStatus === 'NOT_STARTED' && (
                      <Tooltip title="Edit">
                        <IconButton component={AppLink} to={`/matches/edit/${match.id}`} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => deleteMatch(match.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ManageMatchesPage;
