import { useWebSocket } from '../../hooks/useWebSocket';
import { useSummaryInput } from '../../hooks/useSummaryInput';

export const SummaryInput = () => {
  const { url, setUrl, handleSubmit, activeVideoId } = useSummaryInput();

  useWebSocket(activeVideoId);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Generate Summary</button>
      </form>
    </div>
  );
};
