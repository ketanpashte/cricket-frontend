import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";
import { TeamPlayerInfo } from "../ball_user/types";
import { PlayerInfoFull, ShortPlayer } from "./res/players";

class PlayerService {
  createPlayer(data: CreatePlayerRequest) {
    return axiosInstance.post<CreatePlayerRequest, ApiResponse<string>>('/players/create', data);
  }
  getPlayerInfoFull(id: number) {
    return axiosInstance.get<ApiResponse<PlayerInfoFull>>('/players/getPlayerInfo' + "/" + id);
  }

  updatePlayer(data: CreatePlayerRequest, id: Number) {
    return axiosInstance.put<CreatePlayerRequest, ApiResponse<string>>(`/players/updatePlayer/${id}`, data);
  }

 queryPlayers(filters: { search?: string; nationality?: string; role?: string }) {
  const params = {
    ...(filters.search && { q: filters.search }),
    ...(filters.nationality && { nationality: filters.nationality }),
    ...(filters.role && { role: filters.role }),
  };

  return axiosInstance.get<ApiResponse<ShortPlayer[]>>('/players/searchPlayers', { params });
}


  deletePlayer(playerId: number) {
    return axiosInstance.delete(`/players/deletePlayer/${playerId}`);
  }
}

export const getPlayersFromTeam = (teamId: number) => {
  return axiosInstance.get<ApiResponse<TeamPlayerInfo>>(`/players/getPlayersFromTeam/${teamId}`);
};

export default new PlayerService();
