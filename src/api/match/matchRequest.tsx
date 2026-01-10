export type MatchRequest = {
  matchId: number;
  tournamentId: number;
  teamAId: number;
  totalOvers: number;
  teamBId: number;
  startTime: number;
  endTime: number;
  venueId: number;
  groundUmpire1?: string;
  groundUmpire2?: string;
  thirdUmpire?: string;
};


export const MATCH_TYPE_OPTIONS: { label: string; overs: number | null }[] = [
  { label: "5 Overs", overs: 5 },
  { label: "10 Overs", overs: 10 },
  { label: "T20 (20 Overs)", overs: 20 },
  { label: "ODI (50 Overs)", overs: 50 },
  { label: "Test Match", overs: null }, // Test matches typically don’t have fixed overs
];