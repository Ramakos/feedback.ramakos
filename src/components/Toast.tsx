import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const TOAST_ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_THEMES: Record<ToastType, {
  border: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeText: string;
}> = {
  success: {
    border: 'border-emerald-200 shadow-emerald-500/10',
    cardBg: 'bg-white/95 text-slate-800',
    iconBg: 'bg-emerald-50 border border-emerald-200/60',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'SUCCESS',
  },
  error: {
    border: 'border-red-200 shadow-red-500/10',
    cardBg: 'bg-white/95 text-slate-800',
    iconBg: 'bg-red-50 border border-red-200/60',
    iconColor: 'text-red-600',
    badge: 'bg-red-50 text-red-700 border-red-200',
    badgeText: 'ERROR',
  },
  warning: {
    border: 'border-amber-200 shadow-amber-500/10',
    cardBg: 'bg-white/95 text-slate-800',
    iconBg: 'bg-amber-50 border border-amber-200/60',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'NOTICE',
  },
  info: {
    border: 'border-blue-200 shadow-blue-500/10',
    cardBg: 'bg-white/95 text-slate-800',
    iconBg: 'bg-blue-50 border border-blue-200/60',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'TIP',
  },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback((title: string, message?: string) => {
    toast({ type: 'success', title, message });
  }, [toast]);

  const error = useCallback((title: string, message?: string) => {
    toast({ type: 'error', title, message });
  }, [toast]);

  const warning = useCallback((title: string, message?: string) => {
    toast({ type: 'warning', title, message });
  }, [toast]);

  const info = useCallback((title: string, message?: string) => {
    toast({ type: 'info', title, message });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <aside
        aria-live="polite"
        aria-label="Notification Center"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-md pointer-events-none px-2"
      >
        {toasts.map((item) => {
          const theme = TOAST_THEMES[item.type];
          const Icon = TOAST_ICONS[item.type];

          return (
            <div
              key={item.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border ${theme.border} ${theme.cardBg} shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0`}
              style={{
                animation: 'toastPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-8 h-8 rounded-xl ${theme.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${theme.badge}`}>
                    {theme.badgeText}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.title}
                  </h4>
                </div>
                {item.message && (
                  <p className="text-xs text-gray-600 leading-snug">
                    {item.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismiss(item.id)}
                aria-label="Close notification"
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
};
