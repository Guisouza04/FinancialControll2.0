import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: flex-start;
  gap: 5rem;
  padding: 5rem;
`;

export const ContainerAccouts = styled.div``;

export const ContentAccouts = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100rem;
  min-height: auto;
  border-bottom: solid 1px var(--background);
  border-top: solid 1px var(--background);
  padding: 2rem;
`;

export const BoxAccouts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding-bottom: 2rem;
  height: 35rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--roxoMedioClaro) var(--background);
  scrollbar-gutter: stable;

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--roxoNubank);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--roxoClaro);
  }
`;

export const AddCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  background-color: var(--roxoFundo);
  width: 5rem;
  border-radius: 100%;
  cursor: pointer;

  &:hover {
    background-color: var(--roxoClaro);
  }
`;
