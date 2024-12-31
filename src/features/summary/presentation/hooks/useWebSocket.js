import { useEffect } from 'react';
import webSocketService from '../../infrastructure/services/websocket';

export const useWebSocket = (videoId) => {
  useEffect(() => {
    if (!videoId) return; // videoId가 없으면 WebSocket 연결 방지

    webSocketService.connect((type, data) => {
      console.log(`WebSocket Message Type: ${type}`, data);
    });

    return () => {
      webSocketService.close();
    };
  }, [videoId]);
};
