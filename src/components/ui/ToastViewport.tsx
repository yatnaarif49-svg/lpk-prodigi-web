import React from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore, ToastType } from '../../store/useToastStore';

const typeStyles: Record<ToastType, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'border-emerald-200 bg-white',
    icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
  },
  error: {
    container: 'border-red-200 bg-white',
    icon: <XCircle size={18} className="text-red-500 shrink-0" />,
  },
  info: {
    container: 'border-sky-200 bg-white',
    icon: <Info size={18} className="text-sky-500 shrink-0" />,
  },
};

export const ToastViewport: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const style = typeStyles[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border shadow-pop px-4 py-3 animate-scale-in ${style.container}`}
          >
            {style.icon}
            <p className="text-sm text-slate-700 flex-1 pt-px">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-300 hover:text-slate-500 transition"
              aria-label="Tutup notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
