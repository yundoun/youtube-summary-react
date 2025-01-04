import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './features/summary/presentation/pages/HomePage';
import { DetailPage } from './features/summary/presentation/pages/DetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/summary/:videoId" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
