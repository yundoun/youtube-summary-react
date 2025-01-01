import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import {
  setCurrentSummary,
  setWebSocketConnected,
  setWebSocketSummary,
  setLoading
} from '../../infrastructure/store/summarySlice';

export const useWebSocket = (videoId) => {
  const dispatch = useDispatch();
  const isConnected = useRef(false);

  const handleMessage = useCallback((type, data) => {
    console.log(`WebSocket Message Type: ${type}`, data);

    switch (type) {
      case 'summary':
        dispatch(setWebSocketSummary(data));
        dispatch(setCurrentSummary({
          videoId,
          summary: data,
          status: 'in_progress'
        }));
        break;
      case 'complete':
        dispatch(setCurrentSummary({
          videoId,
          status: 'completed'
        }));
        dispatch(setWebSocketConnected(false));
        dispatch(setLoading(false));
        isConnected.current = false;
        webSocketService.close();
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }, [dispatch, videoId]);

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