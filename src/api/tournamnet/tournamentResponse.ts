import { MatchResponse } from "../match/matchResponse"
import { TournamentStatus, TournamentType } from "./tournamentRequest"

export interface ShortTournamentResponse {
  id: number
  name: string
  description: string,
  image: string,
  startDate: Date,
  endDate: Date,
  tournamentStatus: TournamentStatus,
  type: TournamentType,
}

export interface TournamnetInfoResponse {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  hostingNations: string[];
  tournamentStatus: TournamentStatus;
  type: TournamentType;
  seriesFormat?: string;
  location: string;
  logoUrl?: string;
  matches?: MatchResponse[];
  participatingTeams?: {
    teamId: number;
    teamName: string;
    logoUrl?: string;
  }[];
  winner?: Winner;
  maxParticipants: number;
  tags: string[];

  /** ✅ New fields for grouping **/
  group: boolean;
  groups?: TournamentGroupResponse[];

  /** Highlights **/
  highlightMostRunsPlayer?: string;
  highlightMostRunsValue?: string;
  highlightMostWicketsPlayer?: string;
  highlightMostWicketsValue?: string;
  highlightBestFigurePlayer?: string;
  highlightBestFigureValue?: string;
}

export interface TournamentGroupResponse {
  id: number;
  name: string;
  teams: {
    teamId: number;
    teamName: string;
    logUrl?: string;
  }[];
}

export interface Winner {
  teamId: number;
  teamName: string;
}
