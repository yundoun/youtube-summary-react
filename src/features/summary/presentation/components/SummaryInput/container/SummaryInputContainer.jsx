import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useSummaryInput } from '../../../hooks/useSummaryInput';
import styles from '../styles/animations.module.css';

import InputField from '../components/InputField';
import ProgressBar from '../components/ProgressBar';
import ServiceIntro from '../components/ServiceIntro';
import ErrorMessage from '../components/ErrorMessage';

export const SummaryInputContainer = () => {
  const [isInputActive, setIsInputActive] = useState(false);
  const { error } = useSelector((state) => state.summaryFeature.summary);
  const { processStatus } = useSelector(
    (state) => state.summaryFeature.summary
  );

  const { url, setUrl, handleSubmit, activeVideoId } = useSummaryInput();

  useWebSocket(activeVideoId);

  return (
    <div
      className={`${styles.fadeIn} w-full max-w-3xl mx-auto text-center space-y-6`}>
      <div>
        <h1
          className={`${styles.animatedText} text-5xl font-bold mb-6 leading-tight`}>
          Watch Less,
        </h1>
        <h1
          className={`${styles.animatedText} text-5xl font-bold mb-6 leading-tight text-blue-600`}>
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
          <InputField
            url={url}
            onChange={setUrl}
            onSubmit={handleSubmit}
            isProcessing={processStatus.isProcessing}
            isInputActive={isInputActive}
            onFocus={() => setIsInputActive(true)}
            onBlur={() => setIsInputActive(false)}
          />

          <ErrorMessage message={error} />

          {processStatus.isProcessing ? (
            <ProgressBar currentStep={processStatus.currentStep} />
          ) : (
            <ServiceIntro />
          )}
        </div>
      </div>
    </div>
  );
};
