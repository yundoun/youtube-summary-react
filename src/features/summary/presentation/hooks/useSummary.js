import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SummaryRepositoryImpl } from '../../infrastructure/repositories/SummaryRepositoryImpl';
import { extractVideoId } from '../../../../core/utils/videoId';
import { setSummaries, setLoading, setError } from '../../infrastructure/store/summarySlice';

const summaryRepository = new SummaryRepositoryImpl();

export const useSummary = () => {
  const dispatch = useDispatch();

  const fetchAllSummaries = useCallback(async (...args) => {
    dispatch(setLoading(true));
    console.log("fetchAllSummaries 실행 : useSummary")
    try {
      const data = await summaryRepository.getSummaryAll(...args);
      dispatch(setSummaries(data));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // 나머지 메서드들은 그대로 유지
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
    createSummary,
    fetchAllSummaries,
    fetchSummary,
    deleteSummary
  };
};