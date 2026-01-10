import React from 'react';
import { Card, CardContent, Checkbox, IconButton, Stack, Typography } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { ShortPlayer } from '../../../api/players/res/players';

type Props = {
  player: ShortPlayer;
  selected: boolean;
  isCaptain: boolean;
  onSelect: (checked: boolean) => void;
  onCaptain: () => void;
};

const PlayerCard: React.FC<Props> = ({ player, selected, isCaptain, onSelect, onCaptain }) => {
  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Checkbox checked={selected} onChange={(e) => onSelect(e.target.checked)} />
          <IconButton onClick={onCaptain} color={isCaptain ? 'secondary' : 'default'}>
            {isCaptain ? <Star /> : <StarBorder />}
          </IconButton>
        </Stack>
        <Typography variant="subtitle1">{player.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {player.nationality}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
