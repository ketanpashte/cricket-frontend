import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useMatch } from "../context/MatchContext";
import BattingTable from "./BattingTable";
import BowlingTable from "./BowlingTable";
import PartnershipsAccordion from "./PartnershipsAccordion";
import FallOfWicketTable from "./FallOfWicketTable";
import YetToBatTable from "./YetToBatTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ marginTop: "1rem" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const FullScoreCard: React.FC = () => {
  const { matchInfo: result, refreshMatchData } = useMatch();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    refreshMatchData();
  }, [refreshMatchData]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box>
      {!result ? (
        <Typography variant="h6" color="text.secondary">
          No match data available.
        </Typography>
      ) : (
        <>
          {/* Tabs for innings */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            {result.innings.map((inning, idx) => (
              <Tab key={idx} label={inning.title} />
            ))}
          </Tabs>

          {/* Tab panels for each inning */}
          {result.innings.map((inning, idx) => (
            <TabPanel key={idx} value={tab} index={idx}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {inning.currentScore}
              </Typography>

              {/* Batting */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Batting</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <BattingTable batters={inning.batters} />
                </AccordionDetails>
              </Accordion>

              {/* Bowling */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Bowling</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <BowlingTable bowlers={inning.bowlers} />
                </AccordionDetails>
              </Accordion>
              {/* Yet to bat */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Yet to Bat</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <YetToBatTable players={inning.yetToBat} />
                </AccordionDetails>
              </Accordion>

              {/* Fall of Wickets */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Fall of Wickets</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FallOfWicketTable fallOfWickets={inning.fallOfWickets} />
                </AccordionDetails>
              </Accordion>

              {/* Partnerships */}
              <PartnershipsAccordion partnerships={inning.partnerships} />
            </TabPanel>
          ))}
        </>
      )}
    </Box>
  );
};

export default FullScoreCard;
