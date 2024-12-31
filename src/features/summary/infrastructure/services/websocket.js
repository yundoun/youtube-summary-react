import { API_ENDPOINTS } from '../../../../core/utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(onMessage) {
    // 이미 연결된 경우 중복 연결 방지
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected.');
      return;
    }

    this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessage) {
        onMessage(data.type, data.data);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new WebSocketService();

