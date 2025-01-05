/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSummary } from '../../hooks/useSummary';
import { Clock, ArrowUpRight } from 'lucide-react';

const extractPreview = (summaryText) => {
  if (!summaryText) return '요약 생성 중...';

  // 특수문자 제거 및 정리
  const cleanText = summaryText.replace(/[#*\[\]()]/g, '').trim();

  // 전체 줄거리 요약 부분 추출
  const summaryMatch = cleanText.match(
    /전체 줄거리 요약(.*?)(?=타임라인 분석|주요 구간별 내용|$)/s
  );

  if (summaryMatch && summaryMatch[1]) {
    // 전체 줄거리 요약에서 첫 3문장 추출
    const sentences = summaryMatch[1]
      .trim()
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 3);

    return sentences.join(' ');
  }

  // 전체 줄거리 요약이 없는 경우 일반 텍스트에서 첫 3문장 추출
  const sentences = cleanText
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  return sentences.join(' ');
};

// script 속성에서 모든 텍스트 객체의 duration 값을 합산하여 계산
const calculateDuration = (script) => {
  if (!script) return null;

  try {
    const parsedScript = JSON.parse(script);
    return parsedScript.reduce((total, segment) => total + segment.duration, 0);
  } catch (error) {
    console.error('스크립트 파싱 오류:', error);
    return null;
  }
};

//  readTime은 summary의 텍스트 길이에 따라 대략적인 읽기 시간을 계산합니다. 평균적인 사람의 읽기 속도를 200단어/분으로 가정
const calculateReadTime = (summaryText) => {
  if (!summaryText) return '2분';

  const words = summaryText.split(/\s+/).length; // 단어 수 계산
  const wordsPerMinute = 200; // 평균 읽기 속도 (단어/분)
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes}분`;
};

const formatDuration = (durationInSeconds) => {
  if (!durationInSeconds) return '불러오는 중';

  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds > 0 ? `${seconds}초` : ''}`;
  } else {
    return `${seconds}초`;
  }
};

const SummaryCard = ({ summary }) => {
  const navigate = useNavigate();
  const previewText = extractPreview(summary.summary);

  const duration = calculateDuration(summary.script);
  const formattedDuration = formatDuration(duration);
  const readTime = calculateReadTime(summary.summary);

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

          <p className="text-gray-600 line-clamp-3">{previewText}</p>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>원본 길이: {formattedDuration}</span>
            </div>
            <span className="text-blue-600">읽는 시간: {readTime}</span>
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
    // console.log('SummaryList mounted, fetching summaries...');
    fetchAllSummaries()
      .then(() => console.log('모든 요약을 성공적으로 가져왔습니다'))
      .catch((error) =>
        console.error('요약을 가져오는 중 오류가 발생했습니다:', error)
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
