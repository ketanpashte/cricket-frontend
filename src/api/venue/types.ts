export interface VenueRequest {
  name: string;
  city: string;
  country: string;
  address?: string;
  capacity?: number;
  isIndoor: boolean;
  pitchType?: string;
}
export interface VenueResponse {
  id: number;
  name: string;
  city: string;
  country: string;
  address?: string;
  capacity?: number;
  isIndoor: boolean;
  pitchType?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export type VenuePageResponse = PaginatedResponse<VenueResponse>;

export type VenueScoringDto = {
  totalMatches: number;
  winBatFirst: number;
  winBowlSecond: number;
  firstInningBattingAvgScore: number;
  secondInningBattingAvgScore: number;
  highestTotal: number;
};

