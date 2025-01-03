import { useEffect } from 'react';
import { SummaryInput } from './features/summary/presentation/components/SummaryInput/index.jsx';
import { SummaryList } from './features/summary/presentation/components/SummaryList/index.jsx';
import { initDB } from './core/storage/db';
import { syncService } from './features/summary/infrastructure/services/syncService';

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 로컬 데이터베이스 초기화
        await initDB();

        // 서버와 로컬 데이터 동기화
        await syncService.syncWithServer();
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initializeApp();

    // 온라인 상태 변경 시 동기화 수행
    const handleOnlineStatusChange = async () => {
      await syncService.handleOnlineStatusChange();
    };

    window.addEventListener('online', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
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
