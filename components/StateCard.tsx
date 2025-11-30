import React from 'react';
import { Link } from 'react-router-dom';
import { StateProfile } from '../types';
import { Wind, ShieldCheck, Users, Info } from 'lucide-react';

interface StateCardProps {
  state: StateProfile;
  isSelected: boolean;
  onToggleCompare: (id: string) => void;
  disableSelection: boolean;
}

export const StateCard: React.FC<StateCardProps> = ({ 
  state, 
  isSelected, 
  onToggleCompare,
  disableSelection
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-hidden border border-slate-100 flex flex-col h-full relative group">
      {/* Image Header */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={state.imageUrl} 
          alt={state.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-xl font-bold">{state.name}</h3>
          <p className="text-xs font-light italic opacity-90">{state.tagline}</p>
        </div>
        
        {/* Comparison Checkbox */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!disableSelection || isSelected) {
                onToggleCompare(state.id);
              }
            }}
            disabled={disableSelection && !isSelected}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isSelected 
                ? 'bg-primary text-white ring-2 ring-offset-2 ring-primary' 
                : 'bg-white text-slate-400 hover:text-primary hover:bg-slate-50'
            } ${disableSelection && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title="Compare State"
          >
            <span className="sr-only">Compare</span>
            {isSelected ? (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            ) : (
               <span className="font-bold text-xs w-5 h-5 flex items-center justify-center">+</span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 flex-grow">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <Wind size={16} className={state.aqi.value < 100 ? "text-emerald-500" : "text-amber-500"} />
            <span className="text-xs font-semibold mt-1">AQI {state.aqi.value}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <ShieldCheck size={16} className={state.womenSafetyScore > 7 ? "text-emerald-500" : "text-red-500"} />
            <span className="text-xs font-semibold mt-1">Safety {state.womenSafetyScore}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
            <Users size={16} className={state.civicSenseScore > 7 ? "text-emerald-500" : "text-amber-500"} />
            <span className="text-xs font-semibold mt-1">Civic {state.civicSenseScore}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">{state.description}</p>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <Link 
          to={`/state/${state.id}`}
          className="block w-full text-center py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};