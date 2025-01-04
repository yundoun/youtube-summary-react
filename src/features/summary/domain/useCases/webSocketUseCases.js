import { summaryEventEmitter, SummaryEvents } from '../events/SummaryEventEmitter';

export class WebSocketUseCases {
  constructor(webSocketRepository) {
    this.webSocketRepository = webSocketRepository;
    this.summaryCache = new Map();  // videoId를 키로 하는 캐시 추가
  }

  /**
   * WebSocket 연결 초기화
   * @param {string} videoId - 비디오 ID
   */
  initialize(videoId) {
    if (!videoId) {
      console.warn('No videoId provided for WebSocket initialization');
      return;
    }

    try {
      this.webSocketRepository.connect(videoId);
      this.webSocketRepository.setMessageHandler((type, data) => {
        this.handleMessage(videoId, type, data);
      });

      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_CONNECTED, { videoId });
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_ERROR, {
        videoId,
        error: error.message
      });
    }
  }

  /**
   * WebSocket 메시지 처리
   * @param {string} videoId - 비디오 ID
   * @param {string} type - 메시지 타입
   * @param {any} data - 메시지 데이터
   */
  handleMessage(videoId, type, data) {
    summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_MESSAGE, {
      videoId,
      type,
      data
    });

    switch (type) {
      case 'summary':
        {
          const summaryData = {
            videoId,
            summary: data,
            status: 'in_progress',
            _action: 'UPDATE_SUMMARY'
          };
          this.summaryCache.set(videoId, summaryData);  // 캐시에 저장
          summaryEventEmitter.emit(SummaryEvents.SUMMARY_UPDATED, summaryData);
          break;
        }

      case 'complete':
        {
          const cachedSummary = this.summaryCache.get(videoId);
          summaryEventEmitter.emit(SummaryEvents.SUMMARY_UPDATED, {
            videoId,
            status: 'completed',
            completedAt: new Date().toISOString(),
            _action: 'UPDATE_STATUS',
            summary: cachedSummary?.summary  // 캐시된 summary 데이터 사용
          });
          this.summaryCache.delete(videoId);  // 캐시 정리
          break;
        }

      default:
        console.log('Unknown message type:', type);
    }
  }

  /**
   * WebSocket 연결 정리
   */
  cleanup() {
    try {
      this.webSocketRepository.disconnect();
      this.summaryCache.clear();  // 캐시 정리 추가
      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_DISCONNECTED);
    } catch (error) {
      console.error('Error cleaning up WebSocket:', error);
      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_ERROR, {
        error: error.message
      });
    }
  }
}