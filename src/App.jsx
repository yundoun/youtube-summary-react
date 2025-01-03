import { SummaryInput } from './features/summary/presentation/components/SummaryInput/index.jsx';
import { SummaryList } from './features/summary/presentation/components/SummaryList/index.jsx';

function App() {
  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       // 유스케이스를 통해 서버에서 요약 데이터를 가져옴
  //       const summaries = await summaryUseCases.getSummaryAll();
  //       console.log('Fetched summaries:', summaries);

  //       // 상태 업데이트
  //       summaries.forEach((summary) => {
  //         dispatch(setCurrentSummary(summary));
  //       });
  //     } catch (error) {
  //       console.error('Error during initialization:', error);
  //     }
  //   };

  //   initializeApp();
  // }, [dispatch]);

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
