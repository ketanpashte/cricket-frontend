import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Grid, Divider, CircularProgress, Alert } from "@mui/material";
import { TournamnetInfoResponse } from "../../../api/tournamnet/tournamentResponse";
import { tournamentService } from "../../../api/tournamnet/tournament.api";

interface HighlightsSectionProps {
    tournament: TournamnetInfoResponse;
    onUpdate?: () => void;
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ tournament, onUpdate }) => {
    const [formData, setFormData] = useState({
        highlightMostRunsPlayer: "",
        highlightMostRunsValue: "",
        highlightMostWicketsPlayer: "",
        highlightMostWicketsValue: "",
        highlightBestFigurePlayer: "",
        highlightBestFigureValue: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (tournament) {
            setFormData({
                highlightMostRunsPlayer: tournament.highlightMostRunsPlayer || "",
                highlightMostRunsValue: tournament.highlightMostRunsValue || "",
                highlightMostWicketsPlayer: tournament.highlightMostWicketsPlayer || "",
                highlightMostWicketsValue: tournament.highlightMostWicketsValue || "",
                highlightBestFigurePlayer: tournament.highlightBestFigurePlayer || "",
                highlightBestFigureValue: tournament.highlightBestFigureValue || "",
            });
        }
    }, [tournament]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await tournamentService.updateHighlights(tournament.id, formData);
            setSuccess("Highlights updated successfully!");
            if (onUpdate) onUpdate();
        } catch (err) {
            setError("Failed to update highlights.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box mt={4} mb={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                Tournament Highlights
            </Typography>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Grid container spacing={3} alignItems="center">
                    {/* Best Batsman */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Best Batsman</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Best Batsman Name"
                            name="highlightMostRunsPlayer"
                            value={formData.highlightMostRunsPlayer}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Total Runs"
                            name="highlightMostRunsValue"
                            value={formData.highlightMostRunsValue}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Best Bowler */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Best Bowler</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Best Bowler Name"
                            name="highlightMostWicketsPlayer"
                            value={formData.highlightMostWicketsPlayer}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Wickets Taken"
                            name="highlightMostWicketsValue"
                            value={formData.highlightMostWicketsValue}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider />
                    </Grid>

                    {/* Best Figure */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Best Figure</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Best Figure Name"
                            name="highlightBestFigurePlayer"
                            value={formData.highlightBestFigurePlayer}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Figure (e.g., 5/20)"
                            name="highlightBestFigureValue"
                            value={formData.highlightBestFigureValue}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? "Saving..." : "Save Highlights"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default HighlightsSection;
