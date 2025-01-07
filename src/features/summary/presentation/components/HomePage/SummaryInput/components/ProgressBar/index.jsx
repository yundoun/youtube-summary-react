/* eslint-disable react/prop-types */
import 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { PROGRESS_STEPS } from './Steps';

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-blue-100 mt-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">요약 진행 상황</h3>
      <div className="flex justify-between items-center relative">
        {/* 프로그레스 라인 */}
        <div className="absolute left-0 right-0 h-1 top-6 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${
                ((currentStep - 1) / (PROGRESS_STEPS.length - 1)) * 100
              }%`,
            }}
          />
        </div>

        {/* 진행 단계들 */}
        {PROGRESS_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isComplete = currentStep > stepNumber;
          const isFinal = stepNumber === PROGRESS_STEPS.length;
          const Icon = step.icon;

          return (
            <div
              key={index}
              className={`flex flex-col items-center space-y-3 relative ${
                isActive ? 'scale-110 transition-transform duration-300' : ''
              }`}>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center 
                transition-all duration-300 z-10
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 shadow-lg ring-4 ring-blue-50'
                    : ''
                }
                ${
                  isComplete
                    ? 'bg-green-100 text-green-600'
                    : !isActive
                    ? 'bg-gray-100 text-gray-400'
                    : ''
                }`}>
                {isComplete ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : isActive ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Icon className="w-7 h-7" />
                )}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap px-4 py-2 rounded-full
                transition-all duration-300
                ${isActive ? 'bg-blue-50 text-blue-600' : ''}
                ${isComplete ? 'text-green-600' : 'text-gray-400'}
                ${
                  isFinal && isActive
                    ? 'bg-green-50 text-green-600 animate-bounce'
                    : ''
                }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
