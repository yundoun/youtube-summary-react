/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useSummary } from '../../hooks/useSummary';

const SummaryCard = ({ summary, isActive }) => {
  return (
    <div
      className={`border rounded-lg shadow p-4 ${
        isActive ? 'border-blue-500' : ''
      }`}>
      <img
        src={summary.thumbnailUrl}
        alt={`${summary.title} thumbnail`}
        className="w-full h-auto rounded-lg"
      />
      <h3 className="mt-2 font-bold text-lg">{summary.title}</h3>
      <div className="mt-2">
        {summary.status === 'pending' || summary.status === 'in_progress' ? (
          <div className="flex items-center space-x-2 text-blue-500">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent" />
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
      {summary.status === 'completed' && summary.createdAt && (
        <div className="mt-2 text-sm text-gray-500">
          Created at: {new Date(summary.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export const SummaryList = () => {
  const { summaries, currentSummary, fetchAllSummaries, isLoading } =
    useSummary();

  useEffect(() => {
    console.log('SummaryList mounted, fetching summaries...');
    fetchAllSummaries();
  }, [fetchAllSummaries]);

  useEffect(() => {
    console.log('Current summaries state:', summaries);
  }, [summaries]);

  if (isLoading && !summaries.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isLoading && !summaries.length) {
    console.log('No summaries found');
    return (
      <div className="text-center text-gray-500 mt-8">
        No summaries yet. Try adding a YouTube video!
      </div>
    );
  }

  console.log('Rendering summaries list:', summaries);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(summaries) &&
        summaries.map((summary) => (
          <SummaryCard
            key={`${summary.videoId}-${summary.status}`}
            summary={summary}
            isActive={currentSummary?.videoId === summary.videoId}
          />
        ))}
    </div>
  );
};
