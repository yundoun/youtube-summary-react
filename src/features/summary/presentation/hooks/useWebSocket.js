import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import { setCurrentSummary, setWebSocketConnected } from '../../infrastructure/store/summarySlice';

export const useWebSocket = (videoId) => {
  const dispatch = useDispatch();

  const handleMessage = useCallback((type, data) => {
    console.log(`WebSocket Message Type: ${type}`, data);

    switch (type) {
      case 'summary':
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
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (!videoId) return;

    webSocketService.connect(videoId, handleMessage);
    dispatch(setWebSocketConnected(true));

    return () => {
      webSocketService.close();
      dispatch(setWebSocketConnected(false));
    };
  }, [videoId, handleMessage, dispatch]);
};