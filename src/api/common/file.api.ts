import { ApiResponse } from "../../utils";
import axiosInstance from "../../utils/api";

class FileService {
    uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return axiosInstance.post<ApiResponse<string>>('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}

export const fileService = new FileService();
