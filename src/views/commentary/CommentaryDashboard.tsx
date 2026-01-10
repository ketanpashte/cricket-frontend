import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    Stack,
    CircularProgress,
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MatchService } from '../../api/match/matches.api';
import { MatchResponse } from '../../api/match/matchResponse';
import { AppButton } from '../../components';

const CommentaryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const matchService = new MatchService();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const data = await matchService.queryMatches();
                setMatches(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const handleMatchClick = (match: MatchResponse) => {
        if (!match.liveMatchId) {
            alert("This match has not started or does not have a live ID.");
            return;
        }
        navigate(`/commentary/match/${match.liveMatchId}`);
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Commentary
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3}>
                    {matches.length === 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Typography>No matches found.</Typography>
                        </Grid>
                    )}
                    {matches.map((match) => (
                        <Grid size={{ xs: 12, md: 6 }} key={match.id}>
                            <Card sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }} onClick={() => handleMatchClick(match)}>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" fontWeight="bold">
                                            {match.teamA?.teamName} vs {match.teamB?.teamName}
                                        </Typography>
                                        <Chip
                                            label={match.matchStatus}
                                            color={match.matchStatus === 'IN_PROGRESS' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {match.tournamentName || "Tournament details not available"}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        Venue: {match.venue || "N/A"}
                                    </Typography>
                                    <AppButton variant="outlined" size="small">
                                        View Commentary
                                    </AppButton>
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CommentaryDashboard;
