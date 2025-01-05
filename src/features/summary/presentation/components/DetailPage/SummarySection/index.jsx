// features/summary/presentation/components/SummarySection/index.jsx
import React from 'react';

const parseContent = (text) => {
  if (!text) return { summary: '', timeline: [] };

  // 전체 줄거리와 타임라인 분리
  const [summaryPart = '', timelinePart = ''] = text.split('[타임라인 분석]');

  // 전체 줄거리 처리
  const summary = summaryPart.replace('[전체 줄거리 요약]', '').trim();

  // 타임라인 처리
  const timelineRegex = /\[(\d{2}:\d{2}:\d{2})\].*?\) (.*?)(?=\[|$)/gs;
  const timeline = [];
  let match;

  while ((match = timelineRegex.exec(timelinePart)) !== null) {
    const timestamp = match[1];
    const content = match[2];
    const [title, ...points] = content
      .split('•')
      .map((item) => item.trim())
      .filter(Boolean);

    timeline.push({
      time: timestamp,
      title,
      points,
    });
  }

  return { summary, timeline };
};

const SummarySection = ({ selectedSummary }) => {
  if (!selectedSummary?.summary) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <p className="text-gray-500 text-center">요약 정보를 불러오는 중...</p>
      </div>
    );
  }

  const { summary, timeline } = parseContent(selectedSummary.summary);

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

      {/* 타임라인 분석 섹션 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          타임라인 분석
        </h2>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-baseline gap-4 mb-2">
                {/* 타임스탬프 */}
                <button
                  className="flex-shrink-0 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg 
                           font-mono text-sm group-hover:bg-blue-100 transition-colors"
                  onClick={() => console.log(`Seek to ${item.time}`)}>
                  {item.time}
                </button>
                {/* 제목 */}
                <h3 className="font-medium text-gray-900">{item.title}</h3>
              </div>
              {/* 세부 내용 */}
              {item.points.length > 0 && (
                <ul className="ml-24 space-y-2">
                  {item.points.map((point, pIndex) => (
                    <li
                      key={pIndex}
                      className="text-gray-600 before:content-['•'] before:mr-2 before:text-gray-400">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
