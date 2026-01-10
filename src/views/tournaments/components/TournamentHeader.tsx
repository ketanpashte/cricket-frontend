import { Stack, Avatar, Box, Typography, Button } from "@mui/material";
import { TournamnetInfoResponse } from "../../../api/tournamnet/tournamentResponse";
import { AppLink } from "../../../components";
import { Link } from "react-router-dom";

type Props = { tournament: TournamnetInfoResponse };

const TournamentHeader: React.FC<Props> = ({ tournament }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent={"space-between"} alignItems="center" mb={4}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        {tournament.logoUrl && (
          <Avatar src={tournament.logoUrl} alt={tournament.name} sx={{ width: 64, height: 64 }} />
        )}
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {tournament.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {tournament.description}
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/tournaments/edit/${tournament.id}`}
      >
        Edit Info
      </Button>
    </Stack>
  );
};

export default TournamentHeader;
