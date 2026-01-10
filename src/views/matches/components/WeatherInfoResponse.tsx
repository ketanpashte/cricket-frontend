import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Opacity,
  Air,
  Whatshot,
  Grain,
  WaterDrop,
} from "@mui/icons-material";
import { WeatherInfoResponse } from "../../../api/match/weather/types";

interface Props {
  weather: WeatherInfoResponse;
}

const WeatherCard: React.FC<Props> = ({ weather }) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        p: 2,
      }}
    >
      <CardContent>
        {/* Weather Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Weather Forecast
          </Typography>
          <Avatar
            src={weather.icon}
            alt={weather.condition}
            sx={{ width: 40, height: 40 }}
          />
        </Box>

        {/* Main Weather Condition */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {weather.condition}
        </Typography>

        {/* Weather Details Grid */}
        <Grid container spacing={2}>
          <Grid size={6}>
            <Box display="flex" alignItems="center">
              <Whatshot sx={{ mr: 1 }} />
              <Typography variant="body2">
                Temp: {weather.temperature}°C
              </Typography>
            </Box>
          </Grid>

          <Grid size={6}>
            <Box display="flex" alignItems="center">
              <WaterDrop sx={{ mr: 1 }} />
              <Typography variant="body2">
                Humidity: {weather.humidity}%
              </Typography>
            </Box>
          </Grid>

          <Grid size={6}>
            <Box display="flex" alignItems="center">
              <Air sx={{ mr: 1 }} />
              <Typography variant="body2">
                Wind: {weather.windSpeed} km/h
              </Typography>
            </Box>
          </Grid>

          <Grid size={6}>
            <Box display="flex" alignItems="center">
              <Grain sx={{ mr: 1 }} />
              <Typography variant="body2">
                Rain: {weather.rainProbability}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
