import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import {
  setCurrentSummary,
  setWebSocketConnected,
  setWebSocketSummary,
  setLoading,
} from '../../infrastructure/store/summarySlice';

export const useWebSocket = (videoId) => {
  const dispatch = useDispatch();
  const isConnected = useRef(false);

  const handleMessage = useCallback(
    (type, data) => {
      console.log(`WebSocket Message Type: ${type}`, data);

      switch (type) {
        case 'summary':
          // 먼저 WebSocket 관련 데이터를 저장
          dispatch(setWebSocketSummary(data));

          // 현재 요약 데이터 업데이트
          dispatch(
            setCurrentSummary({
              videoId,
              summary: data,
              thumbnailUrl: data.thumbnailUrl || '', // 썸네일 기본값 처리
              status: 'in_progress',
            })
          );
          break;

        case 'complete':
          // 요약 완료 상태로 업데이트
          dispatch(
            setCurrentSummary({
              videoId,
              status: 'completed',
            })
          );

          // WebSocket 연결 종료
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

  useEffect(() => {
    if (!videoId || isConnected.current) return;

    // 기존 연결 종료
    webSocketService.close();

    // 약간의 지연 후 새 연결 시작
    const timer = setTimeout(() => {
      webSocketService.connect(videoId);
      webSocketService.setMessageHandler(handleMessage);
      dispatch(setWebSocketConnected(true));
      isConnected.current = true;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (isConnected.current) {
        webSocketService.close();
        dispatch(setWebSocketConnected(false));
        isConnected.current = false;
      }
    };
  }, [videoId, handleMessage, dispatch]);
};
