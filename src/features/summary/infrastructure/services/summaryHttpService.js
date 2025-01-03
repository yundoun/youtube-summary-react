import client from '../../../../core/api/client';
import { API_ENDPOINTS } from '../../../../core/utils/constants';

export const summaryHttpService = {
  getSummaryAll: async (username) => {
    const params = username ? { username } : {};
    return client.get(API_ENDPOINTS.CONTENT_ALL, { params });
  },

  createSummary: async (url, username) => {
    const params = username ? { username } : {};
    return client.post(API_ENDPOINTS.CONTENT, { url }, { params });
  },

  getSummary: async (videoId) => {
    return client.get(API_ENDPOINTS.CONTENT, {
      params: { video_id: videoId }
    });
  },

  deleteSummary: async (videoId, username) => {
    return client.delete(API_ENDPOINTS.CONTENT, {
      params: { video_id: videoId, username }
    });
  }
};