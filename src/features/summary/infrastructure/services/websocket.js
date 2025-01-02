import { API_ENDPOINTS } from '../../../../core/utils/constants';

class WebSocketService {
  constructor() {
    // WebSocket 객체를 저장
    this.socket = null;

    // 메시지를 처리할 핸들러 함수 저장
    this.messageHandler = null;

    // WebSocket 연결 상태를 추적 (연결 중인지 여부)
    this.isConnecting = false;
  }

  /**
   * 메시지 핸들러를 설정
   * - WebSocket에서 메시지를 수신했을 때 호출할 함수 지정
   * 
   * @param {Function} handler - 메시지 처리 함수
   */
  setMessageHandler(handler) {
    this.messageHandler = handler;
  }

  /**
   * WebSocket 서버에 연결
   * - 비디오 ID를 사용하여 WebSocket 연결을 시작.
   * 
   * @param {string} videoId - WebSocket 서버에 보낼 비디오 ID
   */
  connect(videoId) {
    // 이미 연결 중이거나 연결 상태인 경우 경고를 출력하고 종료
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      console.warn('WebSocket is already connected or connecting.');
      return;
    }

    // 연결 상태를 "연결 중"으로 설정
    this.isConnecting = true;

    try {
      // 기존 연결을 닫아 중복 연결 방지
      this.close();

      // 새로운 WebSocket 연결 생성
      this.socket = new WebSocket(API_ENDPOINTS.WS_SUMMARY);

      // 연결이 성공적으로 열렸을 때 호출
      this.socket.onopen = () => {
        console.log('WebSocket Connected');

        // 연결이 열리면 비디오 ID를 서버로 전송
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(videoId);
        }

        // 연결 상태를 "연결 중"에서 해제
        this.isConnecting = false;
      };

      // 서버로부터 메시지를 받을 때 호출
      this.socket.onmessage = (event) => {
        try {
          // 수신된 데이터를 JSON 형식으로 파싱
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);

          // 메시지 핸들러가 설정되어 있으면 호출
          if (this.messageHandler) {
            this.messageHandler(data.type, data.data);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      // 연결이 닫혔을 때 호출
      this.socket.onclose = () => {
        console.log('WebSocket Disconnected');

        // 메시지 핸들러와 연결 상태 초기화
        this.messageHandler = null;
        this.isConnecting = false;
      };

      // WebSocket에서 오류가 발생했을 때 호출
      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);

        // 오류 발생 시 연결 상태를 초기화하고 연결 닫기
        this.isConnecting = false;
        this.close();
      };

    } catch (error) {
      // WebSocket 연결 생성 중 오류 처리
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  /**
   * WebSocket 연결 닫기
   * - 현재 연결을 닫고 리소스를 해제.
   */
  close() {
    // WebSocket 객체가 존재하면 연결 닫기
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // 메시지 핸들러와 연결 상태 초기화
    this.messageHandler = null;
    this.isConnecting = false;
  }
}

// WebSocketService 인스턴스를 생성하여 기본적으로 내보냄
export default new WebSocketService();
