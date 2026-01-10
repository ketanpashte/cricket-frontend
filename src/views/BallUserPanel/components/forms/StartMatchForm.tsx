// src/components/StartMatchForm.tsx
import React, { useState } from 'react';
import { Button, Card, Typography, Checkbox, FormControlLabel, Box } from '@mui/material';
import { useMatch } from '../../context/MatchContext';

const mockPlayers = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Player ${i + 1}` }));

const StartMatchForm = () => {
  const [teamA, setTeamA] = useState<number[]>([]);
  const [teamB, setTeamB] = useState<number[]>([]);

  const togglePlayer = (teamSetter: React.Dispatch<React.SetStateAction<number[]>>, team: number[], playerId: number) => {
    teamSetter(team.includes(playerId) ? team.filter(id => id !== playerId) : [...team, playerId]);
  };

  const handleSubmit = async () => {

  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6">Start Match</Typography>
      <Typography>Team A: Select 11 Players</Typography>
      <Box>
        {mockPlayers.map(player => (
          <FormControlLabel
            key={`a-${player.id}`}
            control={<Checkbox checked={teamA.includes(player.id)} onChange={() => togglePlayer(setTeamA, teamA, player.id)} />}
            label={player.name}
          />
        ))}
      </Box>
      <Typography>Team B: Select 11 Players</Typography>
      <Box>
        {mockPlayers.map(player => (
          <FormControlLabel
            key={`b-${player.id}`}
            control={<Checkbox checked={teamB.includes(player.id)} onChange={() => togglePlayer(setTeamB, teamB, player.id)} />}
            label={player.name}
          />
        ))}
      </Box>
      <Button fullWidth variant="contained" disabled={teamA.length !== 11 || teamB.length !== 11} onClick={handleSubmit}>Start Match</Button>
    </Card>
  );
};

export default StartMatchForm;