import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: flex-start;
  gap: 5rem;
  padding: 5rem;

  a {
    align-self: center;
  }
`;

export const ContainerCards = styled.div`
  display: flex;
  justify-content: start;
  align-self: flex-start;
  gap: 5rem;
  padding: 5rem;
`;

// Estilos para o Modal de Confirmação
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: var(--background);
  padding: 30px;
  border: 2px solid var(--RoxoNubank);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  text-align: center;
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
  gap: 15px;
  justify-content: center;
`;

export const CancelButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #ddd;
  background-color: #fff;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  width: 12rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #bbb;
    background-color: #f8f8f8;
    transform: scale(0.95);
  }
`;

export const ConfirmButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-image: linear-gradient(
    144deg,
    var(--RoxoClaro),
    var(--RoxoNubank) 50%,
    var(--RoxoEscuro)
  );
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
  width: 12rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d9b3ff;
    transform: scale(0.95);
  }
`;

export const Input = styled.input`
  padding: 12px;
  border: 2px solid var(--RoxoClaro);
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus,
  &:hover {
    border-color: var(--RoxoNubank);
    box-shadow: rgba(155, 75, 247, 0.2) 0 0px 25px 10px;
  }

  &::placeholder {
    color: var(--TextSecundarios);
    opacity: 0.7;
  }
`;
