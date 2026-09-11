import { useCallback, useEffect, useState } from "react";
import { ConfirmContext } from "../../context/confirm";
import {
  ModalContent,
  ModalTitle,
  ModalText,
  ModalButtons,
  DangerButton,
} from "./styles";

// Provider global de confirmação. Expõe `confirm(options)` que devolve uma
// Promise<boolean> — resolve `true` ao confirmar, `false` ao cancelar.
//
// options: { title, message?, confirmText?, cancelText?, danger?, choices? }
// `choices` permite decisões com mais de uma ação e resolve com o `value`
// escolhido. O modo tradicional continua resolvendo boolean para não quebrar
// os consumidores existentes.
export function ConfirmProvider({ children }) {
  // state guarda as opções do diálogo + a função `resolve` da Promise atual.
  const [state, setState] = useState(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  const close = useCallback(
    (result) => {
      setState((current) => {
        if (current) current.resolve(result);
        return null;
      });
    },
    []
  );

  // Fecha no ESC (cancela) e confirma no Enter.
  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      else if (e.key === "Enter" && !state.options.choices) close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  const options = state?.options ?? {};
  const {
    title = "Tem certeza?",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    danger = false,
    choices = null,
  } = options;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="modalOverlay" onClick={() => close(false)}>
          <ModalContent
            className="defaultModal"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>{title}</ModalTitle>
            {message && <ModalText>{message}</ModalText>}
            <ModalButtons>
              <button className="button3" onClick={() => close(false)}>
                {cancelText}
              </button>
              {choices?.map((choice) => (
                <button
                  key={choice.value}
                  className={choice.className || "button2"}
                  onClick={() => close(choice.value)}
                >
                  {choice.label}
                </button>
              ))}
              {!choices && (danger ? (
                <DangerButton onClick={() => close(true)}>
                  {confirmText}
                </DangerButton>
              ) : (
                <button className="button2" onClick={() => close(true)}>
                  {confirmText}
                </button>
              ))}
            </ModalButtons>
          </ModalContent>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
