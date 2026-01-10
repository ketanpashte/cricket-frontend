import { AxiosResponse } from "axios";
import { Dispatch } from "react";
import { BaseApiService } from "../../BaseApiService";
import axiosInstance from "../../../utils/api";
import { ApiResponse } from "../../../utils";
import { AppAction } from "../../../store/AppReducer";

export interface Tip {
  tipId: number;
  tipData: string;
  matchId: number;
}
export class TipService extends BaseApiService {
    constructor(dispatch?: Dispatch<AppAction>) {
        super(dispatch);
    }

    addTip(matchId: number, tipData: string) {
        return this.safeApiCall(() =>
            axiosInstance.post<{ tipData: string[] }, AxiosResponse<ApiResponse<string>>>(
                `/match/tip/addTip/${matchId}`,
                { tipData: [tipData] },
            )
        );
    }

    updateTip(tipId: number, tipData: string) {
        return this.safeApiCall(() =>
            axiosInstance.put<string, AxiosResponse<ApiResponse<string>>>(
                `/match/tip/updateTip/${tipId}`,
                tipData,
                {
                    headers: {
                        "Content-Type": "text/plain", // Because you're sending raw string
                    },
                }
            )
        );
    }

    getTips(matchId: number) {
        return this.safeApiCall(() =>
            axiosInstance.get<unknown, AxiosResponse<ApiResponse<Tip[]>>>(
                `/match/tip/getMatchTips/${matchId}`
            )
        );
    }

    deleteTip(tipId: number) {
        return this.safeApiCall(() =>
            axiosInstance.delete<unknown, AxiosResponse<ApiResponse<string>>>(
                `/match/tip/${tipId}`
            )
        );
    }

}
