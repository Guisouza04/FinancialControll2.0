import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2.6rem;
  background: var(--glass-bg);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  max-width: 125rem;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.6rem;
    border-radius: var(--radius-md);
  }
`;

export const Title = styled.h2`
  color: #fff;
  text-align: start;
  font-size: 2.4rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalContent = styled.div`
  padding: 28px;
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
  border-collapse: separate;
  border-spacing: 0;
  background-color: transparent;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: 20px;
  display: block;

  @media (max-width: 768px) {
    min-width: 620px;
  }
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
  transition: background-color 0.2s var(--ease);

  &:hover {
    background-color: rgba(164, 93, 231, 0.1);
  }
`;

export const Th = styled.th`
  background: rgba(79, 1, 134, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  padding: 14px 12px;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
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
  padding: 13px 12px;
  border-bottom: 1px solid var(--glass-border);
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  font-size: 1.3rem;
  color: var(--text-primary);

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
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s var(--ease);

  &:hover {
    background-color: var(--glass-bg-strong);
    transform: translateY(-1px);
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const PaginationButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s var(--ease);

  &:hover:not(:disabled) {
    border-color: var(--RoxoClaro);
    background: var(--glass-bg-strong);
  }
`;
