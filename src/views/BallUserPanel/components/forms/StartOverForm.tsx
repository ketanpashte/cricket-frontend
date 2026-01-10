import React, { useState } from 'react';
import {
  Card,
  Grid,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import { useMatch } from '../../context/MatchContext';

const StartOverForm = () => {
  const { startOver, currentInnings } = useMatch();
  const [bowlerId, setBowlerId] = useState<number | null>(null);
  const theme = useTheme();

  const handleSelect = async (id: number) => {
    setBowlerId(id);
    await startOver({ bowlerId: id });
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select Bowler
      </Typography>

      <Grid container spacing={2}>
        {currentInnings?.bowlingTeam?.map((p) => {
          const isSelected = bowlerId === p.id;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
              <Box
                onClick={() => handleSelect(p.id)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  border: `2px solid ${
                    isSelected ? theme.palette.primary.main : theme.palette.divider
                  }`,
                  bgcolor: isSelected
                    ? theme.palette.primary.light
                    : theme.palette.background.paper,
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {p.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.role}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default StartOverForm;
