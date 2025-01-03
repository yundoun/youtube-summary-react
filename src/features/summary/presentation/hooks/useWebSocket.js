// src/features/summary/presentation/hooks/useWebSocket.js

import { useEffect } from 'react';
import { summaryUseCases } from '../../../summary/domain/useCases/summaryUseCase';

/**
 * Custom Hook: useWebSocket
 * WebSocket 연결을 관리하는 React Hook
 * summaryUseCases를 통해 WebSocket 로직을 처리
 * 
 * @param {string} videoId - WebSocket 연결을 위한 비디오 ID
 */
export const useWebSocket = (videoId) => {
  useEffect(() => {
    // videoId가 없으면 연결하지 않음
    if (!videoId) return;

    // WebSocket 초기화 및 연결
    summaryUseCases.initializeWebSocket(videoId);

    // Clean up: WebSocket 연결 정리
    return () => {
      summaryUseCases.cleanupWebSocket();
    };
  }, [videoId]); // videoId가 변경될 때만 실행
};