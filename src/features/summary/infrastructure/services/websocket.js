import { API_ENDPOINTS } from '../../../../core/utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandler = null;
    this.isConnecting = false;
  }

  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  connect(videoId) {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected or connecting.');
      return;
    }

    this.isConnecting = true;

    try {
      // 기존 연결 정리
      this.close();

      this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(videoId);
        }
        this.isConnecting = false;
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
        this.isConnecting = false;
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.isConnecting = false;
        this.close();
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandler = null;
    this.isConnecting = false;
  }
}

export default new WebSocketService();