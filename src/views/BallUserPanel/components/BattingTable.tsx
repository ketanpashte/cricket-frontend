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
    Stack,
} from "@mui/material";
import { BatterStats } from "../../../api/ball_user/types";

interface Props {
    batters: BatterStats[];
    extras?: number;
}

const BattingCardList: React.FC<Props> = ({ batters, extras }) => {
    return (
        <TableContainer
            component={Paper}
            sx={{ borderRadius: 2 }}
        >
            {/* Table Title */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">
                    Batting Summary
                </Typography>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Batter</TableCell>
                        <TableCell>Runs</TableCell>
                        <TableCell>4s</TableCell>
                        <TableCell>6s</TableCell>
                        <TableCell>SR</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {batters.map((batter, i) => (
                        <TableRow
                            key={i}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                <Stack>
                                    <Box>{batter.name}</Box>
                                    <Box>{batter.dismissal || ""}</Box>
                                </Stack>
                            </TableCell>
                            <TableCell>{batter.runs + "(" + batter.balls + ")"}</TableCell>
                            <TableCell>{batter.fours}</TableCell>
                            <TableCell>{batter.sixes}</TableCell>
                            <TableCell>{batter.strikeRate}</TableCell>
                        </TableRow>
                    ))}

                    {/* Extras row */}
                    {extras !== undefined && (
                        <TableRow>
                            <TableCell colSpan={6} align="right">
                                Extras
                            </TableCell>
                            <TableCell>{extras}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BattingCardList;
