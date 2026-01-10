import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// DTO type
export interface FallOfWicketDTO {
  wickets: number;
  teamRuns: number;
  batterName: string;
  overOrReason: string;
}

interface Props {
  fallOfWickets: FallOfWicketDTO[];
}

const FallOfWicketTable: React.FC<Props> = ({ fallOfWickets }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Wicket</TableCell>
            <TableCell>Team Runs</TableCell>
            <TableCell>Batter</TableCell>
            <TableCell>Over / Reason</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fallOfWickets.map((wicket, index) => (
            <TableRow key={index}>
              <TableCell>{wicket.wickets}</TableCell>
              <TableCell>{wicket.teamRuns}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{wicket.batterName}</TableCell>
              <TableCell>{wicket.overOrReason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FallOfWicketTable;
