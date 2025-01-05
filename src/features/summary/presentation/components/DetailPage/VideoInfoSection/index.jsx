/* eslint-disable react/prop-types */
import 'react';
import ReactPlayer from 'react-player/youtube';
import { Clock, AlarmClock, Share2, BookmarkPlus, Youtube } from 'lucide-react';

const VideoInfoSection = ({ selectedSummary, videoId }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-sm mb-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{selectedSummary.title}</h1>

        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="100%"
            controls
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>영상 길이: {selectedSummary.duration || '정보 없음'}</span>
            </div>
            <div className="flex items-center text-blue-600">
              <AlarmClock className="w-5 h-5 mr-2" />
              <span>읽는 시간: {selectedSummary.readTime || '2분'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Share2 className="w-5 h-5" />
              <span>공유</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <BookmarkPlus className="w-5 h-5" />
              <span>저장</span>
            </button>
            <a
              href={`https://youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              <Youtube className="w-5 h-5" />
              <span>YouTube에서 보기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfoSection;
