import { WebSocketRepository } from '../../domain/repositories/WebSocketRepository';
import { API_ENDPOINTS } from '../../../../../core/utils/constants';

export class WebSocketServiceImpl extends WebSocketRepository {
  constructor(stateService) {
    super();
    this.stateService = stateService;
    this.socket = null;
    this.messageHandler = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
  }

  connect(videoId) {
    if (this.isConnecting) {
      console.warn('WebSocket connection already in progress.');
      return;
    }

    this.disconnect();
    this.isConnecting = true;

    try {
      this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        // 웹소켓 연결 시 바로 2단계(AI 분석)로 진행
        this.stateService.handleWebSocketConnected({ processStep: 2 });

        if (videoId) {
          this.sendMessage(videoId);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (this.messageHandler) {
            this.messageHandler(data.type, data.data);
          }
          if (data.type === 'complete') {
            this.disconnect();
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        this.cleanup();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.cleanup();
        this.handleReconnect(videoId);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.cleanup();
    }
  }

  handleReconnect(videoId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(videoId), 1000 * this.reconnectAttempts);
    }
  }

  cleanup() {
    this.messageHandler = null;
    this.isConnecting = false;
    this.stateService.handleWebSocketDisconnected();
    this.socket = null;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.cleanup();
    }
  }

  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  sendMessage(message) {
    if (this.isConnected()) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}