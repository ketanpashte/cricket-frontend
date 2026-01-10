import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppStore } from '../../store';
import { MatchService } from '../../api/match/matches.api';
import { MatchResponse } from '../../api/match/matchResponse';
import { MatchSession } from '../../api/match/matchSession';
import { AppLoading } from '../../components';

const MatchSessionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [state, dispatch] = useAppStore();
    const matchService = useRef<MatchService>(new MatchService(dispatch)).current;

    const [match, setMatch] = useState<MatchResponse | null>(null);
    const [session, setSession] = useState<MatchSession>({
        matchId: Number(id),
        team1Min: 0, team1Max: 0,
        team2Min: 0, team2Max: 0,
        drawMin: 0, drawMax: 0,
        sessionOver: 0, sessionMinScore: 0, sessionMaxScore: 0,
        lambiMinScore: 0, lambiMaxScore: 0,
    });
    const [loading, setLoading] = useState(true);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const sessionRef = useRef(session);

    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const matchRes = await matchService.getMatchInfoInfo(Number(id));
                    setMatch(matchRes);
                    const sessionRes = await matchService.getMatchSession(Number(id));
                    if (sessionRes) {
                        setSession(prev => ({ ...prev, ...sessionRes }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, matchService]);

    const handleInputChange = (field: keyof MatchSession, value: string) => {
        let numValue = parseFloat(value);
        if (isNaN(numValue)) numValue = 0;
        setSession((prev) => ({ ...prev, [field]: numValue }));
    };

    const adjustValue = (amount: number) => {
        if (focusedField && focusedField in session) {
            setSession((prev) => {
                const val = prev[focusedField as keyof MatchSession] as number || 0;
                const newVal = val + amount;
                return { ...prev, [focusedField]: Number((newVal).toFixed(2)) };
            });
        }
    };

    const handleSubmitRate = async () => {
        try {
            if (match?.id) {
                await matchService.createOrUpdateSession(match.id, session);
                dispatch({ type: 'SHOW_ALERT', payload: { type: 'success', message: 'Rates saved successfully' } });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveRate = async () => {
        try {
            if (match?.id) {
                await matchService.removeRate(match.id);
                setSession(prev => ({
                    ...prev,
                    team1Min: 0, team1Max: 0,
                    team2Min: 0, team2Max: 0,
                    drawMin: 0, drawMax: 0
                }));
                dispatch({ type: 'SHOW_ALERT', payload: { type: 'success', message: 'Rates removed successfully' } });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateSessionScore = async () => {
        try {
            if (match?.id) {
                await matchService.createOrUpdateSession(match.id, session);
                dispatch({ type: 'SHOW_ALERT', payload: { type: 'success', message: 'Session Score updated successfully' } });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSetZeroSession = async () => {
        try {
            if (match?.id) {
                await matchService.resetSessionScore(match.id);
                setSession(prev => ({
                    ...prev,
                    sessionOver: 0,
                    sessionMinScore: 0,
                    sessionMaxScore: 0
                }));
                dispatch({ type: 'SHOW_ALERT', payload: { type: 'success', message: 'Session Score reset successfully' } });
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <AppLoading />;
    if (!match) return <Typography>Match not found</Typography>;

    const headerDate = dayjs(match.startTime).format('DD/MMM/YYYY , hh:mm A');
    const headerText = `Match Number - M${match.id} - ${headerDate}`;

    const renderRateRow = (label: string, minField: keyof MatchSession, maxField: keyof MatchSession) => (
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center" sx={{ mb: 2 }}>
            <Box flex={1} minWidth="150px">
                <Typography variant="subtitle1">{label}</Typography>
            </Box>
            <Box flex={1}>
                <TextField
                    label="Min"
                    fullWidth
                    value={session[minField] || 0}
                    onChange={(e) => handleInputChange(minField, e.target.value)}
                    onFocus={() => setFocusedField(minField)}
                    type="number"
                    inputProps={{ step: "0.01" }}
                />
            </Box>
            <Box flex={1}>
                <TextField
                    label="Max"
                    fullWidth
                    value={session[maxField] || 0}
                    onChange={(e) => handleInputChange(maxField, e.target.value)}
                    onFocus={() => setFocusedField(maxField)}
                    type="number"
                    inputProps={{ step: "0.01" }}
                />
            </Box>
            <Box display="flex" gap={1}>
                <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(1)}>+</Button>
                <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(-1)}>-</Button>
            </Box>
        </Box>
    );

    return (
        <Box p={4}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                    {headerText}
                </Typography>

                {/* Rates Section */}
                {renderRateRow(match.teamA.teamName, 'team1Min', 'team1Max')}
                {renderRateRow(match.teamB.teamName, 'team2Min', 'team2Max')}
                {renderRateRow('Draw', 'drawMin', 'drawMax')}

                <Box sx={{ mt: 2, mb: 4, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmitRate}>Submit</Button>
                    <Button variant="outlined" color="secondary" onClick={handleRemoveRate}>Remove Rate</Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Session Score Section */}
                <Typography variant="h6" gutterBottom>Session Score</Typography>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box flex={1}>
                        <TextField
                            label="Over"
                            fullWidth
                            value={session.sessionOver || 0}
                            onChange={(e) => handleInputChange('sessionOver', e.target.value)}
                            onFocus={() => setFocusedField('sessionOver')}
                            type="number"
                        />
                    </Box>
                    <Box flex={1}>
                        <TextField
                            label="Min Score"
                            fullWidth
                            value={session.sessionMinScore || 0}
                            onChange={(e) => handleInputChange('sessionMinScore', e.target.value)}
                            onFocus={() => setFocusedField('sessionMinScore')}
                            type="number"
                        />
                    </Box>
                    <Box flex={1}>
                        <TextField
                            label="Max Score"
                            fullWidth
                            value={session.sessionMaxScore || 0}
                            onChange={(e) => handleInputChange('sessionMaxScore', e.target.value)}
                            onFocus={() => setFocusedField('sessionMaxScore')}
                            type="number"
                        />
                    </Box>
                    <Box display="flex" gap={1}>
                        <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(1)}>+</Button>
                        <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(-1)}>-</Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 2, mb: 4, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="secondary" onClick={handleSetZeroSession}>Set 0</Button>
                    <Button variant="contained" color="primary" onClick={handleUpdateSessionScore}>Update Sess Score</Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Lambi Section */}
                <Typography variant="h6" gutterBottom>Lambi</Typography>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box flex={1} minWidth="150px">
                        <Typography>Lambi</Typography>
                    </Box>
                    <Box flex={1}>
                        <TextField
                            label="Min Score"
                            fullWidth
                            value={session.lambiMinScore || 0}
                            onChange={(e) => handleInputChange('lambiMinScore', e.target.value)}
                            onFocus={() => setFocusedField('lambiMinScore')}
                            type="number"
                        />
                    </Box>
                    <Box flex={1}>
                        <TextField
                            label="Max Score"
                            fullWidth
                            value={session.lambiMaxScore || 0}
                            onChange={(e) => handleInputChange('lambiMaxScore', e.target.value)}
                            onFocus={() => setFocusedField('lambiMaxScore')}
                            type="number"
                        />
                    </Box>
                    <Box display="flex" gap={1}>
                        <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(1)}>+</Button>
                        <Button variant="contained" sx={{ minWidth: '40px' }} onClick={() => adjustValue(-1)}>-</Button>
                    </Box>
                </Box>

            </Paper>
        </Box>
    );
};

export default MatchSessionPage;
