import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import {
  setCurrentSummary,
  setWebSocketConnected,
  setLoading,
} from '../../infrastructure/store/summarySlice';

/**
 * Custom Hook: useWebSocket
 * - WebSocket 연결을 관리하고, 메시지를 처리하는 React Hook.
 * - Redux를 통해 WebSocket 상태 및 데이터를 관리.
 * 
 * @param {string} videoId - WebSocket 연결을 위한 비디오 ID.
 */
export const useWebSocket = (videoId) => {
  const dispatch = useDispatch();

  // WebSocket 연결 상태를 추적하기 위한 ref
  const isConnected = useRef(false);

  /**
   * handleMessage:
   * - WebSocket에서 수신한 메시지를 처리하는 함수.
   * - 메시지 타입에 따라 Redux 상태를 업데이트.
   * 
   * @param {string} type - 메시지 타입 ('summary' 또는 'complete').
   * @param {Object} data - 메시지 데이터.
   */
  const handleMessage = useCallback(
    (type, data) => {
      console.log(`WebSocket Message Type: ${type}`, data);

      switch (type) {
        case 'summary':
          // summary 필드만 업데이트하고 나머지는 유지
          dispatch(
            setCurrentSummary({
              videoId,
              summary: data,  // 요약 텍스트만 업데이트
              status: 'in_progress',
              _action: 'UPDATE_SUMMARY'  // 특수 플래그 추가
            })
          );
          break;

        case 'complete':
          // 상태만 업데이트
          dispatch(
            setCurrentSummary({
              videoId,
              status: 'completed',
              _action: 'UPDATE_STATUS'  // 특수 플래그 추가
            })
          );

          dispatch(setWebSocketConnected(false));
          dispatch(setLoading(false));
          isConnected.current = false;
          webSocketService.close();
          break;

        default:
          console.log('Unknown message type:', type);
      }
    },
    [dispatch, videoId]
  );

  /**
   * useEffect:
   * - WebSocket 연결 및 상태 관리를 처리.
   * - 비디오 ID가 변경되면 새 WebSocket 연결을 시작.
   */
  useEffect(() => {
    // 비디오 ID가 없거나 이미 연결된 경우 처리하지 않음
    if (!videoId || isConnected.current) return;

    // 기존 연결 닫기
    webSocketService.close();

    // 약간의 지연 후 새 WebSocket 연결 시작
    const timer = setTimeout(() => {
      webSocketService.connect(videoId); // WebSocket 연결 생성
      webSocketService.setMessageHandler(handleMessage); // 메시지 핸들러 설정
      dispatch(setWebSocketConnected(true)); // WebSocket 연결 상태를 true로 설정
      isConnected.current = true; // 연결 상태 플래그 설정
    }, 100); // 100ms 지연

    // 컴포넌트가 언마운트되거나 videoId가 변경될 때 연결 정리
    return () => {
      clearTimeout(timer); // 타이머 정리
      if (isConnected.current) {
        webSocketService.close(); // WebSocket 연결 닫기
        dispatch(setWebSocketConnected(false)); // 연결 상태를 false로 설정
        isConnected.current = false; // 연결 상태 플래그 초기화
      }
    };
  }, [videoId, handleMessage, dispatch]); // 의존성: videoId, handleMessage, dispatch
};
