import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import { extractVideoId } from '../../../../../core/utils/videoId';
import {
  setLoading,
  setCurrentSummary,
  setError,
} from '../../../infrastructure/store/summarySlice';
import { Summary } from '../../../domain/entities/Summary';
import { summaryApi } from '../../../infrastructure/services/api';

export const SummaryInput = () => {
  const [url, setUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();

  useWebSocket(activeVideoId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    const videoId = extractVideoId(url);
    if (!videoId) return;

    dispatch(setLoading(true));
    setActiveVideoId(null);

    try {
      const response = await summaryApi.createSummary(url);
      const responseData = response.data;
      const summaryInfo = responseData.summary_info;

      // POST 응답 데이터로 Summary 인스턴스 생성
      const summaryInstance = new Summary(
        summaryInfo.videoId,
        summaryInfo.title,
        summaryInfo.summary,
        summaryInfo.script,
        summaryInfo.status || 'pending'
      );

      // Redux store에 저장
      dispatch(setCurrentSummary(summaryInstance.toPlainObject()));

      // WebSocket 연결 설정
      setTimeout(() => setActiveVideoId(videoId), 100);
    } catch (error) {
      console.error('Error during summary creation:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Generate Summary</button>
      </form>
    </div>
  );
};
