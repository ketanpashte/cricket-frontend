import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { WeatherInfoRequest } from "../../../api/match/weather/types";
import { AppButton } from "../../../components";

const WEATHER_CONDITIONS = [
  "Sunny",
  "Cloudy",
  "Rainy",
  "Stormy",
  "Windy",
  "Snowy",
];

type WeatherFormProps = {
  initialValues?: WeatherInfoRequest;
  loading?: boolean;
  onSubmit: (data: WeatherInfoRequest) => void;
};

const WeatherForm: React.FC<WeatherFormProps> = ({
  initialValues,
  loading = false,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState<WeatherInfoRequest>(
    initialValues || {
      condition: "",
      temperature: 0,
      humidity: 0,
      windSpeed: 0,
      rainProbability: 0,
      icon: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === "temperature" ||
        name === "humidity" ||
        name === "windSpeed" ||
        name === "rainProbability"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", p: 1 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Weather Info
      </Typography>
      <Grid container spacing={2}>
        {/* Condition */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="Condition"
            name="condition"
            value={formValues.condition}
            onChange={handleChange}
          >
            {WEATHER_CONDITIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Temperature */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Temperature (°C)"
            name="temperature"
            value={formValues.temperature}
            onChange={handleChange}
          />
        </Grid>

        {/* Humidity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Humidity (%)"
            name="humidity"
            value={formValues.humidity}
            onChange={handleChange}
          />
        </Grid>

        {/* Wind Speed */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Wind Speed (km/h)"
            name="windSpeed"
            value={formValues.windSpeed}
            onChange={handleChange}
          />
        </Grid>

        {/* Rain Probability */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Rain Probability (%)"
            name="rainProbability"
            value={formValues.rainProbability}
            onChange={handleChange}
          />
        </Grid>

        {/* Icon URL */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Icon URL"
            name="icon"
            value={formValues.icon}
            onChange={handleChange}
          />
        </Grid>

        {/* Actions */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <AppButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : "Save Weather Info"}
            </AppButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherForm;
