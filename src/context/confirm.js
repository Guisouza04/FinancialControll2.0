import { createContext, useContext } from "react";

// Context de confirmação. Expõe uma função `confirm(options)` que
// retorna uma Promise<boolean> — substituto elegante para window.confirm.
// O provider fica em `src/components/ConfirmDialog`.
export const ConfirmContext = createContext(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm precisa estar dentro de <ConfirmProvider>.");
  }
  return ctx;
}
