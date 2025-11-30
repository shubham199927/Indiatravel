import React from 'react';
import { Link } from 'react-router-dom';
import { useStates } from '../contexts/StateContext';
import { MetricMeter } from '../components/MetricMeter';
import { ArrowLeft, X, Loader } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

interface ComparisonProps {
  ids: string[];
  setComparisonList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Comparison: React.FC<ComparisonProps> = ({ ids, setComparisonList }) => {
  const { states, loading } = useStates();
  const selectedStates = states.filter(s => ids.includes(s.id));

  const removeState = (id: string) => {
    setComparisonList(prev => prev.filter(item => item !== id));
  };

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (selectedStates.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">No states selected</h2>
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  // Prepare data for Radar Chart
  const radarData = [
    { subject: 'Safety', fullMark: 10 },
    { subject: 'Civic Sense', fullMark: 10 },
    { subject: 'Hospitality', fullMark: 10 },
    { subject: 'Infrastructure', fullMark: 10 },
    { subject: 'Culture', fullMark: 10 },
  ];

  const chartData = radarData.map(dim => {
    const obj: any = { subject: dim.subject };
    selectedStates.forEach(s => {
      let val = 0;
      if (dim.subject === 'Safety') val = s.womenSafetyScore;
      if (dim.subject === 'Civic Sense') val = s.civicSenseScore;
      if (dim.subject === 'Hospitality') val = s.hospitalityScore;
      if (dim.subject === 'Infrastructure') val = s.infrastructureScore;
      if (dim.subject === 'Culture') val = s.culturalRichnessScore;
      obj[s.name] = val;
    });
    return obj;
  });

  const colors = ['#0f766e', '#f59e0b', '#6366f1']; // Primary, Secondary, Indigo

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-slate-600 hover:text-primary transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Search
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">State Comparison</h1>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-4 text-left w-48 text-slate-500 font-medium">Metric</th>
                  {selectedStates.map((state, idx) => (
                    <th key={state.id} className="p-4 text-left min-w-[250px] relative">
                       <button 
                         onClick={() => removeState(state.id)}
                         className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                       >
                         <X size={16} />
                       </button>
                       <div className="flex items-center gap-3">
                         <img src={state.imageUrl} alt={state.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                         <div>
                           <div className="text-xl font-bold text-slate-800">{state.name}</div>
                           <div className="text-xs text-slate-500">{state.capital}</div>
                         </div>
                       </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Languages */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Languages</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                      <p className="text-sm text-slate-600">{state.languages.join(", ")}</p>
                    </td>
                  ))}
                </tr>

                {/* AQI */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Air Quality (AQI)</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{state.aqi.value}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          state.aqi.label === 'Good' ? 'bg-emerald-100 text-emerald-800' :
                          state.aqi.label === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {state.aqi.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Lower is better. (Live data)</p>
                    </td>
                  ))}
                </tr>

                {/* Women's Safety */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Women's Safety</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                       <MetricMeter label="" value={state.womenSafetyScore} showValue={true} size="sm" />
                       <p className="text-xs text-slate-500 mt-1 line-clamp-2">{state.safetyDescription}</p>
                    </td>
                  ))}
                </tr>

                {/* Civic Sense */}
                 <tr>
                  <td className="p-4 font-semibold text-slate-700">Civic Sense</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                       <MetricMeter label="" value={state.civicSenseScore} showValue={true} size="sm" />
                       <p className="text-xs text-slate-500 mt-1 line-clamp-2">{state.civicSenseDescription}</p>
                    </td>
                  ))}
                </tr>
                
                {/* Infrastructure */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Infrastructure</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                       <div className="text-lg font-bold">{state.infrastructureScore}/10</div>
                    </td>
                  ))}
                </tr>

                {/* Crime Status */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Crime Rate</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4">
                       <span className={`font-medium ${
                         state.crimeStatus === 'Low' ? 'text-emerald-600' : 
                         state.crimeStatus === 'Medium' ? 'text-amber-600' : 'text-red-600'
                       }`}>
                         {state.crimeStatus}
                       </span>
                    </td>
                  ))}
                </tr>

                 {/* Best Time */}
                <tr>
                  <td className="p-4 font-semibold text-slate-700">Best Time to Visit</td>
                  {selectedStates.map(state => (
                    <td key={state.id} className="p-4 text-sm text-slate-600">
                       {state.bestTimeToVisit}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-xl font-bold mb-6 text-center">Metric Comparison Radar</h3>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                   <PolarGrid />
                   <PolarAngleAxis dataKey="subject" />
                   <PolarRadiusAxis angle={30} domain={[0, 10]} />
                   {selectedStates.map((state, idx) => (
                     <Radar
                       key={state.id}
                       name={state.name}
                       dataKey={state.name}
                       stroke={colors[idx % colors.length]}
                       fill={colors[idx % colors.length]}
                       fillOpacity={0.4}
                     />
                   ))}
                   <Legend />
                   <Tooltip />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-4">Why Compare?</h3>
              <p className="text-slate-600 mb-4">
                Different states excel in different areas. While <span className="font-semibold text-slate-900">Kerala</span> might offer superior safety and civic sense, <span className="font-semibold text-slate-900">Rajasthan</span> provides unmatched cultural heritage.
              </p>
              <p className="text-slate-600 mb-4">
                Check the <strong>Women's Safety</strong> and <strong>Civic Sense</strong> meters closely if you are a solo traveler.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                <strong>Tip:</strong> Don't just rely on scores. Read the specific activities to see what matches your travel style!
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};