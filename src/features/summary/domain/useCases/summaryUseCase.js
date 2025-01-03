import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { store } from '../../../../store';
import webSocketService from '../../infrastructure/repositories/WebSocketServiceImpl';
import { setLoading, setCurrentSummary, setError } from '../../infrastructure/store/summarySlice';

const summaryRepository = new SummaryRepositoryImpl();

export const summaryUseCases = {
  async getSummaryAll(username) {
    try {
      const summaries = await summaryRepository.getSummaryAll(username);
      return summaries.map(summary => summary.toPlainObject());
    } catch (error) {
      console.error('Error in getSummaryAll:', error);
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  async getSummary(videoId) {
    try {
      const summary = await summaryRepository.getSummary(videoId);
      return summary.toPlainObject();
    } catch (error) {
      console.error('Error in getSummary:', error);
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  async createSummary(url, username) {
    try {
      const summary = await summaryRepository.createSummary(url, username);
      return summary.toPlainObject();
    } catch (error) {
      console.error('Error in createSummary:', error);
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  async deleteSummary(videoId, username) {
    try {
      await summaryRepository.deleteSummary(videoId, username);
    } catch (error) {
      console.error('Error in deleteSummary:', error);
      store.dispatch(setError(error.message));
      throw error;
    }
  },

  /**
   * WebSocket 메시지 처리
   * @param {string} videoId - 비디오 ID
   * @param {string} type - 메시지 타입 ('summary' | 'complete')
   * @param {any} data - 메시지 데이터
   */
  handleWebSocketMessage(videoId, type, data) {
    switch (type) {
      case 'summary':
        // 진행 중인 요약 업데이트
        webSocketService.updateSummary(videoId, data, 'in_progress');
        break;

      case 'complete':
        // 완료 상태 업데이트 (추가 GET 요청 제거)
        const summaryData = {
          videoId,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
        webSocketService.updateSummary(videoId, null, 'completed');
        store.dispatch(setCurrentSummary(summaryData));
        store.dispatch(setLoading(false));
        break;

      default:
        console.log('Unknown message type:', type);
    }
  },

  /**
   * WebSocket 연결 초기화
   * @param {string} videoId - 비디오 ID
   */
  initializeWebSocket(videoId) {
    if (!videoId) {
      console.warn('No videoId provided for WebSocket initialization');
      return;
    }

    // 기존 연결 정리
    this.cleanupWebSocket();

    // 새로운 연결 설정
    store.dispatch(setLoading(true));

    try {
      webSocketService.connect(videoId);
      webSocketService.setMessageHandler((type, data) => {
        this.handleWebSocketMessage(videoId, type, data);
      });
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      store.dispatch(setError('WebSocket connection failed'));
      store.dispatch(setLoading(false));
    }
  },

  /**
   * WebSocket 연결 정리
   */
  cleanupWebSocket() {
    try {
      webSocketService.disconnect();
      store.dispatch(setLoading(false));
    } catch (error) {
      console.error('Error cleaning up WebSocket:', error);
    }
  }
};