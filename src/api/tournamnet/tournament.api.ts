import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";
import { TournamentRequest } from "./tournamentRequest";
import { ShortTournamentResponse, TournamnetInfoResponse } from "./tournamentResponse";

class TournamentService {

    createTournament(data: TournamentRequest) {
        return axiosInstance.post<TournamentRequest, ApiResponse<string>>('/tournament/create', data);
    }
    updateTournament(tournamentId: number, data: TournamentRequest) {
        return axiosInstance.put<TournamentRequest, ApiResponse<string>>(`/tournament/update/${tournamentId}`,
            data);
    }

    getTournamentInfo(tournamentId: number) {
        return axiosInstance.get<ApiResponse<TournamnetInfoResponse>>('/tournament/getTournamentInfo' + "/" + tournamentId);
    }

    queryTournament(searchQuery?: string) {
        const params = searchQuery ? { params: { q: searchQuery } } : {};
        return axiosInstance.get<ApiResponse<ShortTournamentResponse[]>>('/tournament/searchTournament', params);
    }


    deleteTournament(tournamentId: number) {
        return axiosInstance.delete(`/tournament/delete/${tournamentId}`);
    }

    updateHighlights(tournamentId: number, data: any) {
        return axiosInstance.patch(`/tournament/${tournamentId}/highlights`, data);
    }
}


export const tournamentService = new TournamentService()