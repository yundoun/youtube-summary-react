import { useEffect } from 'react';
import { useSummary } from '../../hooks/useSummary';

export const SummaryList = () => {
  const { summaries, fetchAllSummaries, isLoading } = useSummary();

  useEffect(() => {
    // 요약 데이터 가져오기
    fetchAllSummaries();
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
        <div key={summary.videoId} className="border rounded-lg shadow p-4">
          <img
            src={summary.thumbnailUrl}
            alt={`${summary.title} thumbnail`}
            className="w-full h-auto rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">{summary.title}</h3>
          <p className="mt-2 text-gray-600">{summary.summary}</p>
        </div>
      ))}
    </div>
  );
};
