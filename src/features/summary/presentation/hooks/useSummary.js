import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';
import {
  setLoading,
  setError,
  setSummaries,
  setSelectedSummary,
} from '../../application/store/summarySlice';

export const useSummary = () => {
  const dispatch = useDispatch();

  // 필요한 상태만 선택적으로 가져오기
  const summaries = useSelector((state) => state.summaryFeature.summary.summaries);
  const isLoading = useSelector((state) => state.summaryFeature.summary.isLoading);
  const error = useSelector((state) => state.summaryFeature.summary.error);
  const currentSummary = useSelector((state) => state.summaryFeature.summary.currentSummary);
  const isWebSocketConnected = useSelector(
    (state) => state.summaryFeature.summary.isWebSocketConnected
  );

  const summaryUseCases = dependencyContainer.getSummaryUseCases();

  // 공통 상태 업데이트 로직 추출
  const handleAsyncState = useCallback(async (asyncFn) => {
    dispatch(setLoading(true));
    try {
      return await asyncFn();
    } catch (error) {
      console.error('Error during async operation:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchAllSummaries = useCallback(
    async (username) => {
      return handleAsyncState(async () => {
        console.log('Fetching summaries...');
        const data = await summaryUseCases.getSummaryAll(username);
        // console.log('Fetched data:', data);
        dispatch(setSummaries(data));
      });
    },
    [dispatch, handleAsyncState, summaryUseCases]
  );

  const fetchSingleSummary = useCallback(
    async (videoId) => {
      return handleAsyncState(async () => {
        const data = await summaryUseCases.getSummary(videoId);
        dispatch(setSelectedSummary(data));
        return data;
      });
    },
    [dispatch, handleAsyncState, summaryUseCases]
  );

  // 디버깅을 위한 상태 변화 감지
  useEffect(() => {
    console.log('Summaries updated:', summaries);
  }, [summaries]);

  return {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    fetchAllSummaries,
    fetchSingleSummary,
  };
};
