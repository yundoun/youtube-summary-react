import client from '../../../../core/api/client';
import { API_ENDPOINTS } from '../../../../core/utils/constants';

export class SummaryHttpService {
  async getSummaryAll(username) {
    try {
      const params = username ? { username } : {};
      const response = await client.get(API_ENDPOINTS.CONTENT_ALL, { params });
      return response.data; // API 응답 전체를 반환
    } catch (error) {
      console.error('Error in SummaryHttpService.getSummaryAll:', error);
      throw error;
    }
  }

  async createSummary(url, username) {
    try {
      const params = username ? { username } : {};
      const response = await client.post(API_ENDPOINTS.CONTENT, { url }, { params });
      return response.data; // API 응답 전체를 반환
    } catch (error) {
      console.error('Error in SummaryHttpService.createSummary:', error);
      throw error;
    }
  }

  async getSummary(videoId) {
    try {
      const response = await client.get(API_ENDPOINTS.CONTENT, {
        params: { video_id: videoId }
      });
      return response.data; // API 응답 전체를 반환
    } catch (error) {
      console.error('Error in SummaryHttpService.getSummary:', error);
      throw error;
    }
  }

  async deleteSummary(videoId, username) {
    try {
      const params = { video_id: videoId };
      if (username) {
        params.username = username;
      }
      const response = await client.delete(API_ENDPOINTS.CONTENT, { params });
      return response.data; // API 응답 전체를 반환
    } catch (error) {
      console.error('Error in SummaryHttpService.deleteSummary:', error);
      throw error;
    }
  }
}

export const summaryHttpService = new SummaryHttpService();