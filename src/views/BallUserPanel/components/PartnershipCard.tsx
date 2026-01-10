import React from "react";
import { Box, Typography } from "@mui/material";
import { PartnershipDto } from "../../../api/ball_user/types";

interface PartnershipProps {
  partnership: PartnershipDto;
}

const PartnershipCard: React.FC<PartnershipProps> = ({ partnership }) => {
  const batter1 = partnership.batters[0];
  const batter2 = partnership.batters[1];

  const total = partnership.totalRuns || 1;
  const batter1Pct = (batter1.runs / total) * 100;
  const batter2Pct = (batter2.runs / total) * 100;

  return (
    <Box sx={{ mb: 3, p: 2, borderBottom: "1px solid #444" }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {partnership.wicketNumber}ᵗʰ Wicket
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography fontWeight="bold">{batter1.player.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {batter1.runs} ({batter1.balls})
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography color="orange" fontWeight="bold">
            {partnership.totalRuns} ({partnership.totalBalls})
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography fontWeight="bold">{batter2.player.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {batter2.runs} ({batter2.balls})
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ width: `${batter1Pct}%`, bgcolor: "green" }} />
        <Box sx={{ width: `${batter2Pct}%`, bgcolor: "red" }} />
      </Box>
    </Box>
  );
};

export default PartnershipCard;
