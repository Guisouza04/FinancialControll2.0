import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px;
  background-color: transparent;
  border: solid 1px var(--RoxoNubank);
  border-radius: 8px;
  max-width: 125rem;
  width: 125rem;
  margin: 0 auto;
`;

export const Title = styled.h2`
  color: #fff;
  text-align: start;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalContent = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 400px;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

export const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  height: 290px;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: transparent;
  border: solid 1px var(--RoxoNubank);
  margin-top: 20px;
  display: block;
`;

export const Thead = styled.thead`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

export const Tbody = styled.tbody`
  display: block;
  max-height: 260px;
  overflow-y: auto;
  width: 100%;
`;

export const Tr = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

export const Th = styled.th`
  background-color: #4f0186;
  color: white;
  padding: 10px;
  text-align: left;
  box-sizing: border-box;
  &.name-column {
    width: 56%;
  }
  &.value-column {
    width: 25%;
  }
  &.months-column {
    width: 15%;
  }
  &.actions-column {
    width: 20%;
  }
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e5ccff;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  font-size: 1.2rem;

  &.name-column {
    width: 48%;
  }
  &.value-column {
    width: 25%;
  }
  &.months-column {
    width: 15%;
  }
  &.actions-column {
    width: 20%;
  }
`;

export const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  margin-right: 5px;
  padding: 5px;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const PaginationButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
