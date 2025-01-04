class SummaryEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} event 이벤트 이름
   * @param {Function} callback 콜백 함수
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} event 이벤트 이름
   * @param {Function} callback 콜백 함수
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * 이벤트 발생
   * @param {string} event 이벤트 이름
   * @param {any} data 이벤트 데이터
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

// 싱글톤 인스턴스 생성
export const summaryEventEmitter = new SummaryEventEmitter();

// 이벤트 타입 상수 정의
export const SummaryEvents = {
  SUMMARY_CREATED: 'summary_created',
  SUMMARY_UPDATED: 'summary_updated',
  SUMMARY_DELETED: 'summary_deleted',
  SUMMARY_ERROR: 'summary_error',
  WEBSOCKET_MESSAGE: 'websocket_message',
  WEBSOCKET_CONNECTED: 'websocket_connected',
  WEBSOCKET_DISCONNECTED: 'websocket_disconnected',
  WEBSOCKET_ERROR: 'websocket_error',
};