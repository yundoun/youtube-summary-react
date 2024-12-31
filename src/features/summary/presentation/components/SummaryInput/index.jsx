import { useEffect, useState } from 'react';
import webSocketService from '../../../infrastructure/services/websocket';
import { extractVideoId } from '../../../../../core/utils/videoId';

export const SummaryInput = () => {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      webSocketService.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      console.warn('URL is empty!');
      return;
    }

    setLoading(true);
    setSummary(null);

    // 1. videoId 추출 및 검증
    const videoId = extractVideoId(url);
    if (!videoId) {
      console.error('Invalid YouTube URL');
      setLoading(false);
      return;
    }

    console.log('Starting WebSocket connection...');
    // WebSocket 연결 - videoId만 전송
    webSocketService.connect(videoId);

    // 2. WebSocket 메시지 핸들러 설정
    webSocketService.setMessageHandler((type, data) => {
      console.log(`WebSocket event received: type=${type}`, data);
      if (type === 'summary') {
        console.log('Summary in progress:', data);
      } else if (type === 'complete') {
        console.log('Summary completed:', data);
        setSummary(data);
        setLoading(false);
        webSocketService.close();
      }
    });

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
        setLoading(false);
        webSocketService.close();
      } else {
        const responseData = await response.json();
        console.log('POST request successful. Response data:', responseData);
      }
    } catch (error) {
      console.error('Error during POST request:', error);
      setLoading(false);
      webSocketService.close();
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
        <button type="submit" disabled={loading}>
          Generate Summary
        </button>
      </form>

      {loading && <p>Generating summary...</p>}
      {summary && (
        <div>
          <h2>Summary:</h2>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
