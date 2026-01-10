import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Divider,
  Card,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import { useMatch } from "../context/MatchContext";

const getBallColor = (ball: string) => {
  if (ball === "4") return "info";      // boundary
  if (ball === "6") return "warning";   // six
  if (ball.toLowerCase().includes("w")) return "error"; // wicket
  if (ball === "0") return "default";   // dot
  return "success";                     // singles/doubles
};

const OverList: React.FC = () => {
  const theme = useTheme();
  const { overListResponse: data } = useMatch();

  return (
    <Box sx={{ p: 2 }}>
      {data?.map((innings) => (
        <Box key={innings.inningsNumber} sx={{ mb: 4 }}>
          {/* Inning Header */}
          <Card
            sx={{
              p: 2,
              mb: 2,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <SportsCricketIcon color="primary" />
              {innings.teamName} - Innings {innings.inningsNumber}
            </Typography>
          </Card>

          {/* Overs Accordion */}
          {innings.overs.map((over) => (
            <Accordion
              key={over.overNumber}
              sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: 2,
                mb: 1.5,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.text.primary }} />}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ width: "100%" }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {over.overNumber} Over{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      ({over.runs} Runs)
                    </Typography>
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    RR: {over.teamRuns}
                  </Typography>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                {/* Ball by ball */}
                <Stack direction="row" gap={1} flexWrap="wrap" mb={1}>
                  {over.balls?.length > 0 ? (
                    over.balls.map((ball: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={ball}
                        color={getBallColor(ball)}
                        sx={{
                          fontWeight: "bold",
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          justifyContent: "center",
                          fontSize: "0.9rem",
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      No balls yet
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />

                {/* Extra Info */}
                <Typography variant="body2" color="text.secondary">
                  Bowler: {over.bowlerName}
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  <strong>Summary:</strong> {over.summary}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default OverList;
