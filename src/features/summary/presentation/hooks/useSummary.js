import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { extractVideoId } from '../../../../core/utils/videoId';
import {
  setSummaries,
  setLoading,
  setError,
  clearCurrentSummary
} from '../../infrastructure/store/summarySlice';

const summaryRepository = new SummaryRepositoryImpl();

export const useSummary = () => {
  const dispatch = useDispatch();
  const {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
  } = useSelector(state => state.summaryFeature.summary);

  const fetchAllSummaries = useCallback(async (username) => {
    dispatch(setLoading(true));
    try {
      const data = await summaryRepository.getSummaryAll(username);
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
      console.error('Error fetching summaries:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createSummary = useCallback(async (url, username) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      dispatch(setError('Invalid YouTube URL'));
      return null;
    }

    dispatch(setLoading(true));
    dispatch(clearCurrentSummary());

    try {
      const data = await summaryRepository.createSummary(url, username);
      return data;
    } catch (error) {
      console.error('Error creating summary:', error);
      dispatch(setError(error.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchSummary = useCallback(async (videoId) => {
    if (!videoId) return null;

    try {
      return await summaryRepository.getSummary(videoId);
    } catch (error) {
      console.error('Error fetching summary:', error);
      dispatch(setError(error.message));
      return null;
    }
  }, [dispatch]);

  const deleteSummary = useCallback(async (videoId, username) => {
    if (!videoId) return;

    try {
      await summaryRepository.deleteSummary(videoId, username);
      // 성공적으로 삭제 후 목록 새로고침
      await fetchAllSummaries(username);
    } catch (error) {
      console.error('Error deleting summary:', error);
      dispatch(setError(error.message));
    }
  }, [dispatch, fetchAllSummaries]);


  return {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    createSummary,
    fetchAllSummaries,
    fetchSummary,
    deleteSummary
  };
};