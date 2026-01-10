export interface WeatherInfoResponse {
  id: number;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  icon: string;
  matchId: number;
}

export interface WeatherInfoRequest {
  condition?: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  rainProbability?: number;
  icon?: string;
}
