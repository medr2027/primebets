import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastViewport() {
  const { toasts } = useApp();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-card pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 p-4 text-sm shadow-glow"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
          )}
          <div>
            <p className="font-semibold text-slate-100">{toast.title}</p>
            <p className="text-slate-300">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
