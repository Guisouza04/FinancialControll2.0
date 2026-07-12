import styled, { keyframes } from "styled-components";

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
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background-color: rgba(36, 1, 64, 0.9);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--glass-border);
  border-left: 4px solid ${({ $type }) => accent[$type] || accent.info};
  box-shadow: var(--shadow-md);
  animation: ${slideIn} 0.32s var(--ease);
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
