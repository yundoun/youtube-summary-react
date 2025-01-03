
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { extractVideoId } from '../../../../core/utils/videoId';
import { syncService } from '../../infrastructure/services/syncService';
import {
  setLoading,
  setError,
} from '../../infrastructure/store/summarySlice';

export const useSummaryInput = () => {
  const [url, setUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    const videoId = extractVideoId(url);
    if (!videoId) return;

    dispatch(setLoading(true));
    setActiveVideoId(null);

    try {
      // syncService를 통해 요약 생성 및 동기화 처리
      await syncService.createSummary(url);

      // WebSocket 연결을 위한 videoId 설정
      // setTimeout으로 비동기 처리를 보장
      setTimeout(() => setActiveVideoId(videoId), 100);
    } catch (error) {
      console.error('Error during summary creation:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    url,
    setUrl,
    handleSubmit,
    activeVideoId,
  };
};