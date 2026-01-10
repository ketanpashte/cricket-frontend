import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    CircularProgress,
    Divider,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit as EditIcon, ArrowBack } from '@mui/icons-material';
import { MatchService } from '../../api/match/matches.api';
import { commentaryService, Commentary, OverSummary } from '../../api/match/commentary.api';
import { MatchResponse } from '../../api/match/matchResponse';
import { AppButton } from '../../components';

const CommentaryDetails: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const [match, setMatch] = useState<MatchResponse | null>(null);
    const [commentaries, setCommentaries] = useState<Commentary[]>([]);
    const [overSummaries, setOverSummaries] = useState<OverSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [editItem, setEditItem] = useState<Commentary | null>(null);
    const [editText, setEditText] = useState('');

    const matchService = new MatchService();

    useEffect(() => {
        const fetchData = async () => {
            if (!matchId) return;
            try {
                setLoading(true);

                // Fetch commentary
                const commRes = await commentaryService.getCommentary(matchId);
                if (commRes.data.success) {
                    setCommentaries(commRes.data.data);
                }

                // Fetch Over Summaries
                const sumRes = await commentaryService.getOverSummaries(matchId);
                if (sumRes.data.success) {
                    setOverSummaries(sumRes.data.data);
                }

                // Fetch matches
                const matchesList = await matchService.queryMatches();
                if (Array.isArray(matchesList)) {
                    const found = matchesList.find((m: MatchResponse) => m.liveMatchId === matchId);
                    if (found) setMatch(found);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [matchId]);

    const handleEditClick = (item: Commentary) => {
        setEditItem(item);
        setEditText(item.commentaryText);
    };

    const handleClose = () => {
        setEditItem(null);
        setEditText('');
    };

    const handleSave = async () => {
        if (!editItem) return;
        try {
            await commentaryService.updateCommentary(editItem.id, editText);
            setCommentaries(prev => prev.map(c => c.id === editItem.id ? { ...c, commentaryText: editText } : c));
            handleClose();
        } catch (error) {
            console.error("Failed to update commentary", error);
            alert("Failed to update commentary");
        }
    };

    // Grouping Logic
    const groupedCommentary = commentaries.reduce((acc, curr) => {
        const over = curr.overNumber;
        if (!acc[over]) acc[over] = [];
        acc[over].push(curr);
        return acc;
    }, {} as Record<number, Commentary[]>);

    const sortedOverNumbers = Object.keys(groupedCommentary).map(Number).sort((a, b) => b - a);

    if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 0, bgcolor: '#f4f5f7', minHeight: '100vh' }}>
            <Box sx={{ bgcolor: '#fff', p: 2, borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate('/commentary')}>
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {match ? `${match.teamA.teamName} vs ${match.teamB.teamName}` : 'Match Commentary'}
                        </Typography>
                        {match && (
                            <Typography variant="body2" color="text.secondary">
                                {match.matchStatus} | {match.tournamentName}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
                {commentaries.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>No commentary available yet.</Typography>
                    </Paper>
                )}

                {sortedOverNumbers.map(overNum => {
                    const balls = groupedCommentary[overNum];
                    const timeline = balls.map(b => b.runs).reverse().join(' ');
                    const timelineRuns = balls.reduce((sum, b) => {
                        if (b.runs === '4') return sum + 4;
                        if (b.runs === '6') return sum + 6;
                        if (['W', 'Wd', 'NB'].includes(b.runs)) return sum;
                        return sum + (parseInt(b.runs) || 0);
                    }, 0);

                    const summary = overSummaries.find(s => s.overNumber === overNum);

                    return (
                        <Box key={overNum} sx={{ mb: 3 }}>
                            {summary ? (
                                <Paper sx={{ bgcolor: '#eee', p: 2, mb: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            {timeline} ({timelineRuns} runs)
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            Score: {summary.teamTotalRuns}-{summary.teamTotalWickets}
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 1 }} />
                                    <Stack direction="row" alignItems="center" spacing={3}>
                                        <Typography variant="h3" fontWeight="bold">
                                            {overNum}
                                        </Typography>
                                        <Box flex={1}>
                                            <Typography variant="body2">
                                                <span style={{ fontWeight: 'bold' }}>{summary.strikerName}</span> {summary.strikerRuns}({summary.strikerBalls})
                                            </Typography>
                                            <Typography variant="body2">
                                                <span style={{ fontWeight: 'bold' }}>{summary.nonStrikerName}</span> {summary.nonStrikerRuns}({summary.nonStrikerBalls})
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2">
                                                <span style={{ fontWeight: 'bold' }}>{summary.bowlerName}</span> {summary.bowlerOvers}-{summary.bowlerMaidens}-{summary.bowlerRuns}-{summary.bowlerWickets}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            ) : (
                                <Paper square sx={{ bgcolor: '#e0e0e0', p: 1.5, borderLeft: '4px solid #333', mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                                        Over {overNum}
                                    </Typography>
                                    <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                                        (In Progress)
                                    </Typography>
                                </Paper>
                            )}

                            <Paper square elevation={0} sx={{ bgcolor: '#fff' }}>
                                {balls.map((item) => (
                                    <Box key={item.id}>
                                        <Stack direction="row" spacing={2} sx={{ p: 2, '&:hover': { bgcolor: '#f9f9f9' } }}>
                                            <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 40, color: '#333' }}>
                                                {item.overNumber - 1}.{item.ballNumber}
                                            </Typography>
                                            <Box flex={1}>
                                                <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
                                                    <span style={{ fontWeight: 600 }}>{item.bowlerName} to {item.batterName}, </span>
                                                    {item.commentaryText}
                                                </Typography>
                                            </Box>
                                            <Stack alignItems="center" spacing={0.5}>
                                                {item.runs === 'W' || ['4', '6'].includes(item.runs) ? (
                                                    <Chip label={item.runs} size="small" color={item.runs === 'W' ? 'error' : 'success'} sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                                                ) : null}
                                                <IconButton size="small" onClick={() => handleEditClick(item)} sx={{ opacity: 0.5 }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        <Divider light />
                                    </Box>
                                ))}
                            </Paper>
                        </Box>
                    );
                })}
            </Box>

            <Dialog open={!!editItem} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Commentary</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Commentary Text"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <AppButton onClick={handleClose} variant="text" color="secondary">Cancel</AppButton>
                    <AppButton onClick={handleSave} variant="contained" color="primary">Save</AppButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentaryDetails;
