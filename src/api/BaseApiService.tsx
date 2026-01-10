import { Dispatch } from "react";
import { AppAction } from "../store/AppReducer";
import { ApiResponse } from "../utils";
import { AxiosError, AxiosResponse } from "axios";

export abstract class BaseApiService {
    constructor(private dispatchAction?: Dispatch<AppAction>) { }



    protected async safeApiCall<T>(apiFn: () => Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
        try {
            const response = await apiFn();
            const apiResponse = response.data;
            if (!apiResponse.success) {
                this.dispatchAction?.({
                    type: "SHOW_ALERT",
                    payload: {
                        type: "error",
                        message: apiResponse.message || "An error occurred"
                    }
                });
                throw new Error(apiResponse.message || "Unknown error");
            }

            return apiResponse.data;

        } catch (err: any) {
            let message = "Unexpected error occurred";
            if (err instanceof AxiosError) {
                const data = err.response?.data as ApiResponse<T> | undefined;
                if (data && typeof data.message === "string") {
                    message = data.message;
                } else if (err.message) {
                    message = err.message;
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            this.dispatchAction?.({
                type: "SHOW_ALERT",
                payload: {
                    type: "error",
                    message
                }
            });
            return Promise.reject(new Error(message));
        }
    }

}
