import React from 'react';

interface MetricMeterProps {
  label: string;
  value: number;
  max?: number;
  showValue?: boolean;
  colorScale?: boolean; // If true, changes color based on value (Green is high)
  inverseColorScale?: boolean; // If true, Green is low (e.g. for negative metrics, though we use positive scores mostly)
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MetricMeter: React.FC<MetricMeterProps> = ({ 
  label, 
  value, 
  max = 10, 
  showValue = true,
  colorScale = true,
  inverseColorScale = false,
  description,
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getColor = (pct: number) => {
    if (!colorScale) return 'bg-primary';
    
    // Standard: High is Good (Green)
    if (!inverseColorScale) {
      if (pct >= 80) return 'bg-emerald-500';
      if (pct >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    } 
    // Inverse: Low is Good (Green)
    else {
      if (pct <= 30) return 'bg-emerald-500';
      if (pct <= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const hClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';
  const textClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm';

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between items-end mb-1">
        <span className={`font-medium text-slate-700 ${textClass}`}>{label}</span>
        {showValue && <span className={`font-bold text-slate-900 ${textClass}`}>{value}/{max}</span>}
      </div>
      <div className={`w-full bg-slate-200 rounded-full ${hClass} overflow-hidden`}>
        <div 
          className={`${getColor(percentage)} ${hClass} transition-all duration-500 ease-out rounded-full`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
};
