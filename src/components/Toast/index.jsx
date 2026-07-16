import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "../../context/toast";
import {
  ToastViewport,
  ToastItem,
  ToastIcon,
  ToastMessage,
  ToastClose,
} from "./styles";

// Glifo exibido no ícone de cada tipo.
const ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

const DEFAULT_DURATION = 4000;
let idCounter = 0;

// Provider global de notificações. Renderiza a fila de toasts e expõe,
// via context, os métodos `success`/`error`/`warning`/`info`/`show`/`dismiss`.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback(
    (type, message, { duration = DEFAULT_DURATION } = {}) => {
      // Ignora mensagens vazias para evitar toasts em branco.
      if (!message) return null;
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message: String(message) }]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, opts) => show("success", message, opts),
      error: (message, opts) => show("error", message, opts),
      warning: (message, opts) => show("warning", message, opts),
      info: (message, opts) => show("info", message, opts),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport>
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            $type={t.type}
            role="status"
            aria-live="polite"
            onClick={() => dismiss(t.id)}
          >
            <ToastIcon $type={t.type}>{ICONS[t.type] || ICONS.info}</ToastIcon>
            <ToastMessage>{t.message}</ToastMessage>
            <ToastClose aria-hidden="true">×</ToastClose>
          </ToastItem>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}
