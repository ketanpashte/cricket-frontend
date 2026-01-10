import { Grid, Typography, Divider } from "@mui/material";
import { TournamnetInfoResponse } from "../../../api/tournamnet/tournamentResponse";

const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

type Props = { tournament: TournamnetInfoResponse };

const TournamentDetails: React.FC<Props> = ({ tournament }) => {
  return (
    <>
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Start Date
          </Typography>
          <Typography variant="body1">{formatDateTime(tournament.startDate)}</Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            End Date
          </Typography>
          <Typography variant="body1">{formatDateTime(tournament.endDate)}</Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Location
          </Typography>
          <Typography variant="body1">{tournament.location}</Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Series Type
          </Typography>
          <Typography variant="body1">{tournament.type || "N/A"}</Typography>
        </Grid>
        {/* Tournament Status */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Series Status
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color:
                tournament.tournamentStatus === "LIVE"
                  ? "success.main"
                  : tournament.tournamentStatus === "FINISHED"
                    ? "error.main"
                    : "primary.main",
              fontWeight: 600,
            }}
          >
            {tournament.tournamentStatus || "N/A"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
    </>
  );
};

export default TournamentDetails;
