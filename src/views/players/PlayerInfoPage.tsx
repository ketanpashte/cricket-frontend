import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Grid,
    Stack,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    useTheme,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import playerApi from '../../api/players/playerApi';
import { PlayerInfoFull } from '../../api/players/res/players';

type Params = {
    id: string;
};

const PlayerInfoPage: React.FC = () => {
    const theme = useTheme();
    const { id } = useParams<Params>();
    const [player, setPlayer] = useState<PlayerInfoFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await playerApi.getPlayerInfoFull(Number(id));
                setPlayer(response.data.data);
            } catch (err) {
                console.error('Failed to fetch player:', err);
                setError('Failed to load player information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4} maxWidth={600} mx="auto">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!player) {
        return (
            <Box p={4} maxWidth={600} mx="auto">
                <Alert severity="warning">No player data found.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <Card sx={{ p: { xs: 3, sm: 4 }, maxWidth: 960, mx: 'auto', borderRadius: 4, boxShadow: 6 }}>
                <Stack spacing={2}>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Player Information
                    </Typography>
                    <Divider />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Full Name</Typography>
                            <Typography>{player.fullName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Short Name</Typography>
                            <Typography>{player.shortName}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Nationality</Typography>
                            <Typography>{player.nationality}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Role</Typography>
                            <Typography>{player.role}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Batting Style</Typography>
                            <Typography>{player.battingStyle}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Bowling Style</Typography>
                            <Typography>{player.bowlingStyle}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Total Matches</Typography>
                            <Typography>{player.totalMatches}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Total Runs</Typography>
                            <Typography>{player.totalRuns}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Total Wickets</Typography>
                            <Typography>{player.totalWickets}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Typography variant="subtitle2">Status</Typography>
                            <Chip
                                label={player.active ? 'Active' : 'Inactive'}
                                color={player.active ? 'success' : 'default'}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Card>
        </Box>
    );
};

export default PlayerInfoPage;
