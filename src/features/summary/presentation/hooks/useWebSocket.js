import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { summaryUseCases } from '../../../summary/domain/useCases/summaryUseCase';
import { setLoading } from '../../infrastructure/store/summarySlice';

/**
 * WebSocket 연결을 관리하는 React Hook
 * @param {string} videoId - WebSocket 연결을 위한 비디오 ID
 */
export const useWebSocket = (videoId) => {
  const dispatch = useDispatch();

  // WebSocket 연결 정리를 위한 cleanup 함수
  const cleanup = useCallback(() => {
    summaryUseCases.cleanupWebSocket();
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!videoId) {
      cleanup();
      return;
    }

    // WebSocket 초기화 및 연결
    try {
      console.log('Initializing WebSocket connection for videoId:', videoId);
      summaryUseCases.initializeWebSocket(videoId);
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      dispatch(setLoading(false));
    }

    // Cleanup 함수 반환
    return () => {
      console.log('Cleaning up WebSocket connection for videoId:', videoId);
      cleanup();
    };
  }, [videoId, cleanup, dispatch]);
};