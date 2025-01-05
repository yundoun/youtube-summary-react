/* eslint-disable react/prop-types */
import 'react';

const parseSummary = (text) => {
  if (!text) return { summary: '', timeline: [] };

  // 특수문자 및 마크다운 문법 제거
  const cleanText = text.replace(/[#*[\]()]/g, '').trim();

  // "전체 줄거리 요약"과 타임라인 부분으로 분리
  const [summaryPart = '', timelinePart = ''] =
    cleanText.split(/타임라인 분석|주요 구간별 내용/);

  // "전체 줄거리 요약" 텍스트에서 레이블 제거
  const summary = summaryPart.replace('전체 줄거리 요약', '').trim();

  // 타임라인 항목 파싱
  const timelineItems = timelinePart
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // time://00:00:00 형식의 시간 추출
      const timeMatch = line.match(/\d{2}:\d{2}:\d{2}/);
      if (!timeMatch) return null;

      const time = timeMatch[0];
      // 시간과 내용 분리 후 앞쪽 시간 표시 제거
      const content = line
        .replace(/time:\/\/\d{2}:\d{2}:\d{2}/, '') // time:// 형식 제거
        .replace(/^\d{2}:\d{2}:\d{2}/, '') // 앞쪽 시간 표시 제거
        .trim();

      return { time, content };
    })
    .filter(Boolean);

  return { summary, timeline: timelineItems };
};

const TimelineItem = ({ time, content }) => (
  <div className="flex group items-start gap-4 relative pl-4">
    {/* 타임라인 선 */}
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-last:h-4"></div>

    {/* 타임라인 점 */}
    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500 -translate-x-1/2"></div>

    {/* 시간 표시 */}
    <div className="flex-shrink-0 w-24">
      <span className="inline-block px-2 py-1 text-sm font-mono text-blue-600 bg-blue-50 rounded">
        {time}
      </span>
    </div>

    {/* 내용 */}
    <div className="flex-grow pb-6">
      <p className="text-gray-700">{content}</p>
    </div>
  </div>
);

const getTimelineSectionTitle = (text) => {
  if (text.includes('주요 구간별 내용')) return '주요 구간별 내용';
  return '타임라인 분석';
};

const SummarySection = ({ selectedSummary }) => {
  if (!selectedSummary?.summary) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-gray-500 text-center">요약 정보를 불러오는 중...</p>
      </div>
    );
  }

  const { summary, timeline } = parseSummary(selectedSummary.summary);
  const timelineSectionTitle = getTimelineSectionTitle(selectedSummary.summary);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8">
      {/* 전체 줄거리 요약 섹션 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          전체 줄거리 요약
        </h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      </div>

      {/* 타임라인 섹션 */}
      {timeline.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            {timelineSectionTitle}
          </h2>
          <div className="space-y-2 ml-2">
            {timeline.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
