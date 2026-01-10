import React from "react";
import { Box, Typography, Card, Grid, Divider, Tooltip, IconButton } from "@mui/material";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { VenueScoringDto } from "../../../api/venue/types";
import { Edit } from "@mui/icons-material";

interface Props {
    scoringData: VenueScoringDto;
    onEdit?: () => void; // Optional edit handler
}

const VenueScoringPatternCard: React.FC<Props> = ({ scoringData, onEdit }) => {
    const {
        totalMatches,
        winBatFirst,
        winBowlSecond,
        firstInningBattingAvgScore,
        secondInningBattingAvgScore,
        highestTotal,
    } = scoringData;

    const percentageWinBatFirst = (winBatFirst / totalMatches) * 100;
    const percentageWinBowlSecond = (winBowlSecond / totalMatches) * 100;

    return (
        <Card
            sx={{
                p: 3,
                borderRadius: 3,
                position: "relative",
            }}
        >
            <Typography variant="h6" sx={{ mb: 3 }}>
                Venue Scoring Pattern
            </Typography>

            <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        onClick={onEdit}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ width: 120, mx: "auto" }}>
                        <CircularProgressbarWithChildren
                            value={totalMatches}
                            circleRatio={percentageWinBatFirst / 100}
                            minValue={0}
                            maxValue={1}
                            styles={buildStyles({
                                pathColor: "#4caf50",
                                trailColor: "#ca0c0cff",
                                strokeLinecap: "round",
                                backgroundColor: "#0d0de0ff",

                            })}
                        >
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontWeight: "bold" }}
                            >
                                {totalMatches}
                            </Typography>
                            <Typography variant="caption">
                                Matches
                            </Typography>
                        </CircularProgressbarWithChildren>
                    </Box>
                </Grid>

                {/* Win Bat First / Bowl First */}
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
                        <Box>
                            <Typography variant="body2">
                                Win Bat First
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: "#4caf50", fontWeight: "bold" }}
                            >
                                {winBatFirst}
                            </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Box>
                            <Typography variant="body2">
                                Win Bowl First
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ color: "#f44336", fontWeight: "bold" }}
                            >
                                {winBowlSecond}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 3, bgcolor: "#555" }} />

            {/* Batting Scores */}
            <Grid container spacing={3} textAlign="center">
                <Grid size={4}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {firstInningBattingAvgScore}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                        1st Batting Avg Score
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {secondInningBattingAvgScore}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                        2nd Batting Avg Score
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {highestTotal}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                        Highest Total
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
};

export default VenueScoringPatternCard;
