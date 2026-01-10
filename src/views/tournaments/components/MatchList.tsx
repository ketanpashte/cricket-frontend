import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Button,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MatchResponse } from "../../../api/match/matchResponse";

const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Map match status to color
const getStatusColor = (status: string) => {
  switch (status) {
    case "NOT_STARTED":
      return "default";
    case "IN_PROGRESS":
      return "success";
    case "COMPLETED":
      return "primary";
    case "PAUSED":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

type Props = {
  matches?: MatchResponse[];
  tournamentId: number;
  navigate: any;
};

const MatchList: React.FC<Props> = ({ matches, tournamentId, navigate }) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Matches
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/matches/new?tournamentId=${tournamentId}`)}
        >
          Add Match
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
        {matches && matches.length ? (
          <Grid container spacing={2}>
            {matches.map((match) => (
              <Grid size={{ xs: 12, sm: 6 }} key={match.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"

                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={match.teamA.logUrl} sx={{ width: 28, height: 28 }} />
                      <Typography fontWeight={500}>{match.teamA.teamName}</Typography>
                      <Typography fontWeight={500}>vs</Typography>
                      <Avatar src={match.teamB.logUrl} sx={{ width: 28, height: 28 }} />
                      <Typography fontWeight={500}>{match.teamB.teamName}</Typography>
                    </Stack>
                    <Chip
                      label={match.matchStatus}
                      size="small"
                      color={getStatusColor(match.matchStatus)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Stack>

                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Venue:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {match.venue || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Overs:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {match.totalOvers}
                      </Typography>
                    </Grid>

                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        Start:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDateTime(match.startTime)}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" color="text.secondary">
                        End:
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDateTime(match.endTime)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Toss Info */}
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption">
                      Toss Winner:{" "}
                      <strong>{match.tossWinner ? `Team ${match.tossWinner}` : "N/A"}</strong>
                    </Typography>
                    <Typography variant="caption">
                      Elected: <strong>{match.electedTo || "N/A"}</strong>
                    </Typography>
                  </Stack>

                  {/* Action */}
                  <Stack direction={"row"} spacing={1}  >
                    {match.matchStatus == "NOT_STARTED" &&
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/matches/edit/${match.id}`}
                      >
                        Edit Match
                      </Button>
                    }
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/matches/${match.id}`}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No matches scheduled.</Typography>
        )}
      </Paper>
    </>
  );
};

export default MatchList;
