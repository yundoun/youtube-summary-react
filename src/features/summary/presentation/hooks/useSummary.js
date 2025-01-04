import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';
import { setLoading, setError, setSummaries } from '../../aplication/store/summarySlice';

export const useSummary = () => {
  const dispatch = useDispatch();
  const {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
  } = useSelector(state => {
    console.log('Current Redux State:', state.summaryFeature.summary);
    return state.summaryFeature.summary;
  });

  const summaryUseCases = dependencyContainer.getSummaryUseCases();

  const fetchAllSummaries = useCallback(async (username) => {
    dispatch(setLoading(true));
    try {
      console.log('Fetching summaries...');
      const data = await summaryUseCases.getSummaryAll(username);
      console.log('Fetched data:', data);
      dispatch(setSummaries(data));
    } catch (error) {
      console.error('Error fetching summaries:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, summaryUseCases]);

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
  };
};