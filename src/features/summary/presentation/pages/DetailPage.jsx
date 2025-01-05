/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import {
  fetchSelectedSummary,
  clearSelectedSummary,
  setSelectedSummary,
} from '../../aplication/store/summarySlice';

import NavigationBar from '../components/DetailPage/NavigationBar';
import VideoInfoSection from '../components/DetailPage/VideoInfoSection';
import SummarySection from '../components/DetailPage/SummarySection';
import ScriptSection from '../components/DetailPage/ScriptSection';

export const DetailPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [parsedScript, setParsedScript] = useState([]);

  const selectedSummary = useSelector(
    (state) => state.summaryFeature.summary.selectedSummary
  );
  const summaries = useSelector(
    (state) => state.summaryFeature.summary.summaries
  );
  const isLoading = useSelector(
    (state) => state.summaryFeature.summary.isLoading
  );

  useEffect(() => {
    if (selectedSummary?.script) {
      try {
        const scriptData =
          typeof selectedSummary.script === 'string'
            ? JSON.parse(selectedSummary.script)
            : selectedSummary.script;
        setParsedScript(scriptData);
      } catch (e) {
        console.error('Script parsing error:', e);
        setParsedScript([]);
      }
    }
  }, [selectedSummary]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!videoId) return;
      try {
        const existingSummary = summaries.find((s) => s.videoId === videoId);
        if (existingSummary) {
          dispatch(setSelectedSummary(existingSummary));
          return;
        }

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

    return () => {
      dispatch(clearSelectedSummary());
    };
  }, [videoId, dispatch, summaries]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

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
      <NavigationBar />

      <main className="container mx-auto px-6 py-8">
        <VideoInfoSection selectedSummary={selectedSummary} videoId={videoId} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SummarySection selectedSummary={selectedSummary} />
          <ScriptSection parsedScript={parsedScript} />
        </div>
      </main>
    </div>
  );
};

export default DetailPage;
