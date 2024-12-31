import { useState, useRef } from 'react';
import { useSummary } from '../../hooks/useSummary';

export const SummaryInput = () => {
  const [url, setUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { createSummary, isLoading, error } = useSummary();
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSummary(url);
      setUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="w-full p-4 rounded-lg shadow-lg text-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`mt-4 w-full p-4 rounded-lg text-white font-bold transition-colors ${
            isHovered ? 'bg-blue-600' : 'bg-blue-500'
          } ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}>
          {isLoading ? 'Generating Summary...' : 'Start Summary'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
