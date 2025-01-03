// src/features/summary/presentation/hooks/useSummary.js

import { useSelector, useDispatch } from 'react-redux';
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { extractVideoId } from '../../../../core/utils/videoId';
import { setSummaries, setLoading, setError } from '../../infrastructure/store/summarySlice';

const summaryRepository = new SummaryRepositoryImpl();

export const useSummary = () => {
  const dispatch = useDispatch();
  const {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    webSocketScripts
  } = useSelector(state => state.summaryFeature.summary);

  const fetchAllSummaries = async (...args) => {
    dispatch(setLoading(true));
    try {
      const data = await summaryRepository.getSummaryAll(...args);
      // Summary 객체를 일반 객체로 변환
      const serializedData = data.map(summary => ({
        videoId: summary.videoId,
        title: summary.title,
        summary: summary.summary,
        script: summary.script,
        status: summary.status,
        thumbnailUrl: summary.thumbnailUrl,
        createdAt: summary.createdAt
      }));
      dispatch(setSummaries(serializedData));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  // 나머지 메서드들도 비슷한 패턴으로 수정
  const createSummary = async (url, username) => {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');
    dispatch(setLoading(true));
    try {
      const data = await summaryRepository.createSummary(url, username);
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchSummary = (...args) => summaryRepository.getSummary(...args);
  const deleteSummary = (...args) => summaryRepository.deleteSummary(...args);

  return {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    webSocketScripts,
    createSummary,
    fetchAllSummaries,
    fetchSummary,
    deleteSummary
  };
};