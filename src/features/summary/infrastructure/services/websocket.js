import { API_ENDPOINTS } from '../../../../core/utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(onMessage) {
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
