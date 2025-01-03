import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { extractVideoId } from '../../../../core/utils/videoId';
import { summaryHttpService } from '../../infrastructure/services/summaryHttpService';
import {
  setLoading,
  setCurrentSummary,
  setError,
} from '../../infrastructure/store/summarySlice';
import { Summary } from '../../domain/entities/Summary';

export const useSummaryInput = () => {
  const [url, setUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();

  const resetState = useCallback(() => {
    setUrl('');
    setActiveVideoId(null);
    dispatch(setLoading(false));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // URL 유효성 검사
    if (!url?.trim()) {
      dispatch(setError('URL is required'));
      return;
    }

    // 비디오 ID 추출
    const videoId = extractVideoId(url);
    if (!videoId) {
      dispatch(setError('Invalid YouTube URL'));
      return;
    }

    // 이전 상태 초기화
    setActiveVideoId(null);
    dispatch(setLoading(true));

    try {
      const response = await summaryHttpService.createSummary(url);

      if (!response?.data?.summary_info) {
        throw new Error('Invalid response format');
      }

      const summaryInfo = response.data.summary_info;

      // Summary 인스턴스 생성 및 상태 업데이트
      const summaryInstance = new Summary(
        summaryInfo.videoId,
        summaryInfo.title,
        summaryInfo.summary,
        summaryInfo.script,
        summaryInfo.status || 'pending'
      );

      dispatch(setCurrentSummary(summaryInstance.toPlainObject()));

      // WebSocket 연결을 위한 videoId 설정
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