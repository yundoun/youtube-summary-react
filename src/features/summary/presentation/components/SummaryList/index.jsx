import { useEffect } from 'react';
import { useSummary } from '../../hooks/useSummary';

export const SummaryList = () => {
  const { summaries, currentSummary, fetchAllSummaries, isLoading } =
    useSummary();

  // 초기 데이터 로드
  useEffect(() => {
    fetchAllSummaries();
  }, [fetchAllSummaries]);

  // 현재 요약이 완료되면 목록 업데이트
  useEffect(() => {
    if (currentSummary?.status === 'completed') {
      fetchAllSummaries();
    }
  }, [currentSummary?.status, fetchAllSummaries]);

  if (isLoading && !summaries.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoading && summaries.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No summaries yet. Try adding a YouTube video!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary) => (
        <div
          key={summary.videoId}
          className={`border rounded-lg shadow p-4 ${
            currentSummary?.videoId === summary.videoId ? 'border-blue-500' : ''
          }`}>
          <img
            src={summary.thumbnailUrl}
            alt={`${summary.title} thumbnail`}
            className="w-full h-auto rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">{summary.title}</h3>
          <div className="mt-2">
            {summary.status === 'pending' ||
            summary.status === 'in_progress' ? (
              <div className="flex items-center space-x-2 text-blue-500">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                <span>
                  {summary.status === 'pending'
                    ? 'Waiting...'
                    : 'Generating summary...'}
                </span>
              </div>
            ) : (
              <p className="text-gray-600">{summary.summary}</p>
            )}
          </div>
          {summary.status === 'completed' && (
            <div className="mt-2 text-sm text-gray-500">
              Created at: {new Date(summary.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
