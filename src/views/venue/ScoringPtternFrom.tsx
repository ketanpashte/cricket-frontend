import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { VenueScoringDto } from "../../api/venue/types";
import { VenueService } from "../../api/venue/api";

const VenueScoringForm: React.FC<{ venueId: number, onClose: () => void }> = ({ venueId, onClose }) => {
  const venueService = new VenueService();

  const [formData, setFormData] = useState<VenueScoringDto>({
    totalMatches: 0,
    winBatFirst: 0,
    winBowlSecond: 0,
    firstInningBattingAvgScore: 0,
    secondInningBattingAvgScore: 0,
    highestTotal: 0,
  });

  const [loading, setLoading] = useState<boolean>(!!venueId);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await venueService.getVenueById(Number(venueId));
        if (response?.data) {
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Failed to load venue scoring", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async () => {
    try {
      await venueService.updatePatternByVenueId(Number(venueId), formData);
      onClose();
    } catch (error) {
      console.error("Failed to save venue scoring", error);
      alert("Failed to save venue scoring");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        {venueId ? "Edit Venue Scoring" : "Add Venue Scoring"}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Total Matches"
            name="totalMatches"
            type="number"
            value={formData.totalMatches}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Win Bat First"
            name="winBatFirst"
            type="number"
            value={formData.winBatFirst}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Win Bowl Second"
            name="winBowlSecond"
            type="number"
            value={formData.winBowlSecond}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="1st Innings Avg Score"
            name="firstInningBattingAvgScore"
            type="number"
            value={formData.firstInningBattingAvgScore}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="2nd Innings Avg Score"
            name="secondInningBattingAvgScore"
            type="number"
            value={formData.secondInningBattingAvgScore}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Highest Total"
            name="highestTotal"
            type="number"
            value={formData.highestTotal}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default VenueScoringForm;
