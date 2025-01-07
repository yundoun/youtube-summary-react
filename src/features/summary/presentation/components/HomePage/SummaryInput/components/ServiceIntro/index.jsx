import 'react';
import { SERVICE_CARDS } from './CardList';

const ServiceIntro = () => {
  return (
    <div className="pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
        {/* 연결선 */}
        <div className="absolute top-1/2 left-1/3 w-1/6 h-0.5 bg-gray-200 transform -translate-y-1/2 hidden md:block" />
        <div className="absolute top-1/2 right-1/3 w-1/6 h-0.5 bg-gray-200 transform -translate-y-1/2 hidden md:block" />

        {/* 서비스 카드 */}
        {SERVICE_CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center relative">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 mb-1">
                {card.title}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {card.subtitle}
              </h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceIntro;
