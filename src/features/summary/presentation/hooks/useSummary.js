import { useSelector } from 'react-redux';
import { summaryUseCases } from '../../domain/useCases/summaryUseCase';
import { extractVideoId } from '../../../../core/utils/videoId';


export const useSummary = () => {
  const {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    webSocketScripts
  } = useSelector(state => state.summaryFeature.summary);

  const createSummary = async (url, username) => {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');
    return await summaryUseCases.createSummary(url, username);
  };

  return {
    summaries,
    currentSummary,
    isLoading,
    error,
    isWebSocketConnected,
    webSocketScripts,
    createSummary,
    fetchAllSummaries: summaryUseCases.fetchAllSummaries,
    fetchSummary: summaryUseCases.fetchSummary,
    deleteSummary: summaryUseCases.deleteSummary
  };
};