// src/features/summary/presentation/components/SummaryList/index.jsx
import { SummaryCard } from './components/SummaryCard';

export const SummaryList = ({ summaries }) => {
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
