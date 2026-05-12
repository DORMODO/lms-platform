import { createContext, useContext, useCallback } from 'react';
import { toast } from 'sonner';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const success = useCallback((message) => {
    toast.success(message);
  }, []);

  const error = useCallback((message) => {
    toast.error(message);
  }, []);

  const info = useCallback((message) => {
    toast(message);
  }, []);

  const warning = useCallback((message) => {
    toast.warning(message);
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
