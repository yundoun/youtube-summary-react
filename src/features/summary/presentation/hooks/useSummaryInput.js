import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { extractVideoId } from '../../../../core/utils/videoId';
import { dependencyContainer } from '../../infrastructure/di/DependencyContainer';
import { setLoading, setError } from '../../infrastructure/store/summarySlice';
import { summaryEventEmitter, SummaryEvents } from '../../domain/events/SummaryEventEmitter';

export const useSummaryInput = () => {
  const [url, setUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();
  const summaryUseCases = dependencyContainer.getSummaryUseCases();

  const resetState = useCallback(() => {
    setUrl('');
    setActiveVideoId(null);
    dispatch(setLoading(false));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url?.trim()) {
      dispatch(setError('URL is required'));
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      dispatch(setError('Invalid YouTube URL'));
      return;
    }

    setActiveVideoId(null);
    dispatch(setLoading(true));

    try {
      const summaryData = await summaryUseCases.createSummary(url);
      summaryEventEmitter.emit(SummaryEvents.SUMMARY_CREATED, summaryData);
      setActiveVideoId(videoId);
    } catch (error) {
      console.error('Error during summary creation:', error);
      dispatch(setError(error.message || 'Failed to create summary'));
      resetState();
    }
  };

  return {
    url,
    setUrl,
    handleSubmit,
    activeVideoId,
    resetState,
  };
};