// components/BallEventsCard.tsx
import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { BallCompletedEventDto } from "../../../ws/type";

interface BallEventsCardProps {
  events: BallCompletedEventDto[];
}

const BallEventsCard: React.FC<BallEventsCardProps> = ({ events }) => {
  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Last 24 Balls
        </Typography>
        <List dense>
          {events.map((event, index) => {
            const overBall = `${event.overNumber}.${event.numberInOver}`;
            const ballDescription = `${overBall} - ${event.bowlerName} to ${event.strikerName}`;

            let resultText = `${event.teamRuns} run${event.teamRuns !== 1 ? "s" : ""}`;
            if (event.dismissalType) {
              resultText += ` — OUT (${event.dismissalType}${event.fielderName ? ` by ${event.fielderName}` : ""})`;
            }

            return (
              <ListItem key={index} divider>
                <ListItemText
                  primary={ballDescription}
                  secondary={event.text}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default BallEventsCard;
