export type ShortPlayer = {
  id: number;
  name: string;
  nationality: string;
  role?: string;
}

export interface PlayerInfoFull {
  id: number
  fullName: string
  shortName: string
  nationality: string
  role: string
  battingStyle: string
  bowlingStyle: string
  totalRuns: number
  totalWickets: number
  totalMatches: number
  active: boolean
}

