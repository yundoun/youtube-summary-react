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

      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_CONNECTED, {
        videoId,
        processStep: 1
      });
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
    console.log('[WebSocketUseCases] Message received - type:', type);
    summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_MESSAGE, {
      videoId,
      type,
      data
    });

    switch (type) {
      case 'summary': {
        console.log('[WebSocketUseCases] Processing summary message - Step 2 (AI 분석)');
        const summaryData = {
          videoId,
          summary: data,
          status: 'in_progress',
          _action: 'UPDATE_SUMMARY',
          processStep: 2
        };
        this.summaryCache.set(videoId, summaryData);
        summaryEventEmitter.emit(SummaryEvents.SUMMARY_UPDATED, summaryData);
        break;
      }

      case 'complete': {
        console.log('[WebSocketUseCases] Processing complete message - Step 3 (요약 생성)');
        const cachedSummary = this.summaryCache.get(videoId);

        // 요약 생성 단계 (3단계) 이벤트 발생
        summaryEventEmitter.emit(SummaryEvents.SUMMARY_UPDATED, {
          videoId,
          status: 'completed',
          completedAt: new Date().toISOString(),
          _action: 'UPDATE_STATUS',
          processStep: 3,
          summary: cachedSummary?.summary
        });

        // 잠시 대기 후 완료 단계 (4단계) 이벤트 발생
        setTimeout(() => {
          summaryEventEmitter.emit(SummaryEvents.SUMMARY_UPDATED, {
            videoId,
            status: 'completed',
            completedAt: new Date().toISOString(),
            _action: 'UPDATE_STATUS',
            processStep: 4,
            summary: cachedSummary?.summary
          });
        }, 1000);  // 1초 후 완료 단계로 전환

        this.summaryCache.delete(videoId);
        break;
      }

      default:
        console.log(`[WebSocketUseCases] Unknown message type: ${type}`);
    }
  }

  /**
   * WebSocket 연결 정리
   */
  cleanup() {
    try {
      this.webSocketRepository.disconnect();
      this.summaryCache.clear();
      // cleanup 시 프로세스 단계 초기화
      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_DISCONNECTED, {
        processStep: 0  // 초기 상태로 리셋
      });
    } catch (error) {
      console.error('Error cleaning up WebSocket:', error);
      summaryEventEmitter.emit(SummaryEvents.WEBSOCKET_ERROR, {
        error: error.message
      });
    }
  }
}