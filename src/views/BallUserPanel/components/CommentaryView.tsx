import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
    CircularProgress,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Comment } from '@mui/icons-material';
import { Commentary, commentaryService } from '../../../api/match/commentary.api';
import { AppButton } from '../../../components';

const CommentaryView: React.FC = () => {
    const { id: matchId } = useParams<{ id: string }>();
    const [commentaries, setCommentaries] = useState<Commentary[]>([]);
    const [loading, setLoading] = useState(false);
    const [editItem, setEditItem] = useState<Commentary | null>(null);
    const [editText, setEditText] = useState('');

    const fetchCommentary = async () => {
        if (!matchId) return;
        try {
            setLoading(true);
            const res = await commentaryService.getCommentary(matchId);
            if (res.data.success) {
                setCommentaries(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch commentary", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommentary();
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

    // Group by over
    // Since the list comes ordered by over desc, ball desc, we can render it straight.
    // Actually, typically commentary is grouped by over in UI: "End of Over 2" etc.

    // Let's render ball by ball for now, similar to cricbuzz screenshot.

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Match Commentary</Typography>
                <AppButton startIcon={<RefreshIcon />} onClick={fetchCommentary} variant="outlined" size="small">
                    Refresh
                </AppButton>
            </Stack>

            {loading && commentaries.length === 0 ? (
                <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
            ) : (
                <Stack spacing={2}>
                    {commentaries.map((item) => (
                        <Paper key={item.id} sx={{ p: 2, borderLeft: '4px solid', borderColor: getBorderColor(item.runs) }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 40 }}>
                                    {item.overNumber - 1}.{item.ballNumber}
                                </Typography>
                                <Box flex={1}>
                                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.bowlerName} to {item.batterName}
                                        </Typography>
                                        {getRunBadge(item.runs)}
                                    </Stack>
                                    <Typography variant="body1">
                                        {item.commentaryText}
                                    </Typography>
                                </Box>
                                {/* Only allow edit if authorized, assuming admin is using this panel */}
                                <IconButton size="small" onClick={() => handleEditClick(item)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Paper>
                    ))}
                    {commentaries.length === 0 && (
                        <Typography color="text.secondary" align="center">No commentary available yet.</Typography>
                    )}
                </Stack>
            )}

            {/* Edit Dialog */}
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

// Helpers
const getBorderColor = (runs: string) => {
    if (runs === 'W') return '#d32f2f'; // Red if wicket
    if (runs === '4' || runs === '6') return '#2e7d32'; // Green if boundary
    return '#1976d2'; // Default blue
};

const getRunBadge = (runs: string) => {
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
    if (runs === 'W') color = "error";
    else if (['4', '6'].includes(runs)) color = "success";
    else if (['Wd', 'NB'].includes(runs)) color = "warning";

    return <Chip label={runs} size="small" color={color} variant="outlined" sx={{ fontWeight: 'bold' }} />
};

export default CommentaryView;
