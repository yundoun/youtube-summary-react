/* eslint-disable react/prop-types */
import 'react';
import { ArrowRight } from 'lucide-react';

const InputField = ({
  url,
  onChange,
  onSubmit,
  isProcessing,
  isInputActive,
  onFocus,
  onBlur,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full relative">
      <input
        type="text"
        placeholder="붙여넣기 하거나 YouTube URL을 입력하세요"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={isProcessing}
        className={`w-full px-6 py-4 bg-white rounded-2xl border-2 
          ${isProcessing ? 'border-blue-200' : 'border-gray-200'} 
          focus:border-blue-500 outline-none text-lg shadow-sm 
          transition-all duration-300
          ${isInputActive ? 'scale-102' : 'scale-100'}`}
      />
      <button
        type="submit"
        disabled={isProcessing || !url.trim()}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl 
          flex items-center space-x-2 transition-all duration-200
          ${
            isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
        <span>{isProcessing ? '처리중...' : '요약하기'}</span>
        {!isProcessing && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
};

export default InputField;
