import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Youtube,
  Clock,
  AlarmClock,
  Share2,
  BookmarkPlus,
} from 'lucide-react';
import {
  fetchSelectedSummary,
  clearSelectedSummary,
  setSelectedSummary,
} from '../../../summary/aplication/store/summarySlice';

export const DetailPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  // Redux 상태를 개별적으로 가져오기
  const selectedSummary = useSelector(
    (state) => state.summaryFeature.summary.selectedSummary
  );
  const summaries = useSelector(
    (state) => state.summaryFeature.summary.summaries
  );
  const isLoading = useSelector(
    (state) => state.summaryFeature.summary.isLoading
  );

  // 데이터 로딩 로직
  useEffect(() => {
    const loadSummary = async () => {
      if (!videoId) return;
      console.log('비디오 ID에 대한 요약을 가져오는 중:', videoId); // 로그 추가
      try {
        // 먼저 existing summaries에서 찾기
        const existingSummary = summaries.find((s) => s.videoId === videoId);
        if (existingSummary) {
          dispatch(setSelectedSummary(existingSummary));
          console.log('요약을 성공적으로 가져왔습니다:', existingSummary); // 로그 추가
          return;
        }

        // API에서 데이터 가져오기
        const result = await dispatch(fetchSelectedSummary(videoId)).unwrap();
        if (result) {
          dispatch(setSelectedSummary(result));
        }
      } catch (error) {
        console.error('Failed to fetch summary:', error);
        setError(error.message);
      }
    };

    loadSummary();

    // Cleanup function
    return () => {
      dispatch(clearSelectedSummary());
    };
  }, [videoId, dispatch, summaries]);

  // 에러 상태 처리
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // 요약 정보가 없는 경우 처리
  if (!selectedSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">요약 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 바 */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-6 py-8">
        {/* 비디오 정보 섹션 */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{selectedSummary.title}</h1>

            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={selectedSummary.thumbnailUrl}
                alt={selectedSummary.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>
                    영상 길이: {selectedSummary.duration || '정보 없음'}
                  </span>
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

        {/* 요약 및 타임라인 섹션 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 요약 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">요약</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {selectedSummary.summary}
            </div>
          </div>

          {/* 오른쪽: 타임라인 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">타임라인</h2>
            <div className="space-y-6">
              {(selectedSummary.timeline || []).map((item, index) => (
                <div
                  key={index}
                  className="relative pl-8 border-l-2 border-blue-100 hover:border-blue-500">
                  <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-blue-500" />
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-sm font-mono text-blue-600">
                        {item.time}
                      </span>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {item.points?.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
