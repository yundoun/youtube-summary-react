// App.jsx
import { useEffect } from 'react';
import { SummaryInput } from './features/summary/presentation/components/SummaryInput/index.jsx';
import { SummaryList } from './features/summary/presentation/components/SummaryList/index.jsx';
import { initDB } from './core/storage/db';
import { summaryUseCases } from './features/summary/domain/useCases/summaryUseCase.js';

function App() {
  useEffect(() => {
    initDB();
    const handleOnline = () => {
      summaryUseCases.syncWithLocalStorage();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
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
