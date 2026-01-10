import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { PlayerInfo } from "../../../api/ball_user/types"; // Adjust path if needed

interface Props {
  players: PlayerInfo[];
}

const YetToBatGrid: React.FC<Props> = ({ players }) => {
  if (!players.length) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {players.map((player) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={player.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
              }}
            >
              <Avatar>
                <PersonIcon />
              </Avatar>
              <Stack>
                <Typography fontWeight="bold">{player.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {player.role || "Player"}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YetToBatGrid;
