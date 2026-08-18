import React from 'react';

interface PipelineStep {
  label: string;
  value: number;
  colorClass: string;
  barClass: string;
}

interface PipelineOverviewProps {
  title: string;
  subtitle?: string;
  steps: PipelineStep[];
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ title, subtitle, steps }) => {
  const total = steps.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      <div className="mb-5">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const pct = Math.round((step.value / total) * 100);
          return (
            <div key={step.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{step.label}</span>
                <span className="text-xs font-semibold text-slate-500 tabular-nums">
                  {step.value} <span className="text-slate-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${step.barClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
