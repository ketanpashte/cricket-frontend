export interface CreateMatchRequest {
  matchId: number;

  teamAPlayers: number[]; // Player IDs
  teamBPlayers: number[]; // Player IDs

  teamACaptainId: number;
  teamAViceCaptainId: number;
  teamAWicketKeeperId: number;

  teamBCaptainId: number;
  teamBViceCaptainId: number;
  teamBWicketKeeperId: number;

  electedTeamId: number; // Team ID
  electedTo: 'bat' | 'bowl';
  overs: number;
}

export interface MatchHeader {
  matchId: number
  liveMatchId: string
  teamA: string
  teamALogo: string
  teamB: string
  teamBLogo: string
  venue: string
  tossMessage: string
  tournamentName: string
  tournamentLogo: string
  status: string
  liveScore?: LiveScore
}
export interface LiveScore {
  allInnings: InningsScore[];
  message: string;
}

export interface InningsScore {
  battingTeam: string;
  runs: number;
  wickets: number;
  over?: string;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
  status: string;
  crr: number;
  rrr?: number;
  target?: number;
}



export interface TeamPlayerInfo {
  players: PlayerInfo[];
  teamId: number;
  captainId?: number;      // optional since it can be null
  viceCaptainId?: number;  // optional since it can be null
}

export interface PartnershipDto {
  wicketNumber: number;
  startTime: string;   // ISO date string
  endTime?: string;    // optional ISO date string
  totalRuns: number;
  totalBalls: number;
  brokenByWicket: boolean;
  state: string;       // e.g. "IN_PROGRESS", "INNINGS_ENDED"
  batters: BatterContributionDto[];
}

export interface BatterContributionDto {
  player: PlayerInfo;
  runs: number;
  balls: number;
  strikeRate: string;  // e.g. "136.4"
}

export interface PlayerInfo {
  id: number;
  name: string;
  role?: string;
}


// ✅ PlayerInfo for reusable ID + Name
export interface PlayerInfo {
  id: number;
  name: string;
  role?: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isWicketKeeper?: boolean;
}

export interface TeamInfo {
  id: number;
  name: string;
}


export interface BatterStats {
  name: string;
  dismissal: string;
  runs: number;
  minutes: number | null;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: string;
}

export interface BowlerStats {
  name: string;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: string;
  dotBalls: number;
  fours: number;
  sixes: number;
  wides: number;
  noBalls: number;
}

export type InningState =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'BETWEEN_OVERS'
  | 'DRINKS'
  | 'LUNCH'
  | 'TEA'
  | 'RAIN_DELAY'
  | 'COMPLETED';

export type MatchState = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Innings {
  title: string;
  batters: BatterStats[];
  extras: string;
  extrasTotal: number;
  total: string;
  yetToBat: PlayerInfo[];
  fallOfWickets: FallOfWicketDTO[];
  bowlers: BowlerStats[];
  currentScore?: string;
  overCompleted?: boolean;
  state: InningState;
  partnerships: PartnershipDto[];
  bowlingTeam: PlayerInfo[];
  currentStriker: string;
  currentStrikerId?: number;
  currentNonStriker: string;
  currentNonStrikerId?: number;
  currentOver: OverDto;
}

export interface FallOfWicketDTO {
  wickets: number;         // Number of wickets fallen at this point
  teamRuns: number;        // Team's total runs at the time of this wicket
  batterName: string;      // Name of the batter who got out or retired
  overOrReason: string;    // Over string like "14.2 ov" or "retired"
}


export interface OverListResponse {
  overs: OverDto[];
  teamName: string;
  teamId: number;
  inningsNumber: number;
}

export interface OverDto {
  overNumber: number;
  balls: string[];
  bowlerId: number;
  bowlerName: string;
  summary: string;
  runs: string,
  teamRuns: string,
  completed: boolean;
}

export interface MatchResult {
  matchId: string;
  header: string;
  teamA: string;
  teamB: string;
  teamAId: number;
  teamBId: number;
  matchType: string;
  date: string;
  result: string | null;
  innings: Innings[];
  state: MatchState;
  teamAPlayers?: PlayerInfo[];
  teamBPlayers?: PlayerInfo[];
}

// Payloads remain the same except for using IDs for players & teams
export interface StartInningPayload {
  teamId: number; // Changed to teamId
}

export interface AddScorePayload {
  outcome: string;
}

export interface StartOverPayload {
  bowlerId: number; // Changed to ID
}

export interface StartBatterPayload {
  batter: number; // Changed to ID
}

export interface DismissalPayload {
  outcome: string;
  dismissalType: DismissType;
  fielderId?: number; // Changed to ID
}

export type DismissType =
  | 'BOWLED'
  | 'TIMED_OUT'
  | 'CAUGHT'
  | 'HANDLED_THE_BALL'
  | 'HIT_THE_BALL_TWICE'
  | 'HIT_WICKET'
  | 'LEG_BEFORE_WICKET'
  | 'OBSTRUCTING_THE_FIELD'
  | 'RUN_OUT'
  | 'STUMPED';

export const DismissTypeMeta: Record<
  DismissType,
  { abbreviation: string; bowler: boolean }
> = {
  BOWLED: { abbreviation: 'b', bowler: true },
  TIMED_OUT: { abbreviation: 'to', bowler: false },
  CAUGHT: { abbreviation: 'c', bowler: true },
  HANDLED_THE_BALL: { abbreviation: 'hb', bowler: false },
  HIT_THE_BALL_TWICE: { abbreviation: 'ht', bowler: false },
  HIT_WICKET: { abbreviation: 'hw', bowler: true },
  LEG_BEFORE_WICKET: { abbreviation: 'lbw', bowler: true },
  OBSTRUCTING_THE_FIELD: { abbreviation: 'of', bowler: false },
  RUN_OUT: { abbreviation: 'ro', bowler: false },
  STUMPED: { abbreviation: 'st', bowler: true },
};

export interface ListPlayerDto {
  id: number;
  name: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
}

export interface TeamPlayersDto {
  teamAPlayers: ListPlayerDto[];
  teamBPlayers: ListPlayerDto[];
}
