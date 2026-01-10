import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";
import { AddScorePayload, CreateMatchRequest, DismissalPayload, LiveScore, MatchHeader, MatchResult, OverListResponse, StartBatterPayload, StartInningPayload, StartOverPayload, TeamPlayersDto } from "./types";

class MatchApi {


  async getMatchHeader(id: string): Promise<MatchHeader> {
    const response = await axiosInstance.get<ApiResponse<MatchHeader>>(`/match/getMatchScoreById/${id}`);
    return response.data.data;

  }
  async getMatchById(matchId: string): Promise<MatchResult> {
    const response = await axiosInstance.get(`/matches/live/${matchId}`);
    return response.data;
  }

  async createMatch(payload: CreateMatchRequest): Promise<any> {
    const response = await axiosInstance.post('/matches/live/start', payload);
    return response.data;
  }

  async startInnings(matchId: string, payload: StartInningPayload): Promise<any> {
    const response = await axiosInstance.post(`/matches/live/${matchId}/startInnings`, payload);
    return response.data;
  }

  async startOver(matchId: string, payload: StartOverPayload): Promise<any> {
    const response = await axiosInstance.post(`/matches/live/${matchId}/start-over`, payload);
    return response.data;
  }

  async startBatter(matchId: string, payload: StartBatterPayload): Promise<any> {
    const response = await axiosInstance.post(`/matches/live/${matchId}/start-batter`, payload);
    return response.data;
  }

  async completeBall(matchId: string, payload: AddScorePayload): Promise<any> {
    const response = await axiosInstance.post(`/matches/live/${matchId}/complete-ball`, payload);
    return response.data;
  }

  async completeBallDismissal(matchId: string, payload: DismissalPayload): Promise<any> {
    const response = await axiosInstance.post(`/matches/live/${matchId}/complete-ball-dismissal`, payload);
    return response.data;
  }

  async undo(matchId: string): Promise<any> {
    const response = await axiosInstance.get(`/matches/live/${matchId}/undo`);
    return response.data;
  }

  async getOvers(matchId: string): Promise<OverListResponse[]> {
    const response = await axiosInstance.get(`/matches/live/${matchId}/getOvers`);
    return response.data;
  }


  async getPlayers(matchId: string): Promise<TeamPlayersDto> {
    const response = await axiosInstance.get(`/matches/live/${matchId}/players`);
    return response.data;
  }

}

export default new MatchApi();
