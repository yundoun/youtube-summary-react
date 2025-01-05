/* eslint-disable react/prop-types */
import 'react';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ScriptSection = ({ parsedScript }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">스크립트</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {parsedScript.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-baseline gap-4">
              <span className="text-sm font-mono text-blue-600 whitespace-nowrap">
                {formatTime(item.start)}
              </span>
              <p className="text-gray-700">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptSection;
