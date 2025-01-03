// src/features/summary/infrastructure/services/websocket.js

import { WebSocketRepository } from '../../domain/repositories/WebSocketRepository';
import { API_ENDPOINTS } from '../../../../core/utils/constants';

export class WebSocketServiceImpl extends WebSocketRepository {
  constructor() {
    super();
    this.socket = null;
    this.messageHandler = null;
    this.isConnecting = false;
  }

  /**
   * WebSocket 연결 설정
   * @param {string} videoId - 연결할 비디오 ID
   */
  connect(videoId) {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected or connecting.');
      return;
    }

    this.isConnecting = true;

    try {
      this.disconnect();
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
        this.disconnect();
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  /**
   * WebSocket 연결 종료
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandler = null;
    this.isConnecting = false;
  }

  /**
   * 메시지 핸들러 설정
   * @param {Function} handler - 메시지 처리 콜백 함수
   */
  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  /**
   * WebSocket 연결 상태 확인
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * WebSocket을 통한 메시지 전송
   * @param {string} message 
   */
  sendMessage(message) {
    if (this.isConnected()) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export default new WebSocketServiceImpl();