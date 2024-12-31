import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import webSocketService from '../../infrastructure/services/websocket';
import { setWebSocketConnected } from '../../infrastructure/store/summarySlice';

export const useWebSocket = (videoId) => {
  const isWebSocketConnected = useSelector(
    state => state.summaryFeature.summary.isWebSocketConnected
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (videoId) {
      // WebSocket 연결
      webSocketService.connect((type, data) => {
        console.log(`WebSocket Message Type: ${type}`, data);
      });
      dispatch(setWebSocketConnected(true));
    }

    return () => {
      if (isWebSocketConnected) {
        webSocketService.close();
        dispatch(setWebSocketConnected(false));
      }
    };
  }, [videoId]);

  return { isWebSocketConnected };
};
