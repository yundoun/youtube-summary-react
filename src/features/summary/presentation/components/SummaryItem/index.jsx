/* eslint-disable react/prop-types */
export const SummaryItem = ({ summary, isGenerating, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={summary.thumbnailUrl || 'default-thumbnail.png'} // 썸네일 기본값 설정
          alt={summary.title || 'No Title'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30">
          <h3 className="text-white text-xl font-bold p-4">
            {summary.title || 'Untitled Video'}
          </h3>
        </div>
      </div>

      <div className="p-4">
        {isGenerating ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Generating summary...</span>
          </div>
        ) : (
          <div>
            <h4 className="font-bold mb-2">Summary:</h4>
            <p className="text-gray-700">
              {summary.summary || 'Summary is not available yet.'}
            </p>
          </div>
        )}

        <button
          onClick={() => onDelete(summary.videoId)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};
