import React from "react";
import { Box, TextField, Button, Paper, Typography, Stack, IconButton } from "@mui/material";
import { Lightbulb, Delete as DeleteIcon } from "@mui/icons-material";
import { Tip } from "../../../api/match/tips/tip.api";

interface Props {
  tips: Tip[];
  newTip: string;
  onChange: (val: string) => void;
  onAdd: () => void;
  onDelete: (tipId: number) => void;
}

const TipsSection: React.FC<Props> = ({ tips, newTip, onChange, onAdd, onDelete }) => (
  <>
    <Typography variant="subtitle1" fontWeight="bold">
      <Lightbulb fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
      Match Tips
    </Typography>

    <Stack spacing={1}>
      {tips.length > 0 ? tips.map(tip => (
        <Paper key={tip.tipId} sx={{ p: 1.2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{tip.tipData}</Typography>
          <IconButton size="small" onClick={() => onDelete(tip.tipId)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      )) : (
        <Typography color="text.secondary">No tips yet.</Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          label="New Tip"
          variant="outlined"
          value={newTip}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button variant="contained" onClick={onAdd}>Add</Button>
      </Box>
    </Stack>
  </>
);

export default TipsSection;
