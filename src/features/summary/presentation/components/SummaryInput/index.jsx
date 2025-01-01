import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import { extractVideoId } from '../../../../../core/utils/videoId';
import { setLoading } from '../../../infrastructure/store/summarySlice';

export const SummaryInput = () => {
  const [url, setUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();

  useWebSocket(activeVideoId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      console.warn('URL is empty!');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      console.error('Invalid YouTube URL');
      return;
    }

    dispatch(setLoading(true));
    setActiveVideoId(null); // 기존 연결 초기화

    try {
      console.log('Sending POST request to /summary/content with URL:', url);
      const response = await fetch('/summary/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      console.log('POST request response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          'Server returned an error:',
          response.status,
          response.statusText,
          errorText
        );
        dispatch(setLoading(false));
      } else {
        const responseData = await response.json();
        console.log('POST request successful. Response data:', responseData);
        // 약간의 지연 후 새 WebSocket 연결 설정
        setTimeout(() => setActiveVideoId(videoId), 100);
      }
    } catch (error) {
      console.error('Error during POST request:', error);
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
