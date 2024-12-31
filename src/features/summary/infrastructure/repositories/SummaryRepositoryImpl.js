import { SummaryRepository } from '../../domain/repositories/summaryRepository';
import { summaryApi } from '../services/api';
import webSocketService from '../services/websocket';
import { Summary } from '../../domain/entities/Summary';

export class SummaryRepositoryImpl extends SummaryRepository {
  async getSummaryAll(username) {
    const response = await summaryApi.getSummaryAll(username);
    const summaries = response.data.summary_list.map(data =>
      new Summary(data.videoId, data.title, data.summary, data.script)
    );

    // 순수 객체로 변환
    return summaries.map(summary => summary.toPlainObject());
  }


  async getSummary(videoId) {
    const response = await summaryApi.getSummary(videoId);
    const data = response.data.summary_info;
    return new Summary(
      data.videoId,
      data.title,
      data.summary,
      data.script,
      data.thumbnailUrl,
      data.status
    );
  }

  async createSummary(url, username) {
    const response = await summaryApi.createSummary(url, username);
    const data = response.data.summary_info;
    return new Summary(
      data.videoId,
      data.title,
      data.summary,
      data.script,
      data.thumbnailUrl,
      data.status
    );
  }

  async deleteSummary(videoId, username) {
    return await summaryApi.deleteSummary(videoId, username);
  }

  connectWebSocket(callback) {
    if (!callback) {
      console.warn('Callback function is required to connect WebSocket.');
      return;
    }
    webSocketService.connect(callback);
  }


  sendWebSocketMessage(message) {
    webSocketService.sendMessage(message);
  }

  closeWebSocket() {
    webSocketService.close();
  }
}