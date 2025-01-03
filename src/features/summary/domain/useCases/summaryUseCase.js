// features/summary/domain/useCases/summaryUseCases.js

import { Summary } from '../entities/Summary';
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { syncService } from '../../infrastructure/services/syncService';
import { webSocketService } from '../../infrastructure/services/websocket';
import { store } from '../../../../store';
import {
  setLoading,
  setError,
  setSummaries,
  setCurrentSummary,
  removeSummary,
} from '../../infrastructure/store/summarySlice';

const summaryRepository = new SummaryRepositoryImpl();

export const summaryUseCases = {
  /**
   * 요약 목록 조회
   * @param {string} [username]
   */
  async fetchAllSummaries(username) {
    store.dispatch(setLoading(true));
    try {
      // 서버와 로컬 데이터 동기화
      await syncService.syncWithServer(username);

      // 로컬 저장소에서 데이터 조회
      const summaries = await summaryRepository.getSummaryAll(username);
      console.log("유스케이스에서 로컬 저장소 데이터 조회")
      store.dispatch(setSummaries(summaries));
    } catch (error) {
      store.dispatch(setError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * 새로운 요약 생성
   * @param {string} url
   * @param {string} [username]
   */
  async createSummary(url, username) {
    store.dispatch(setLoading(true));
    try {
      // syncService를 통해 서버 생성 및 로컬 저장
      const summary = await syncService.createSummary(url, username);
      await this.initializeWebSocket(summary.videoId);
      return summary;
    } catch (error) {
      store.dispatch(setError(error.message));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  /**
   * 단일 요약 조회
   * @param {string} videoId
   */
  async fetchSummary(videoId) {
    try {
      return await summaryRepository.getSummary(videoId);
    } catch (error) {
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  /**
   * 요약 삭제
   * @param {string} videoId
   * @param {string} [username]
   */
  async deleteSummary(videoId, username) {
    try {
      await syncService.deleteSummary(videoId, username);
      store.dispatch(removeSummary(videoId));
    } catch (error) {
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  /**
   * WebSocket 메시지 처리
   * @param {string} videoId
   * @param {string} type
   * @param {any} data
   */
  handleWebSocketMessage(videoId, type, data) {
    switch (type) {
      case 'summary':
        {
          const summaryData = {
            ...data,
            videoId,
            status: 'in_progress'
          };
          store.dispatch(setCurrentSummary(summaryData));
          break;
        }

      case 'complete':
        {
          const lastSummaryData = webSocketService.getLastSummaryData(videoId);
          if (lastSummaryData) {
            const summary = new Summary(
              videoId,
              lastSummaryData.title,
              lastSummaryData.summary,
              lastSummaryData.script,
              'completed'
            );
            store.dispatch(setCurrentSummary(summary));
            // 완료된 요약을 로컬에 저장
            summaryRepository.createSummary(summary);
          }
          break;
        }

      default:
        console.log('Unknown message type:', type);
    }
  },

  /**
   * WebSocket 초기화
   * @param {string} videoId
   */
  initializeWebSocket(videoId) {
    if (!videoId) return;

    store.dispatch(setLoading(true));
    webSocketService.connect(videoId);
    webSocketService.setMessageHandler((type, data) =>
      this.handleWebSocketMessage(videoId, type, data)
    );
  },

  /**
   * WebSocket 연결 정리
   */
  cleanupWebSocket() {
    webSocketService.disconnect();
  }
};