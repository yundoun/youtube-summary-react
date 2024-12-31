import { useState } from 'react';
import webSocketService from '../../../infrastructure/services/websocket';

export const SummaryInput = () => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    // WebSocket 연결
    webSocketService.connect((type, data) => {
      if (type === 'summary') {
        console.log('Summary in progress:', data);
      } else if (type === 'complete') {
        console.log('Summary completed:', data);
      }
    });

    // 서버로 요청 보내기
    try {
      // 서버 API 호출 예시
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      console.log('Server response:', result);
    } catch (error) {
      console.error('Error creating summary:', error);
    } finally {
      webSocketService.close(); // WebSocket 종료
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />
      <button type="submit">Generate Summary</button>
    </form>
  );
};
