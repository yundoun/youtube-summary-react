/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import {
  extractPreview,
  calculateDuration,
  calculateReadTime,
  formatDuration,
} from '../../../../../../../core/utils';

export const SummaryCard = ({ summary }) => {
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
