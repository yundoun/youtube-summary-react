import 'react';
import { SummaryInput } from '../components/SummaryInput';
import { SummaryList } from '../components/SummaryList';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">
              SUMMARY<span className="text-blue-600">HUB</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900">
                Login
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Hero Section with SummaryInput */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-50/50 py-20">
          <SummaryInput />
        </div>

        {/* Summary List Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <SummaryList />
          </div>
        </div>
      </div>
    </div>
  );
};
