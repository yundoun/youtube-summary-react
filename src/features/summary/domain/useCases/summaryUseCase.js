import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { store } from '../../../../store';
import webSocketService from '../../infrastructure/repositories/WebSocketServiceImpl';
import { setLoading, setCurrentSummary, setError } from '../../infrastructure/store/summarySlice';

// SummaryRepositoryImpl 인스턴스 생성
const summaryRepository = new SummaryRepositoryImpl();

export const summaryUseCases = {
  /**
   * 모든 요약 데이터 가져오기
   * @param {string} [username] - 선택적 사용자명
   * @returns {Promise<Array>}
   */
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

  /**
   * 단일 요약 데이터 가져오기
   * @param {string} videoId - 비디오 ID
   * @returns {Promise<Object>}
   */
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

  /**
   * 새로운 요약 생성
   * @param {string} url - YouTube URL
   * @param {string} [username] - 선택적 사용자명
   * @returns {Promise<Object>}
   */
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

  /**
   * 요약 데이터 삭제
   * @param {string} videoId - 삭제할 비디오 ID
   * @param {string} [username] - 선택적 사용자명
   */
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
        webSocketService.updateSummary(videoId, data, 'in_progress');
        break;

      case 'complete':
        webSocketService.updateSummary(videoId, null, 'completed');
        summaryRepository.getSummary(videoId).then(summary => {
          const serializedSummary = summary.toPlainObject();
          store.dispatch(setCurrentSummary(serializedSummary));
        });
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
