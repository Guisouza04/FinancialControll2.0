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
export const ModalContent = styled.div`
  padding: 30px;
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
