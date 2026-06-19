import styled from "styled-components";

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem;
  height: 100vh;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  background-color: var(--background);
  width: 100%;
  height: 100%;
  padding: 20px;

  &.buttonBack {
    justify-self: end;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
  padding: 5rem;
  border-radius: 8px;
  border: 2px solid var(--RoxoNubank);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 20px;
`;

export const BoxBotao = styled.div`
  display: flex;
  padding: 1rem;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;
