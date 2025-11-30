import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Loader } from 'lucide-react';
import { StateCard } from '../components/StateCard';
import { useStates } from '../contexts/StateContext';
import { SortOption } from '../types';

interface HomeProps {
  comparisonList: string[];
  setComparisonList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Home: React.FC<HomeProps> = ({ comparisonList, setComparisonList }) => {
  const { states, loading } = useStates();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const filteredStates = useMemo(() => {
    let result = states.filter(state => 
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      state.tagline.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'aqi':
        result.sort((a, b) => a.aqi.value - b.aqi.value); // Lower is better
        break;
      case 'safety':
        result.sort((a, b) => b.womenSafetyScore - a.womenSafetyScore); // Higher is better
        break;
      case 'culture':
        result.sort((a, b) => b.culturalRichnessScore - a.culturalRichnessScore);
        break;
      case 'infrastructure':
        result.sort((a, b) => b.infrastructureScore - a.infrastructureScore);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [states, searchTerm, sortBy]);

  const toggleCompare = (id: string) => {
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Discover India's <span className="text-primary">Best Destinations</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Compare states by safety, air quality, culture, and more to find your perfect travel spot.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search state..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter size={20} className="text-slate-500 mr-2 flex-shrink-0" />
          <button 
            onClick={() => setSortBy('name')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${sortBy === 'name' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 text-slate-600'}`}
          >
            Name
          </button>
          <button 
            onClick={() => setSortBy('aqi')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${sortBy === 'aqi' ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600'}`}
          >
            Best Air Quality
          </button>
          <button 
            onClick={() => setSortBy('safety')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${sortBy === 'safety' ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600'}`}
          >
            Safest for Women
          </button>
           <button 
            onClick={() => setSortBy('culture')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${sortBy === 'culture' ? 'bg-primary text-white border-primary' : 'border-slate-300 text-slate-600'}`}
          >
            Culturally Rich
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center">
             <Loader className="animate-spin text-primary mb-4" size={48} />
             <p className="text-slate-500">Loading states and live AQI data...</p>
          </div>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredStates.map(state => (
            <StateCard 
              key={state.id} 
              state={state} 
              isSelected={comparisonList.includes(state.id)}
              onToggleCompare={toggleCompare}
              disableSelection={comparisonList.length >= 3}
            />
          ))}
          {filteredStates.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No states found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Floating Compare Action */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-bounce-in">
          <div>
            <span className="font-bold text-lg">{comparisonList.length}</span>
            <span className="text-slate-300 text-sm ml-2">Selected for comparison</span>
          </div>
          <Link 
            to="/compare" 
            className="bg-primary hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2"
          >
            Compare Now <ArrowRight size={16} />
          </Link>
          <button 
            onClick={() => setComparisonList([])}
            className="text-slate-400 hover:text-white text-sm underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};