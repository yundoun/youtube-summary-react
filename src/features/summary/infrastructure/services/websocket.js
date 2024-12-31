import { API_ENDPOINTS } from '../../../../core/utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandler = null; // 메시지 핸들러를 클래스 속성으로 관리
  }

  // 메시지 핸들러 설정을 위한 별도 메서드
  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  // 연결 설정은 videoId만 처리
  connect(videoId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      if (this.socket.readyState === WebSocket.OPEN) {
        // videoId만 전송
        this.socket.send(videoId);
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (this.messageHandler) {
          this.messageHandler(data.type, data.data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
      this.messageHandler = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.messageHandler = null;
    }
  }
}

export default new WebSocketService();