import { useWebSocket } from '../../hooks/useWebSocket';
import { useSummaryInput } from '../../hooks/useSummaryInput';

export const SummaryInput = () => {
  const { url, setUrl, handleSubmit, activeVideoId } = useSummaryInput();

  useWebSocket(activeVideoId);

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Generate Summary
          </button>
        </div>
      </form>
    </div>
  );
};
