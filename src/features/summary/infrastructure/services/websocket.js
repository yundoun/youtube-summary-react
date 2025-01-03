// src/features/summary/infrastructure/services/websocket.js

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
    this.lastSummaryData = new Map(); // 각 videoId별 마지막 요약 데이터 저장
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
        this.updateConnectionStatus(true);
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
        this.updateConnectionStatus(false);
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
    this.updateConnectionStatus(false);
  }

  /**
   * WebSocket 연결 상태 업데이트 및 Redux store 갱신
   * @param {boolean} status - 연결 상태
   */
  updateConnectionStatus(status) {
    store.dispatch(setWebSocketConnected(status));
    if (!status) {
      store.dispatch(setLoading(false));
    }
  }

  /**
   * 요약 데이터 업데이트 및 Redux store 갱신
   * @param {string} videoId - 비디오 ID
   * @param {string} summary - 요약 텍스트
   * @param {string} status - 상태 ('in_progress' | 'completed')
   */
  updateSummary(videoId, summary, status) {
    store.dispatch(
      setCurrentSummary({
        videoId,
        summary,
        status,
        _action: status === 'completed' ? 'UPDATE_STATUS' : 'UPDATE_SUMMARY'
      })
    );
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

// 싱글톤 인스턴스 생성
const webSocketServiceInstance = new WebSocketServiceImpl();

// named export로 변경
export const webSocketService = webSocketServiceInstance;