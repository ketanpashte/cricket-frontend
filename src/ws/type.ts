// types/BallCompletedEventDto.ts

export interface BallCompletedEventDto {
  bowlerName: string;
  strikerName: string;
  nonStrikerName: string;
  teamRuns: number;
  text: string,
  playersCrossed: boolean;
  dismissalType?: string | null;
  fielderName?: string | null;
  overNumber: number;
  numberInOver: number;
  numberInMatch: number;
  time: string; // ISO format, from Instant
}
