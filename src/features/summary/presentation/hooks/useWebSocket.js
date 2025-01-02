import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import { summaryUseCases } from '../../domain/useCases/summaryUseCase';
import {
  setCurrentSummary,
  setWebSocketConnected,
  setWebSocketSummary,
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
          // 'summary' 메시지를 처리 (요약 중간 데이터)
          dispatch(setWebSocketSummary(data)); // WebSocket 요약 데이터를 Redux에 저장

          // 현재 요약 데이터를 Redux에 업데이트
          dispatch(
            setCurrentSummary({
              videoId,
              summary: data, // 요약 데이터
              thumbnailUrl: data.thumbnailUrl || '', // 썸네일 기본값 처리
              status: 'in_progress', // 상태를 'in_progress'로 설정
            })
          );
          break;

        case 'complete':
          // 'complete' 메시지를 처리 (요약 완료)
          dispatch(
            setCurrentSummary({
              videoId,
              status: 'completed', // 상태를 'completed'로 설정
            })
          );

          // 전체 요약 목록을 갱신
          summaryUseCases.fetchAllSummaries();

          // WebSocket 연결 종료 처리
          dispatch(setWebSocketConnected(false)); // 연결 상태를 false로 설정
          dispatch(setLoading(false)); // 로딩 상태 해제
          isConnected.current = false; // 연결 상태 플래그 초기화
          webSocketService.close(); // WebSocket 연결 닫기
          break;

        default:
          // 알 수 없는 메시지 타입 처리
          console.log('Unknown message type:', type);
      }
    },
    [dispatch, videoId] // 의존성: dispatch와 videoId
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
