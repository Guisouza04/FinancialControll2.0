import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: flex-start;
  gap: 5rem;
  padding: 5rem;

  @media (max-width: 768px) {
    gap: 2.5rem;
    padding: 2rem;
    width: 100%;
  }
`;

export const ContainerCards = styled.div`
  display: flex;
  justify-content: start;
  align-self: flex-start;
  gap: 5rem;
  padding: 5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    align-self: center;
    gap: 2.5rem;
    padding: 1rem 0;
    width: 100%;
  }
`;
