import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";

export interface NewsDto {
    id?: number;
    title: string;
    content: string;
    imageUrl?: string;
    isPublished?: boolean;
    displayOrder?: number;
    createdAt?: string;
    updatedAt?: string;
}

class NewsService {
    createNews(data: NewsDto) {
        return axiosInstance.post<NewsDto, ApiResponse<NewsDto>>('/news', data);
    }
    updateNews(id: number, data: NewsDto) {
        return axiosInstance.put<NewsDto, ApiResponse<NewsDto>>(`/news/${id}`, data);
    }
    deleteNews(id: number) {
        return axiosInstance.delete<ApiResponse<void>>(`/news/${id}`);
    }
    getNews(id: number) {
        return axiosInstance.get<ApiResponse<NewsDto>>(`/news/${id}`);
    }
    getAllNews() {
        return axiosInstance.get<ApiResponse<NewsDto[]>>('/news');
    }
    publishNews(id: number) {
        return axiosInstance.post<ApiResponse<void>>(`/news/${id}/publish`);
    }
    reorderNews(ids: number[]) {
        return axiosInstance.post<ApiResponse<void>>(`/news/reorder`, ids);
    }
}

export const newsService = new NewsService();
