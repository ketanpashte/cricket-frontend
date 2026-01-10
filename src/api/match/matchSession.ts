
export type MatchSession = {
    id?: number;
    matchId: number;
    // Team 1 Rate
    team1Min?: number;
    team1Max?: number;
    // Team 2 Rate
    team2Min?: number;
    team2Max?: number;
    // Draw Rate
    drawMin?: number;
    drawMax?: number;
    // Session Score
    sessionOver?: number;
    sessionMinScore?: number;
    sessionMaxScore?: number;
    // Lambi Score
    lambiMinScore?: number;
    lambiMaxScore?: number;
};
