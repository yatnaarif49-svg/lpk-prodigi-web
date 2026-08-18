import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  format?: (value: number) => string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  iconBgClass?: string;
  index?: number;
}

/**
 * Stat card with an animated count-up value and an optional trend indicator.
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  format,
  delta,
  deltaLabel = 'vs bulan lalu',
  icon,
  iconBgClass = 'bg-brand-50 text-brand-600',
  index = 0,
}) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  // Count-up on first scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const duration = 1100;
            const start = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(value * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else setDisplay(value);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const rendered = format ? format(display) : Math.round(display).toLocaleString('id-ID');
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 animate-fade-in-up hover:shadow-pop hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-2 tabular-nums">{rendered}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconBgClass}`}>{icon}</div>
      </div>

      {delta !== undefined && (
        <div className="flex items-center gap-1.5 mt-3 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-full ${
              isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}
            {delta}%
          </span>
          <span className="text-slate-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  );
};
