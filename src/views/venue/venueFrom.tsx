import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { VenueRequest, VenueResponse } from "../../api/venue/types";
import { useNavigate, useParams } from "react-router-dom";
import { VenueService } from "../../api/venue/api";

const pitchTypes = ["Grass", "Matting", "Turf", "Hybrid"];

const VenueFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const venueService = new VenueService();

  const [formData, setFormData] = useState<VenueRequest>({
    name: "",
    city: "",
    country: "",
    address: "",
    capacity: 0,
    isIndoor: false,
    pitchType: "Grass",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      venueService
        .getVenueById(Number(id))
        .then((res) => {
          const venue: VenueResponse = res.data;
          setFormData({
            name: venue.name,
            city: venue.city,
            country: venue.country,
            address: venue.address,
            capacity: venue.capacity,
            isIndoor: venue.isIndoor,
            pitchType: venue.pitchType,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await venueService.updateVenue(Number(id), formData);
        alert("Venue updated successfully");
      } else {
        await venueService.saveVenue(formData);
        alert("Venue added successfully");
      }
      navigate("/venues"); // Redirect to venue list
    } catch (err) {
      console.error(err);
      alert("Failed to save venue");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            {id ? "Edit Venue" : "Add Venue"}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Pitch Type"
                name="pitchType"
                value={formData.pitchType}
                onChange={handleChange}
              >
                {pitchTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
           
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate("/venues")}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {id ? "Update" : "Save"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VenueFormPage;
