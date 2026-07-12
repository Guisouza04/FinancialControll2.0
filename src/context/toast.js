import { createContext, useContext } from "react";

// Context de notificações (toasts). O provider fica em
// `src/components/Toast`. Este arquivo isola context + hook para não
// quebrar o Fast Refresh (arquivos de componente só exportam componentes).
export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  }
  return ctx;
}
