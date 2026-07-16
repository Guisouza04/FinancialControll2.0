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
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    padding: 1.6rem;
    border-radius: var(--radius-md);
    flex: none;
    min-height: auto;
  }
`;

export const Title = styled.h2`
  color: #fff;
  text-align: start;
  font-size: 2.4rem;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    & > button {
      width: 100%;
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  /* Ano / Mês / Status (wrappers dos <Select>) */
  & > div {
    flex: 0 0 auto;
    width: 18rem;
  }

  /* Botão "Mês Atual" / "Data Atual" — não encolhe nem quebra o texto */
  & > button {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    & > div,
    & > button {
      width: 100%;
    }
  }
`;

export const MonthNavButton = styled.button`
  flex: 0 0 auto;
  padding: 8px 14px;
  font-size: 1.6rem;
  line-height: 1;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s var(--ease);

  &:hover:not(:disabled) {
    border-color: var(--RoxoClaro);
    background: var(--glass-bg-strong);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);

  @media (max-width: 768px) {
    flex: none;
    min-height: auto;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 540px;
  text-align: left;
`;

/* Corpo do formulário em grid de 2 colunas. Campos relacionados ficam lado a
   lado (Valor/Tipo, Mês/Ano...) para reduzir a altura do modal. */
export const FormBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
  padding: 16px 28px 22px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

/* Célula do grid: rótulo em cima, controle embaixo. `$full` ocupa as 2 colunas. */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-muted);
  /* Sobrepõe o text-align: center herdado de .defaultModal (global). */
  text-align: left;
`;

/* Linha de checkbox (ex.: "já está na fatura do cartão"), largura toda. */
export const CheckboxField = styled.label`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);

  & > input {
    width: 17px;
    height: 17px;
    flex: 0 0 auto;
    accent-color: var(--RoxoNubank);
    cursor: pointer;
  }
`;

/* Divisor de seção (ex.: "Período") ocupando a largura toda do grid. */
export const SectionLabel = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--glass-border);
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 28px;
  border-top: 1px solid var(--glass-border);
`;

export const ModalTitle = styled.h2`
  text-align: center;
  margin: 0;
  padding: 26px 28px 4px;
`;

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  background-color: transparent;
  display: block;

  tbody tr {
    transition: background-color 0.2s var(--ease);
  }
  tbody tr:hover {
    background-color: rgba(164, 93, 231, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 620px;
  }
`;

export const Th = styled.th`
  position: sticky;
  top: 0;
  z-index: 1;
  background: rgba(46, 4, 82, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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

/* Barra de resumo com o "Total a pagar" do período (exclui itens de fatura). */
export const TotalBar = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px 14px;
  padding: 4px 2px;

  .total-label {
    font-size: 1.3rem;
    color: var(--text-muted);
  }
  .total-value {
    font-size: 1.9rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  .total-hint {
    width: 100%;
    text-align: right;
    font-size: 1.15rem;
    color: var(--text-muted);
  }
`;

/* Etiqueta discreta na linha indicando que a despesa está numa fatura. */
export const FaturaTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--Complementar);
  background: rgba(130, 10, 209, 0.18);
  border: 1px solid var(--glass-border);
  vertical-align: middle;
  white-space: nowrap;
`;

/* Chips de tag (somente leitura) exibidos na coluna Nome da tabela. */
export const TagList = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: 8px;
  vertical-align: middle;
`;

/* Pílula colorida da tag. A cor vem por prop $color. Fundo translúcido para
   legibilidade sobre a superfície escura; borda/texto na cor cheia. */
export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  background: ${({ $color }) => $color};
  white-space: nowrap;
`;

/* Área de tags dentro do modal (largura toda, abaixo do label da seção). */
export const TagField = styled.div`
  grid-column: 1 / -1;
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
