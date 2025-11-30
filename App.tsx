import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { StateDetail } from './pages/StateDetail';
import { Comparison } from './pages/Comparison';
import { Map } from 'lucide-react';
import { StateProvider } from './contexts/StateContext';

const App: React.FC = () => {
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  return (
    <StateProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          {/* Navigation Bar */}
          <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                <div className="bg-primary text-white p-1.5 rounded-lg">
                  <Map size={24} />
                </div>
                IndiTravel
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/" className="text-slate-600 hover:text-primary font-medium transition-colors">Home</Link>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="text-xs text-slate-400">Explore India</div>
              </div>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-grow bg-slate-50">
            <Routes>
              <Route path="/" element={<Home comparisonList={comparisonList} setComparisonList={setComparisonList} />} />
              <Route path="/state/:id" element={<StateDetail />} />
              <Route path="/compare" element={<Comparison ids={comparisonList} setComparisonList={setComparisonList} />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="mb-2 text-white font-semibold">IndiTravel &copy; 2024</p>
              <p className="text-sm">Helping you discover the diverse beauty of India safely.</p>
              <div className="mt-4 text-xs opacity-50">
                AQI Data provided by Open-Meteo API (Real-time). Other metrics are demonstrative.
              </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    </StateProvider>
  );
};

export default App;