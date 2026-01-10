export type MatchResponse = {
  id: number;
  teamA: {
    teamId: number;
    teamName: string;
    logUrl?: string;
    colorCode?: string;
    bgImageUrl?: string;
  };
  teamB: {
    teamId: number;
    teamName: string;
    logUrl?: string;
    colorCode?: string;
    bgImageUrl?: string;
  };
  hostingNation: string;
  tossWinner?: number;
  electedTo?: string;
  totalOvers: number;
  venue?: string;
  venueId?: number;
  tournamentName?: string;
  matchStatus: MatchStatus;
  winningTeam?: number;
  startTime: string;
  endTime?: string;
  tournamentId?: number;
  liveMatchId?: string | null;
  groundUmpire1?: string;
  groundUmpire2?: string;
  thirdUmpire?: string;
};

export type MatchStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAUSED'
  | 'CANCELLED';
