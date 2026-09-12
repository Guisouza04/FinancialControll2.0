import styled, { keyframes } from "styled-components";

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Mesmas medidas dos modais existentes (Dados/Settings), com uma
// animação sutil de entrada. Usa a classe global .defaultModal.
export const ModalContent = styled.div`
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${popIn} 0.24s var(--ease);
`;

export const ModalTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

export const ModalText = styled.p`
  margin: 0 0 25px 0;
  font-size: 16px;
  color: var(--TextSecundarios);
  line-height: 1.5;
`;

export const ModalButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${({ $hasChoices }) => ($hasChoices ? "column" : "row")};
  align-items: center;
  gap: 15px;
  justify-content: center;

  .choice-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
  }

  .choice-actions > button {
    width: 100%;
    white-space: nowrap;
  }
`;

// Botão de confirmação vermelho para ações destrutivas (ex.: excluir).
export const DangerButton = styled.button`
  padding: 13px 26px;
  border-radius: var(--radius-sm);
  border: none;
  background-image: linear-gradient(135deg, #f4614e 0%, #e53935 55%, #b71c1c 100%);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 10px 24px -8px rgba(229, 57, 53, 0.7);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease),
    filter 0.2s var(--ease);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px -8px rgba(229, 57, 53, 0.85);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;
