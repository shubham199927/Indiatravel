import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStates } from '../contexts/StateContext';
import { MetricMeter } from '../components/MetricMeter';
import { MapPin, Calendar, ArrowLeft, Shield, Smile, Wind, Zap, Briefcase, Landmark, Loader, Languages, Info, Sparkles } from 'lucide-react';
import { Activity } from '../types';

export const StateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { states, loading } = useStates();
  const state = states.find(s => s.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">State Not Found</h2>
          <Link to="/" className="text-primary hover:underline">Go Back Home</Link>
        </div>
      </div>
    );
  }

  const getAQIColor = (val: number) => {
    if (val <= 50) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (val <= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (val <= 200) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'Adventure': return <Zap size={16} />;
      case 'Heritage': return <Landmark size={16} />;
      case 'Nature': return <Wind size={16} />;
      default: return <Smile size={16} />;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero Header */}
      <div className="relative h-96">
        <img src={state.imageUrl} alt={state.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center text-white/90 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <ArrowLeft size={20} className="mr-2" /> Back
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <h1 className="text-5xl font-extrabold mb-2">{state.name}</h1>
          <p className="text-2xl font-light opacity-90 mb-4">{state.tagline}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
              <MapPin size={18} /> Capital: {state.capital}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
              <Calendar size={18} /> Best Time: {state.bestTimeToVisit}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
              <Languages size={18} /> {state.languages.join(", ")}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Description & Metrics */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">About</h2>
              <p className="text-slate-600 text-lg leading-relaxed">{state.description}</p>
              
              {/* Vibe Check Card */}
              <div className="mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={24} className="text-yellow-300" />
                  <h3 className="font-bold text-lg">Internet Vibe Check</h3>
                </div>
                <p className="text-white/90 font-medium italic text-lg">"{state.funnyStereotype}"</p>
              </div>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Shield className="text-primary" /> Safety & Civic Insights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <MetricMeter 
                     label="Women's Safety" 
                     value={state.womenSafetyScore} 
                     description="Based on crime stats, perception, and ease of solo travel."
                     size="lg"
                   />
                   <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
                     <div className="flex items-start gap-2">
                       <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                       <p>{state.safetyDescription}</p>
                     </div>
                   </div>
                </div>
                <div>
                   <MetricMeter 
                     label="Civic Sense" 
                     value={state.civicSenseScore} 
                     description="Cleanliness, traffic discipline, and public behavior."
                     size="lg"
                   />
                   <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
                     <div className="flex items-start gap-2">
                       <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                       <p>{state.civicSenseDescription}</p>
                     </div>
                   </div>
                </div>
              </div>
            </section>

             <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Key Indicators</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AQI Card */}
                <div className={`p-4 rounded-xl border ${getAQIColor(state.aqi.value)} flex flex-col justify-between`}>
                  <div>
                    <div className="text-xs font-bold uppercase opacity-70 mb-1">Air Quality (US AQI)</div>
                    <div className="text-3xl font-extrabold">{state.aqi.value}</div>
                    <div className="font-medium mt-1">{state.aqi.label}</div>
                  </div>
                  
                  {state.europeanAqi && (
                    <div className="mt-4 pt-4 border-t border-black/10 text-xs space-y-1">
                      <div className="font-bold opacity-80 mb-1">European AQI Breakdown</div>
                      <div className="flex justify-between"><span>PM2.5:</span> <span>{state.europeanAqi.pm2_5}</span></div>
                      <div className="flex justify-between"><span>PM10:</span> <span>{state.europeanAqi.pm10}</span></div>
                      <div className="flex justify-between"><span>NO2:</span> <span>{state.europeanAqi.no2}</span></div>
                      <div className="flex justify-between"><span>O3:</span> <span>{state.europeanAqi.o3}</span></div>
                      <div className="flex justify-between"><span>SO2:</span> <span>{state.europeanAqi.so2}</span></div>
                    </div>
                  )}
                  
                  <div className="text-xs opacity-60 mt-2 text-right">Real-time</div>
                </div>

                {/* Hospitality */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 text-blue-800">
                   <div className="text-xs font-bold uppercase opacity-70 mb-1">Hospitality</div>
                   <div className="text-3xl font-extrabold">{state.hospitalityScore}/10</div>
                   <div className="font-medium mt-1">Tourist Friendly</div>
                </div>

                 {/* Infrastructure */}
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50 text-purple-800">
                   <div className="text-xs font-bold uppercase opacity-70 mb-1">Infrastructure</div>
                   <div className="text-3xl font-extrabold">{state.infrastructureScore}/10</div>
                   <div className="font-medium mt-1">Roads & Transport</div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                 <MetricMeter label="Cultural Richness" value={state.culturalRichnessScore} />
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Crime Rate Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      state.crimeStatus === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                      state.crimeStatus === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {state.crimeStatus}
                    </span>
                 </div>
              </div>
            </section>
          </div>

          {/* Right Column: Activities */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Briefcase className="text-secondary" /> Must Do
                </h3>
                <div className="space-y-6">
                  {state.activities.map((act, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800">{act.name}</h4>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 flex items-center gap-1">
                          {getActivityIcon(act.type)} {act.type}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mb-2">
                         <MapPin size={12} className="mr-1" /> {act.city} • {act.suggestedDuration}
                      </div>
                      <p className="text-sm text-slate-600">{act.shortDescription}</p>
                    </div>
                  ))}
                  {state.activities.length === 0 && (
                    <p className="text-sm text-slate-400 italic">No specific activities listed yet.</p>
                  )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};