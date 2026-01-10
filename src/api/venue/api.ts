import axiosInstance from '../../utils/api';
import { VenuePageResponse, VenueRequest, VenueResponse, VenueScoringDto } from './types';

const API_BASE_URL = '/venues';

export class VenueService {
  async saveVenue(data: VenueRequest) {
    return axiosInstance.post<string>(`${API_BASE_URL}`, data);
  }

  async updateVenue(id: number, data: VenueRequest) {
    return axiosInstance.put<string>(`${API_BASE_URL}/${id}`, data);
  }

  async searchVenues(
    keyword?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'name',
    direction: 'asc' | 'desc' = 'asc'
  ) {
    return axiosInstance.get<VenuePageResponse>(`${API_BASE_URL}/search`, {
      params: { keyword, page, size, sortBy, direction },
    });
  }

  async getVenueById(id: number) {
    return axiosInstance.get<VenueScoringDto>(`${API_BASE_URL}/scorings/${id}`);
  }
  async getByVenueScoringId(id: number) {
    return axiosInstance.get<VenueScoringDto>(`${API_BASE_URL}/scorings/${id}`);
  }
  async updatePatternByVenueId(id: number, data: VenueScoringDto) {
    return axiosInstance.put<VenueScoringDto>(`${API_BASE_URL}/scorings/${id}`, data);
  }

  async deleteVenue(id: number) {
    return axiosInstance.delete<string>(`${API_BASE_URL}/${id}`);
  }

  async importVenues(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<string>(`${API_BASE_URL}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async exportVenues() {
    return axiosInstance.get<Blob>(`${API_BASE_URL}/export`, {
      responseType: 'blob', // Required for file download
    });
  }

  async getAvailableCountries() {
    return axiosInstance.get<any, string[]>(`${API_BASE_URL}/countries`);
  }
  async findByCountry(country: string) {
    return axiosInstance.get<any, string[]>(`${API_BASE_URL}/findByCountry/${country}`);
  }
}
