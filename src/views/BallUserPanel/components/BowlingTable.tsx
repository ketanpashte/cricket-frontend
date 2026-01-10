import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BowlerStats } from "../../../api/ball_user/types";



interface Props {
  bowlers: BowlerStats[];
}

const BowlingTable: React.FC<Props> = ({ bowlers }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Bowler</TableCell>
          <TableCell align="right">O</TableCell>
          <TableCell align="right">M</TableCell>
          <TableCell align="right">R</TableCell>
          <TableCell align="right">W</TableCell>
          <TableCell align="right">Econ</TableCell>
          <TableCell align="right">Dots</TableCell>
          <TableCell align="right">4s</TableCell>
          <TableCell align="right">6s</TableCell>
          <TableCell align="right">Wd</TableCell>
          <TableCell align="right">Nb</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {bowlers.map((bowler, i) => (
          <TableRow key={i}>
            <TableCell>{bowler.name}</TableCell>
            <TableCell align="right">{bowler.overs}</TableCell>
            <TableCell align="right">{bowler.maidens}</TableCell>
            <TableCell align="right">{bowler.runsConceded}</TableCell>
            <TableCell align="right">{bowler.wickets}</TableCell>
            <TableCell align="right">{bowler.economy}</TableCell>
            <TableCell align="right">{bowler.dotBalls}</TableCell>
            <TableCell align="right">{bowler.fours}</TableCell>
            <TableCell align="right">{bowler.sixes}</TableCell>
            <TableCell align="right">{bowler.wides}</TableCell>
            <TableCell align="right">{bowler.noBalls}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default BowlingTable;
