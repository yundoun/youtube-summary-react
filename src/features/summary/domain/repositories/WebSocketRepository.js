
/**
 * WebSocket 통신을 위한 repository 인터페이스
 * 실시간 요약 업데이트를 처리하기 위한 WebSocket 연결 관리
 */
export class WebSocketRepository {
  /**
   * WebSocket 연결 설정
   * @param {string} videoId - 연결할 비디오 ID
   * @returns {void}
   */
  connect(videoId) {
    throw new Error('WebSocketRepository: connect method must be implemented');
  }

  /**
   * WebSocket 연결 종료
   * @returns {void}
   */
  disconnect() {
    throw new Error('WebSocketRepository: disconnect method must be implemented');
  }

  /**
   * 메시지 핸들러 설정
   * @param {Function} handler - 메시지를 처리할 콜백 함수 (type: string, data: any) => void
   * @returns {void}
   */
  setMessageHandler(handler) {
    throw new Error('WebSocketRepository: setMessageHandler method must be implemented');
  }

  /**
   * WebSocket 연결 상태 확인
   * @returns {boolean} 연결 상태
   */
  isConnected() {
    throw new Error('WebSocketRepository: isConnected method must be implemented');
  }

  /**
   * WebSocket을 통한 메시지 전송
   * @param {string} message - 전송할 메시지
   * @returns {void}
   */
  sendMessage(message) {
    throw new Error('WebSocketRepository: sendMessage method must be implemented');
  }
}