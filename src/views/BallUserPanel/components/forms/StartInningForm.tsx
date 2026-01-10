import React from 'react';
import { Box, Button, Stack, Typography, Card } from '@mui/material';
import { useMatch } from '../../context/MatchContext';

const StartInningForm: React.FC = () => {
  const { matchInfo, startInning, refreshMatchData } = useMatch();
  const handleStartInning = async (teamId?: number) => {
    if (!matchInfo || !teamId) return;
    await startInning({ teamId });
    refreshMatchData();
  };

  if (!matchInfo) {
    return <Typography>Match info not available</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Box mt={3}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => handleStartInning(matchInfo?.teamAId)}>
            Start Innings for {matchInfo?.teamA}
          </Button>
          <Button variant="contained" onClick={() => handleStartInning(matchInfo?.teamBId)}>
            Start Innings for {matchInfo?.teamB}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default StartInningForm;
