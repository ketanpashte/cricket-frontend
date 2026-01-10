import axiosInstance from "../../../utils/api";
import { WeatherInfoRequest, WeatherInfoResponse } from "./types";

export async function getWeather(id: number): Promise<WeatherInfoResponse> {
    const response = await axiosInstance.get<WeatherInfoResponse>(`weather/${id}`);
    return response.data;
}
export async function saveWeatherInfo(id: number, data: WeatherInfoRequest): Promise<void> {
    await axiosInstance.post(`weather/${id}`, data);
}