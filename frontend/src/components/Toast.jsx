import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CircleAlert, X } from 'lucide-react';

const ToastContext = createContext(() => {});
const TOAST_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message) => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-2), { id, message }]);
      setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CircleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <p className="flex-1 text-zinc-700 dark:text-zinc-300">{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(toast.id)}
              className="focus-ring rounded text-zinc-400 transition-colors duration-150 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
