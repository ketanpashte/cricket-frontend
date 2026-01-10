import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  Divider,
  Stack,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useMatch } from "../context/MatchContext";

const LiveScoreAccordion: React.FC<{ currentScore: any }> = ({ currentScore }) => {
  if (!currentScore || !currentScore.allInnings) {
    return (
      <Typography variant="body2" color="text.secondary">
        No live score available.
      </Typography>
    );
  }

  return (
    <Accordion defaultExpanded sx={{ borderRadius: 2, boxShadow: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight="bold">
          Live Score
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {currentScore.allInnings.map((inning: any, idx: number) => (
          <Card key={idx} variant="outlined" sx={{ p: 1.5, mb: 1.5, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <SportsCricketIcon color="primary" />
              <Typography fontWeight="bold">{inning.battingTeam}</Typography>
            </Box>
            <Typography variant="h6" ml={4}>
              {inning.runs}/{inning.wickets} ({inning.over || "0.0"} ov)
            </Typography>
            <Stack direction="row" spacing={1} ml={4} mt={1}>
              <Chip label={`CRR: ${inning.crr}`} size="small" color="primary" />
              {inning.rrr && <Chip label={`RRR: ${inning.rrr}`} size="small" color="warning" />}
              {inning.target && <Chip label={`Target: ${inning.target}`} size="small" color="success" />}
            </Stack>
            {inning.striker && (
              <Typography variant="caption" color="text.secondary" display="block" mt={1} ml={4}>
                ⚡ {inning.striker}*, {inning.nonStriker} | Bowler: {inning.bowler}
              </Typography>
            )}
          </Card>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const MatchHeaderCard: React.FC = () => {
  const { matchHeader: match } = useMatch();

  if (!match) {
    return (
      <Typography variant="h6" color="text.secondary">
        No match data available.
      </Typography>
    );
  }

  const currentScore = match.liveScore;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
      {/* Header */}
      <CardHeader
        avatar={<Avatar src={match.tournamentLogo} alt={match.tournamentName} />}
        title={
          <Typography variant="h6" fontWeight="bold">
            {match.tournamentName}
          </Typography>
        }
        subheader={
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">{match.venue || "Venue TBD"}</Typography>
          </Box>
        }
      />
      <CardContent>
         {/* Live Score Accordion */}
        <LiveScoreAccordion currentScore={currentScore} />

        <Divider sx={{ my: 2 }} />

        {/* Teams Section */}
        <Accordion defaultExpanded sx={{ borderRadius: 2, boxShadow: 1, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Teams
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid size={5}>
                <Stack alignItems="center" spacing={1}>
                  <Avatar src={match.teamALogo} alt={match.teamA} sx={{ width: 56, height: 56 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {match.teamA}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={2} textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  VS
                </Typography>
              </Grid>
              <Grid size={5}>
                <Stack alignItems="center" spacing={1}>
                  <Avatar src={match.teamBLogo} alt={match.teamB} sx={{ width: 56, height: 56 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {match.teamB}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmojiEventsIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  <strong>Toss:</strong> {match.tossMessage}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {match.status}
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ my: 2 }} />
        {/* Last Message */}
        <Box display="flex" alignItems="center" gap={1}>
          <TimelineIcon color="action" />
          <Typography variant="body2" fontWeight="bold">
            {currentScore?.message || match.tossMessage}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchHeaderCard;
