import styled, { css, keyframes } from "styled-components";

// Duração das animações de entrada/saída. Exportada para o provider só remover
// o toast do DOM depois que a saída terminar (mantém os dois em sincronia).
export const TRANSITION_MS = 320;

// Cor de destaque por tipo de toast.
const accent = {
  success: "#4CAF50",
  error: "#f44336",
  warning: "#FFB020",
  info: "var(--RoxoClaro)",
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(120%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Saída = entrada ao contrário (mesma curva e duração).
const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(120%);
  }
`;

// Barra de tempo restante: encolhe da largura cheia até zero durante a vida do
// toast. `scaleX` (em vez de `width`) roda no compositor, sem reflow por frame.
const shrink = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

// Camada fixa que empilha os toasts no canto superior direito.
export const ToastViewport = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: min(380px, calc(100vw - 40px));

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    left: 12px;
    max-width: none;
  }
`;

export const ToastItem = styled.div`
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  overflow: hidden; /* mantém a barra de tempo dentro do canto arredondado */
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px 16px;
  border-radius: var(--radius-md);
  background-color: rgba(36, 1, 64, 0.9);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--glass-border);
  border-left: 4px solid ${({ $type }) => accent[$type] || accent.info};
  box-shadow: var(--shadow-md);
  animation: ${({ $leaving }) =>
    $leaving
      ? css`
          ${slideOut} ${TRANSITION_MS}ms var(--ease) forwards
        `
      : css`
          ${slideIn} ${TRANSITION_MS}ms var(--ease)
        `};
  transition: transform 0.2s var(--ease), filter 0.2s var(--ease);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;

// Ícone circular colorido por tipo.
export const ToastIcon = styled.span`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  background-color: ${({ $type }) => accent[$type] || accent.info};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
`;

export const ToastMessage = styled.span`
  flex: 1;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text-primary);
  word-break: break-word;
`;

// Barra de tempo restante, na base do toast. O provider a remonta (via `key`)
// quando o mesmo toast é reacionado, e isso reinicia a animação do zero.
export const ToastProgress = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  transform-origin: left center;
  background-color: ${({ $type }) => accent[$type] || accent.info};
  opacity: 0.7;
  animation: ${shrink} ${({ $duration }) => $duration}ms linear forwards;
`;

export const ToastClose = styled.span`
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
  color: var(--text-muted);
  opacity: 0.7;
  transition: opacity 0.2s var(--ease);

  ${ToastItem}:hover & {
    opacity: 1;
  }
`;
