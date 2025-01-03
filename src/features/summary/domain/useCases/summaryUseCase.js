import { Summary } from '../entities/Summary';
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { syncService } from '../../infrastructure/services/syncService';
import { webSocketService } from '../../infrastructure/repositories/WebSocketServiceImpl';
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
    console.log('fetchAllSummaries 실행');
    try {
      // 서버와 로컬 데이터 동기화
      await syncService.syncWithServer(username);

      // 로컬 저장소에서 데이터 조회
      const summaries = await summaryRepository.getSummaryAll(username);

      // Summary 인스턴스들을 plain objects로 변환
      const plainSummaries = summaries.map((summary) =>
        summary instanceof Summary ? summary.toPlainObject() : summary
      );

      store.dispatch(setSummaries(plainSummaries));
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
            videoId,
            summary: data,
            status: 'in_progress',
            _action: 'UPDATE_SUMMARY', // Redux 상태를 업데이트하기 위한 플래그
          };
          webSocketService.setLastSummaryData(videoId, summaryData);
          store.dispatch(setCurrentSummary(summaryData));
          break;
        }

      case 'complete':
        {
          const lastSummaryData = webSocketService.getLastSummaryData(videoId);
          if (lastSummaryData) {
            const summary = new Summary(
              videoId,
              lastSummaryData.title || 'Untitled Video',
              lastSummaryData.summary,
              lastSummaryData.script || [],
              'completed'
            );

            const plainSummary = summary.toPlainObject();
            store.dispatch(
              setCurrentSummary({
                ...plainSummary,
                _action: 'UPDATE_SUMMARY',
              })
            );

            // 로컬 스토리지에 저장
            summaryRepository.updateSummary(plainSummary);
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
  },
};
