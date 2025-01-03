import { WebSocketRepository } from '../../domain/repositories/WebSocketRepository';
import { API_ENDPOINTS } from '../../../../core/utils/constants';
import { store } from '../../../../store';
import {
  setWebSocketConnected,
  setCurrentSummary,
  setLoading
} from '../store/summarySlice';

export class WebSocketServiceImpl extends WebSocketRepository {
  constructor() {
    super();
    this.socket = null;
    this.messageHandler = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
  }

  connect(videoId) {
    // 이미 연결된 소켓이 있다면 먼저 정리
    this.disconnect();

    if (this.isConnecting) {
      console.warn('WebSocket connection already in progress.');
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.updateConnectionStatus(true);

        // 연결 직후 videoId 전송
        if (videoId) {
          this.sendMessage(videoId);
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);

          if (this.messageHandler) {
            this.messageHandler(data.type, data.data);
          }

          // 'complete' 메시지를 받으면 연결 종료
          if (data.type === 'complete') {
            this.disconnect();
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        this.cleanup();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.cleanup();

        // 재연결 시도
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(videoId), 1000 * this.reconnectAttempts);
        }
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.cleanup();
    }
  }

  cleanup() {
    this.messageHandler = null;
    this.isConnecting = false;
    this.updateConnectionStatus(false);
    this.socket = null;
  }

  disconnect() {
    if (this.socket) {
      // 정상적인 종료 코드와 이유 전달
      this.socket.close(1000, 'Normal closure');
      this.cleanup();
    }
  }

  updateConnectionStatus(status) {
    store.dispatch(setWebSocketConnected(status));
    if (!status) {
      store.dispatch(setLoading(false));
    }
  }

  updateSummary(videoId, summary, status) {
    // 상태 업데이트 로직 개선
    const updateData = {
      videoId,
      summary,
      status,
      _action: status === 'completed' ? 'UPDATE_STATUS' : 'UPDATE_SUMMARY',
      updatedAt: new Date().toISOString()
    };

    store.dispatch(setCurrentSummary(updateData));

    // completed 상태에서 자동 연결 종료
    if (status === 'completed') {
      this.disconnect();
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

export default new WebSocketServiceImpl();