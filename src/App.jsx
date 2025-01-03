import { useEffect } from 'react';
import { SummaryInput } from './features/summary/presentation/components/SummaryInput/index.jsx';
import { SummaryList } from './features/summary/presentation/components/SummaryList/index.jsx';
import { initDB } from './core/storage/db';
import { summaryStorage } from './core/storage/summaryStorage.js';
import { summaryApi } from './features/summary/infrastructure/services/api.js';

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 로컬 데이터베이스 초기화
        await initDB();

        // 서버에서 데이터를 가져옴
        const response = await summaryApi.getSummaryAll();
        const serverSummaries = response?.data?.summary_list || [];

        console.log('Server summaries fetched:', serverSummaries);

        // 서버와 로컬 데이터 동기화
        await summaryStorage.syncWithServer(serverSummaries);
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeApp();

    // 온라인 상태가 변경될 때 동기화
    const handleOnline = async () => {
      try {
        const response = await summaryApi.getSummaryAll();
        const serverSummaries = response?.data?.summary_list || [];
        await summaryStorage.syncWithServer(serverSummaries);
      } catch (error) {
        console.error('Error during online sync:', error);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">YouTube Summary</h1>
      <SummaryInput />
      <div className="mt-8">
        <SummaryList />
      </div>
    </div>
  );
}

export default App;
