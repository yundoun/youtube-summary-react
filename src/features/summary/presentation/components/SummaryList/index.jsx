import { useEffect, useState } from 'react';
import { useSummary } from '../../hooks/useSummary';
import { SummaryItem } from '../SummaryItem';
import webSocketService from '../../../infrastructure/services/websocket';

export const SummaryList = () => {
  const { summaries, fetchAllSummaries, deleteSummary, isLoading } =
    useSummary();
  const [generatingSummaries, setGeneratingSummaries] = useState([]);

  useEffect(() => {
    fetchAllSummaries();
  }, []);

  useEffect(() => {
    // WebSocket 연결
    webSocketService.connect((type, data) => {
      if (type === 'summary') {
        // 새로운 요약 생성 시작
        setGeneratingSummaries((prev) => [...prev, data.videoId]);
      } else if (type === 'complete') {
        // 요약 생성 완료
        setGeneratingSummaries((prev) =>
          prev.filter((id) => id !== data.videoId)
        );
      }
    });

    return () => {
      // WebSocket 연결 해제
      webSocketService.close();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No summaries yet. Try adding a YouTube video!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary) => (
        <SummaryItem
          key={summary.videoId}
          summary={summary}
          isGenerating={generatingSummaries.includes(summary.videoId)}
          onDelete={deleteSummary}
        />
      ))}
    </div>
  );
};
