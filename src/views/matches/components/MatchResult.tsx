import React from "react";
import { Typography, Chip, Box } from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
import { MatchResponse } from "../../../api/match/matchResponse";

interface Props {
  match: MatchResponse;
}

const MatchResult: React.FC<Props> = ({ match }) => (
  <>
    {match.tossWinner && (
      <Typography variant="subtitle2">
        Toss won by <strong>{match.tossWinner === match.teamA.teamId ? match.teamA.teamName : match.teamB.teamName}</strong>
        {" "}and elected to <strong>{match.electedTo}</strong>.
      </Typography>
    )}

    {match.winningTeam && (
      <Box display="flex" alignItems="center" gap={1}>
        <EmojiEvents color="success" />
        <Typography variant="subtitle2">
          Winner: <Chip label={match.winningTeam === match.teamA.teamId ? match.teamA.teamName : match.teamB.teamName} color="success" />
        </Typography>
      </Box>
    )}
  </>
);

export default MatchResult;
