import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { useMatch } from '../context/MatchContext';
import AdminMatchControlPanel from './AdminMatchControlPanel';
import { ExpandMore } from '@mui/icons-material';
import FullScoreCard from './FullScoreCard';
import MatchHeader from '../../matches/components/MatchHeader';
import MatchHeaderCard from './MatchHeaderCard';
import OverList from './OverList';
import CommentaryView from './CommentaryView';

const MatchResultView: React.FC = () => {
  const { matchInfo: result, fetchOvers } = useMatch();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue == 2) {
      fetchOvers?.().then(() => {
        console.log("Overs fetched successfully");
      }).catch((error) => {
        console.error("Error fetching overs:", error);
      });
    }
    setActiveTab(newValue);
  };

  return (
    <Box>
      {result === null ? (
        <Typography variant="h6" color="text.secondary">
          No match data available.
        </Typography>
      ) : (
        <>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Control Panel" />
            <Tab label="ScoreCard" />
            <Tab label="Overs" />
            <Tab label="Commentary" />
          </Tabs>

          {/* Tab Panels */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <AdminMatchControlPanel />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <MatchHeaderCard />
              </Grid>

            </Grid>

          )}

          {activeTab === 1 && (
            <FullScoreCard />
          )}
          {activeTab === 2 && (
            <OverList />
          )}
          {activeTab === 3 && (
            <CommentaryView />
          )}
        </>
      )}
    </Box>
  );
};

export default MatchResultView;
