import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "../../context/toast";
import {
  ToastViewport,
  ToastItem,
  ToastIcon,
  ToastMessage,
  ToastProgress,
  ToastClose,
  TRANSITION_MS,
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

// Chave de deduplicação: mesmo tipo + mesma mensagem = mesmo toast.
const dedupeKey = (type, message) => `${type}::${message}`;

const clearTimer = (map, id) => {
  if (map.current[id]) {
    clearTimeout(map.current[id]);
    delete map.current[id];
  }
};

// Provider global de notificações. Renderiza a fila de toasts e expõe,
// via context, os métodos `success`/`error`/`warning`/`info`/`show`/`dismiss`.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({}); // id -> timeout de expiração
  const exitTimers = useRef({}); // id -> timeout de remoção (pós-animação)
  // Índices da deduplicação, em ref para `show` poder consultá-los de forma
  // síncrona (o state só chegaria no próximo render).
  const idByKey = useRef({});
  const keyById = useRef({});

  // Tira do DOM de vez, já com a animação de saída concluída.
  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimer(timers, id);
    clearTimer(exitTimers, id);
    const key = keyById.current[id];
    if (key && idByKey.current[key] === id) delete idByKey.current[key];
    delete keyById.current[id];
  }, []);

  // Dispara a saída; a remoção real só acontece quando a animação termina.
  const dismiss = useCallback(
    (id) => {
      if (exitTimers.current[id]) return; // já está saindo
      clearTimer(timers, id);
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      exitTimers.current[id] = setTimeout(() => remove(id), TRANSITION_MS);
    },
    [remove]
  );

  const scheduleDismiss = useCallback(
    (id, duration) => {
      clearTimer(timers, id);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const show = useCallback(
    (type, message, { duration = DEFAULT_DURATION } = {}) => {
      // Ignora mensagens vazias para evitar toasts em branco.
      if (!message) return null;
      const text = String(message);
      const key = dedupeKey(type, text);
      const existingId = idByKey.current[key];

      // Repetiu a mesma mensagem: reaproveita o toast na tela reiniciando o
      // tempo (e a barra) em vez de empilhar uma cópia. Se já estava saindo,
      // cancela a saída e ele volta.
      if (existingId != null) {
        clearTimer(exitTimers, existingId);
        setToasts((prev) =>
          prev.map((t) =>
            t.id === existingId
              ? { ...t, duration, leaving: false, resetKey: t.resetKey + 1 }
              : t
          )
        );
        scheduleDismiss(existingId, duration);
        return existingId;
      }

      const id = ++idCounter;
      idByKey.current[key] = id;
      keyById.current[id] = key;
      setToasts((prev) => [
        ...prev,
        { id, type, message: text, duration, leaving: false, resetKey: 0 },
      ]);
      scheduleDismiss(id, duration);
      return id;
    },
    [scheduleDismiss]
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
            $leaving={t.leaving}
            role="status"
            aria-live="polite"
            onClick={() => dismiss(t.id)}
          >
            <ToastIcon $type={t.type}>{ICONS[t.type] || ICONS.info}</ToastIcon>
            <ToastMessage>{t.message}</ToastMessage>
            <ToastClose aria-hidden="true">×</ToastClose>
            {t.duration > 0 && !t.leaving && (
              // `resetKey` remonta a barra e reinicia a contagem visual.
              <ToastProgress
                key={t.resetKey}
                $type={t.type}
                $duration={t.duration}
              />
            )}
          </ToastItem>
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}
