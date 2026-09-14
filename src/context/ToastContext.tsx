import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import Toast, { ToastData } from "../components/Toast";

const TOAST_DURATION_MS = 3200;

type ToastContextType = {
  showToast: (message: string, initial: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, initial: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    idRef.current += 1;
    setToast({ message, initial, id: idRef.current });
    timeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast data={toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
