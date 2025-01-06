import { useEffect } from 'react';
import { useSummary } from '../../../../hooks/useSummary';
import { SummaryList } from '../../../SummaryList';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';

export const SummaryListContainer = () => {
  const { summaries, fetchAllSummaries, isLoading } = useSummary();

  useEffect(() => {
    fetchAllSummaries()
      .then(() => console.log('모든 요약을 성공적으로 가져왔습니다'))
      .catch((error) =>
        console.error('요약을 가져오는 중 오류가 발생했습니다:', error)
      );
  }, [fetchAllSummaries]);

  if (isLoading && !summaries.length) {
    return <LoadingState />;
  }

  if (!isLoading && !summaries.length) {
    return <ErrorState />;
  }

  return <SummaryList summaries={summaries} />;
};
