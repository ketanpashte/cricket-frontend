import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { AppLink } from "../../components";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs);

interface MatchEvent {
  title: string;
  start: Date;
  end: Date;
  id: number;
}

// ✅ Mock Data
const mockMatches: MatchEvent[] = [
  {
    id: 1,
    title: "India vs Australia",
    start: dayjs().hour(10).minute(0).toDate(), // Today 10 AM
    end: dayjs().hour(13).minute(0).toDate(), // Today 1 PM
  },
  {
    id: 2,
    title: "England vs South Africa",
    start: dayjs().add(1, "day").hour(15).minute(0).toDate(),
    end: dayjs().add(1, "day").hour(18).minute(0).toDate(),
  },
  {
    id: 3,
    title: "Pakistan vs Sri Lanka",
    start: dayjs().add(3, "day").hour(11).minute(0).toDate(),
    end: dayjs().add(3, "day").hour(14).minute(0).toDate(),
  },
  {
    id: 4,
    title: "New Zealand vs Bangladesh",
    start: dayjs().add(7, "day").hour(9).minute(30).toDate(),
    end: dayjs().add(7, "day").hour(12).minute(30).toDate(),
  },
];

const DashboardView = () => {
  const theme = useTheme();
  const [events] = useState<MatchEvent[]>(mockMatches);

  const handleEventClick = (event: MatchEvent) => {
    alert(`Match: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh", p: 3 }}>
      <Typography variant="h3" fontWeight="bold" mb={4} color={theme.palette.primary.main}>
        Cricket Admin Dashboard
      </Typography>

      <Grid container spacing={4}>

        {/* Quick Actions */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              component={AppLink}
              to="/matches/new"
              sx={{ minWidth: 160 }}
            >
              Add New Match
            </Button>
            <Button
              variant="contained"
              color="warning"
              component={AppLink}
              to="/tournaments/new"
              sx={{ minWidth: 160 }}
            >
              Create Tournament
            </Button>
            <Button
              variant="contained"
              color="error"
              component={AppLink}
              to="/bets/manage"
              sx={{ minWidth: 160 }}
            >
              Manage Bets
            </Button>
          </Paper>
        </Grid>

        {/* Calendar Section */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" mb={2} fontWeight={600}>
              Matches Calendar
            </Typography>
            <Box sx={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                views={["month", "week", "day"]}
                onSelectEvent={handleEventClick}
              />
            </Box>
          </Paper>
        </Grid>


      </Grid>
    </Box>
  );
};

export default DashboardView;
