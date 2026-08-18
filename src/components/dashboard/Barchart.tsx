import React from 'react';

interface BarDatum {
  label: string;
  value: number;
}

interface BarchartProps {
  title: string;
  subtitle?: string;
  data: BarDatum[];
  highlightKey?: string;
}

export const Barchart: React.FC<BarchartProps> = ({ title, subtitle, data, highlightKey }) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      <div className="mb-5">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Value labels (separate row so they never get clipped) */}
      <div className="flex items-end justify-between gap-2 mb-1">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] font-semibold text-slate-500 tabular-nums">
            {d.value}
          </span>
        ))}
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((d) => {
          const height = (d.value / max) * 100;
          const isHighlight = d.label === highlightKey;
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className={`w-full max-w-[38px] rounded-t-lg transition-all duration-700 ease-out ${
                  isHighlight
                    ? 'bg-brand-600 shadow-lg shadow-brand-600/30'
                    : 'bg-ink-900/80 hover:bg-brand-500'
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="flex items-end justify-between gap-2 mt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-slate-400 font-medium">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
