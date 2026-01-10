import { Typography, Stack } from "@mui/material";
import { Winner } from "../../../api/tournamnet/tournamentResponse";

type Props = { winner: Winner };

const WinnerSection: React.FC<Props> = ({ winner }) => {
  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ mt: 4 }}>
        Winner
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
        <Typography color="success.main" fontWeight={600}>
          {winner.teamName}
        </Typography>
      </Stack>
    </>
  );
};

export default WinnerSection;
