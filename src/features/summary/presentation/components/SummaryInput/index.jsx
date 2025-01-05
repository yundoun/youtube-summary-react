import React, { useState } from 'react';
import styles from './SummaryInput.module.css';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useSummaryInput } from '../../hooks/useSummaryInput';
import {
  ArrowRight,
  Clock,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SummaryInput = () => {
  const { url, setUrl, handleSubmit, activeVideoId } = useSummaryInput();
  const [isInputActive, setIsInputActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useWebSocket(activeVideoId);

  const steps = [
    { icon: <FileText className="w-5 h-5" />, label: '스크립트 추출 중...' },
    { icon: <Sparkles className="w-5 h-5" />, label: 'AI 분석 중...' },
    { icon: <Clock className="w-5 h-5" />, label: '요약문 생성 중...' },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsProcessing(true);
    setError('');

    try {
      await handleSubmit(e);
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (err) {
      setError('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  return (
    <div
      className={`${styles['fade-in']} w-full max-w-3xl mx-auto text-center space-y-6`}>
      <div>
        <h1
          className={`${styles['animated-text']} text-5xl font-bold mb-6 leading-tight`}>
          Watch Less,
        </h1>
        <h1
          className={`${styles['animated-text']} text-5xl font-bold mb-6 leading-tight text-blue-600`}>
          Understand More
        </h1>
      </div>
      <p className="text-xl text-gray-600 mb-12">
        AI가 영상을 분석하고 핵심 내용을 추출합니다.
        <br />긴 영상도 몇 분 안에 파악하세요.
      </p>

      <div
        className={`transition-all duration-300 ${
          isInputActive ? 'scale-102' : 'scale-100'
        }`}>
        <div className="flex flex-col items-center space-y-4">
          <form onSubmit={handleFormSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="붙여넣기 하거나 YouTube URL을 입력하세요"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsInputActive(true)}
              onBlur={() => setIsInputActive(false)}
              disabled={isProcessing}
              className={`w-full px-6 py-4 bg-white rounded-2xl border-2 
                ${isProcessing ? 'border-blue-200' : 'border-gray-200'} 
                ${error ? 'border-red-200' : ''}
                focus:border-blue-500 outline-none text-lg shadow-sm ${
                  styles['input-focus']
                }`}
            />
            <button
              type="submit"
              disabled={isProcessing || !url.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl 
                flex items-center space-x-2 transition-all duration-200 ${
                  styles['button-press']
                }
                ${
                  isProcessing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
              <span>{isProcessing ? '처리중...' : '요약하기'}</span>
              {!isProcessing && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <br />

          {/* 서비스 소개 섹션 */}
          <div className="pt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: <FileText className="w-8 h-8 text-blue-600" />,
                  title: '스크립트 추출',
                  description: '영상에서 자동으로 텍스트 추출',
                },
                {
                  icon: <Sparkles className="w-8 h-8 text-blue-600" />,
                  title: 'AI 분석',
                  description: '핵심 내용 자동 분석',
                },
                {
                  icon: <Clock className="w-8 h-8 text-blue-600" />,
                  title: '요약 완성',
                  description: '간단명료한 요약문 생성',
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {isProcessing && (
            <div className="w-full bg-white rounded-2xl p-6 border border-blue-100 mt-4">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isComplete = currentStep > index;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center space-y-2 ${
                        isActive ? styles['step-active'] : ''
                      }`}>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center
                        ${isActive ? 'bg-blue-100 text-blue-600' : ''}
                        ${
                          isComplete
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        } ${isComplete ? styles['success-animate'] : ''}`}>
                        {isComplete ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : isActive ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium
                        ${isActive ? 'text-blue-600' : ''}
                        ${isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-500 mt-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryInput;
