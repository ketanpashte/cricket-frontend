import axiosInstance from "../../utils/api";
import { ApiResponse } from "../../utils";

export interface Commentary {
    id: number;
    matchId: string;
    overNumber: number;
    ballNumber: number;
    commentaryText: string;
    bowlerName: string;
    batterName: string;
    runs: string;
    createdAt: string;
}

export interface OverSummary {
    id: number;
    matchId: string;
    overNumber: number;
    teamTotalRuns: number;
    teamTotalWickets: number;
    strikerName: string;
    strikerRuns: number;
    strikerBalls: number;
    nonStrikerName: string;
    nonStrikerRuns: number;
    nonStrikerBalls: number;
    bowlerName: string;
    bowlerOvers: string;
    bowlerMaidens: number;
    bowlerRuns: number;
    bowlerWickets: number;
}

export const commentaryService = {
    getCommentary: (matchId: string) => {
        return axiosInstance.get<ApiResponse<Commentary[]>>(`/matches/commentary/${matchId}`);
    },
    getOverSummaries: (matchId: string) => {
        return axiosInstance.get<ApiResponse<OverSummary[]>>(`/matches/commentary/${matchId}/summaries`);
    },
    updateCommentary: (id: number, text: string) => {
        return axiosInstance.put<ApiResponse<Commentary>>(`/matches/commentary/${id}`, { commentaryText: text });
    }
};
