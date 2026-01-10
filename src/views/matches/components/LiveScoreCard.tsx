import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import TimelineIcon from "@mui/icons-material/Timeline";
import { LiveScore } from "../../../api/ball_user/types";

interface LiveScoreCardProps {
  score: LiveScore;
}

const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ score }) => {
  return (
    <Card sx={{ maxWidth: 420, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Live Score
        </Typography>

        <Stack spacing={2}>
          {score.allInnings.map((inning, index) => (
            <Box key={index}>
              <Box display="flex" alignItems="center" gap={1}>
                <SportsCricketIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  {inning.battingTeam}
                </Typography>
              </Box>

              <Typography variant="h5" ml={4}>
                {inning.runs}/{inning.wickets} ({inning.overs} ov)
              </Typography>

              {index < score.allInnings.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={1}>
          <TimelineIcon color="action" />
          <Typography variant="body2" fontWeight="bold">
            {score.message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveScoreCard;
