/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSummary } from '../../hooks/useSummary';
import { Clock, ArrowUpRight } from 'lucide-react';

const SummaryCard = ({ summary }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/summary/${summary.videoId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex space-x-6">
        {/* Thumbnail */}
        <div className="relative w-64 aspect-video bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow">
          <img
            src={summary.thumbnailUrl}
            alt={summary.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {summary.status === 'completed' ? '완료' : '진행 중'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(summary.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
                {summary.title}
              </h3>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          </div>

          <p className="text-gray-600 line-clamp-2">
            {summary.summary || '요약 생성 중...'}
          </p>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>원본 길이: {summary.duration || '불러오는 중'}</span>
            </div>
            <span className="text-blue-600">
              읽는 시간: {summary.readTime || '2분'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SummaryList = () => {
  const { summaries, fetchAllSummaries, isLoading } = useSummary();

  // summaries와 isLoading 상태 확인
  console.log('Current summaries:', summaries);
  console.log('Loading state:', isLoading);

  useEffect(() => {
    console.log('SummaryList mounted, fetching summaries...');
    fetchAllSummaries()
      .then(() => console.log('Fetch all summaries completed successfully'))
      .catch((error) =>
        console.error('Error occurred while fetching summaries:', error)
      );
  }, [fetchAllSummaries]);

  if (isLoading && !summaries.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isLoading && !summaries.length) {
    return (
      <div className="text-center text-gray-500 mt-8">
        서버와의 연결이 종료되었습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Latest Summaries</h2>
          <p className="text-gray-600">최근에 요약된 콘텐츠를 확인하세요</p>
        </div>
      </div>
      <div className="grid gap-6">
        {summaries.map((summary) => (
          <SummaryCard
            key={`${summary.videoId}-${summary.status}`}
            summary={summary}
          />
        ))}
      </div>
    </div>
  );
};
