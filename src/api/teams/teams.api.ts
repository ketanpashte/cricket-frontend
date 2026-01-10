import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";
import { PlayerInfo, TeamPlayerInfo } from "../ball_user/types";
import { PlayerInfoFull } from "../players/res/players";
import { TeamInfo, TeamRequest } from "./TeamRequest";

class TeamService {
    creaetTeam(data: TeamRequest) {
        return axiosInstance.post<TeamRequest, ApiResponse<string>>('/teams/create', data);
    }
    getTeamInfo(id: number) {
        return axiosInstance.get<ApiResponse<TeamInfo>>('/teams/getTeamInfo' + "/" + id);
    }

    updateTeam(data: TeamRequest, id: Number) {
        return axiosInstance.put<TeamRequest, ApiResponse<string>>(`/teams/updateTeam/${id}`, data);
    }

    addPlayers(players: number[], teamId: number,captainId: number,viceCaptainId: number) {
        return axiosInstance.post<PlayerInfoFull, ApiResponse<PlayerInfo>>(`/teams/updatePlayers/${teamId}`, players,{
            params: { 
                captainId: captainId,
                viceCaptainId: viceCaptainId
             }
        });
    }

    getPlayers(id: number) {
        return axiosInstance.get<ApiResponse<TeamPlayerInfo>>("/teams/getPlayersFromTeam/" + id);
    }

    queryTeams(searchQuery?: string) {
        const params = searchQuery ? { params: { q: searchQuery } } : {};
        return axiosInstance.get<ApiResponse<TeamInfo[]>>('/teams/searchTeams', params);
    }


    deleteTeam(teamId: number) {
        return axiosInstance.delete(`/teams/${teamId}`);
    }
}


export const teamServcie = new TeamService()