import { SummaryInput } from './features/summary/presentation/components/SummaryInput/index.jsx';
import { SummaryList } from './features/summary/presentation/components/SummaryList/index.jsx';

function App() {
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
