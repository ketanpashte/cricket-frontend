import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";

export interface NotificationEntity {
    id: number;
    title: string;
    message: string;
    targetType: string;
    targetValue?: string;
    sentAt: string;
}

export interface NotificationRequest {
    title: string;
    message: string;
    targetType: string;
    targetValue?: string;
}

class NotificationService {
    sendNotification(data: NotificationRequest) {
        return axiosInstance.post<ApiResponse<NotificationEntity>>('/notifications/send', data);
    }

    getNotificationHistory() {
        return axiosInstance.get<ApiResponse<NotificationEntity[]>>('/notifications/history');
    }
}

export const notificationService = new NotificationService();
