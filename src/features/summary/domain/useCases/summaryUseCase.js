
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { summaryApi } from '../../infrastructure/services/api';
import { store } from '../../../../store';
import webSocketService from '../../infrastructure/services/websocket';
import {
  setLoading,
  setError,
  setSummaries,
  setCurrentSummary,
  removeSummary,
} from '../../infrastructure/store/summarySlice';

// SummaryRepositoryImpl 인스턴스 생성
const summaryRepository = new SummaryRepositoryImpl();


export const summaryUseCases = {
  // ... 기존 코드 유지 ...

  /**
   * handleWebSocketMessage:
   * WebSocket으로부터 받은 메시지를 처리하는 메서드
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
        // summaryRepository를 호출하여 요약 데이터 가져오기
        summaryRepository.getSummary(videoId).then(summary => {
          const serializedSummary = {
            videoId: summary.videoId,
            title: summary.title,
            summary: summary.summary,
            script: summary.script,
            status: summary.status,
            thumbnailUrl: summary.thumbnailUrl,
            createdAt: summary.createdAt,
          };
          store.dispatch(setCurrentSummary(serializedSummary));
        });
        break;

      default:
        console.log('Unknown message type:', type);
    }
  },

  /**
   * initializeWebSocket:
   * WebSocket 연결을 초기화하고 메시지 핸들러를 설정하는 메서드
   * @param {string} videoId - 비디오 ID
   */
  initializeWebSocket(videoId) {
    if (!videoId) return;

    store.dispatch(setLoading(true));
    webSocketService.connect(videoId);
    // 화살표 함수로 this 바인딩 문제 해결
    webSocketService.setMessageHandler((type, data) =>
      this.handleWebSocketMessage(videoId, type, data)
    );
  },

  /**
   * cleanupWebSocket:
   * WebSocket 연결을 정리하는 메서드
   */
  cleanupWebSocket() {
    webSocketService.disconnect();
  }
};