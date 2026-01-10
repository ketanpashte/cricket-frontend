export interface TournamentRequest {
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  location: string;
  hostingNations: string[];
  logoUrl: string;
  tournamentStatus: TournamentStatus;
  type: TournamentType;
  seriesFormat?: string;
  participatingTeamIds: number[];
  maxParticipants: number;
  tags: string[];

  /** ✅ New fields for grouping **/
  isGroup: boolean;
  groups?: GroupRequest[];
}

export interface GroupRequest {
  name: string;
  teamIds: number[];
}

export type TournamentType = 'INTERNATIONAL' | 'DOMESTIC' | 'LEAGUE';
export type TournamentStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';
