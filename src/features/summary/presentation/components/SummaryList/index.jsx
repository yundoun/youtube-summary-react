import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSummary } from '../../hooks/useSummary';

export const SummaryList = () => {
  const { fetchAllSummaries } = useSummary();
  const { summaries, isLoading } = useSelector(
    (state) => state.summaryFeature.summary
  );

  useEffect(() => {
    fetchAllSummaries();
  }, [fetchAllSummaries]);

  // YouTube 썸네일 URL 생성 함수
  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!summaries || summaries.length === 0) {
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
            src={getYouTubeThumbnail(summary.videoId)}
            alt={`${summary.title} thumbnail`}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              // maxresdefault가 없는 경우 hqdefault로 폴백
              e.target.src = `https://img.youtube.com/vi/${summary.videoId}/hqdefault.jpg`;
            }}
          />
          <h3 className="mt-2 font-bold text-lg truncate">{summary.title}</h3>
          <p className="mt-2 text-gray-600 line-clamp-3">{summary.summary}</p>
        </div>
      ))}
    </div>
  );
};
