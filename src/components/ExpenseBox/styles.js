import styled from "styled-components";
import { contentEnter } from "../../styles/animations";

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

  /* Entrada do conteúdo quando os dados chegam (inclusive ao trocar de aba).
     Condicional: é a troca de classe que dispara a animação. */
  ${({ $ready }) => $ready && contentEnter}

  @media (max-width: 768px) {
    padding: 1.6rem;
    border-radius: var(--radius-md);
    flex: none;
    min-height: auto;
  }
`;

/* Carregamento: o Loader sozinho, centrado no card — sem título nem texto, como
   no Dashboard. O `min-height` segura a caixa no mobile, onde o Container perde
   o `flex: 1` e não haveria sobra para centrar coisa nenhuma. */
export const LoaderArea = styled.div`
  flex: 1;
  min-height: 24rem;
  display: grid;
  place-items: center;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  /* O "Adicionar" não encolhe nem desce — quem quebra é o FilterContainer,
     dentro de si. Sem isto, abrir a busca empurrava o botão para uma segunda
     linha do Toolbar, e lá ele reaparecia colado à esquerda. */
  & > button {
    flex: 0 0 auto;
  }

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
  /* Come a sobra da linha do Toolbar e quebra internamente, de modo que o botão
     "Adicionar" ao lado nunca é empurrado para baixo. */
  flex: 1 1 auto;
  min-width: 0;

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

/* Lupa + campo, na MESMA linha dos filtros. Cresce até o fim da barra de filtros
   (`flex: 1 1 auto`) mesmo com a busca fechada, de modo que abrir só preenche um
   vão que já existia — nada ao redor se mexe durante a animação.

   Fechado, `min-width` é só a lupa; aberto, pede 22rem para o campo não nascer
   espremido: se a sobra da linha for menor que isso, a área inteira (lupa junto)
   quebra para a linha de baixo e lá ocupa o vão todo. */
export const SearchArea = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  min-width: ${(p) => (p.$open ? "22rem" : "4.2rem")};
  transition: min-width 0.28s var(--ease);

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
`;

/* 🔍 ao lado do "Mês Atual": revela/esconde o campo de busca. A busca é uso
   eventual e a barra de filtros já é longa — deixá-la sempre visível custava uma
   linha inteira do Toolbar por um campo quase sempre vazio.

   `$active` (aberto) usa a cor de marca, não só um tom de vidro: precisa ficar
   claro que existe uma lente sobre a tabela. */
export const SearchToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 4.2rem;
  height: 4.2rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: ${(p) => (p.$active ? "var(--text-primary)" : "var(--text-muted)")};
  background: ${(p) => (p.$active ? "var(--glass-bg-strong)" : "var(--glass-bg)")};
  border: 1px solid
    ${(p) => (p.$active ? "var(--RoxoNubank)" : "var(--glass-border)")};
  transition: all 0.2s var(--ease);

  &:hover {
    color: var(--text-primary);
    border-color: var(--RoxoClaro);
    background: var(--glass-bg-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--RoxoClaro);
    outline-offset: 2px;
  }
`;

/* Campo de busca da tabela. Fica SEMPRE no DOM (a visibilidade é o `$open`) —
   desmontar cortaria a animação de saída pela metade.

   Fechado ele tem largura, padding e borda zerados: some encolhendo para dentro
   da lupa, que é de onde ele nasce. `min-width: 0` é obrigatório — sem isso o
   tamanho intrínseco do <input> impede o encolhimento até 0. */
export const SearchInput = styled.input`
  /* basis 100% + shrink: aberto, come toda a sobra da SearchArea (descontada a
     lupa) sem precisar saber a largura dela. */
  flex: 0 1 100%;
  min-width: 0;
  width: ${(p) => (p.$open ? "100%" : "0")};
  /* Mesma altura da lupa: o campo cresce só na horizontal, como se saísse dela. */
  height: 4.2rem;
  padding: ${(p) => (p.$open ? "0 14px" : "0")};
  border: ${(p) => (p.$open ? "1px" : "0")} solid var(--glass-border);
  opacity: ${(p) => (p.$open ? "1" : "0")};
  pointer-events: ${(p) => (p.$open ? "auto" : "none")};
  border-radius: var(--radius-sm);
  background-color: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  overflow: hidden;
  transition: width 0.28s var(--ease), padding 0.28s var(--ease),
    opacity 0.22s var(--ease), border-color 0.2s var(--ease),
    box-shadow 0.2s var(--ease), background-color 0.2s var(--ease);

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }

  &:hover {
    border-color: var(--RoxoClaro);
  }

  &:focus {
    outline: none;
    border-color: var(--RoxoNubank);
    background-color: var(--glass-bg-strong);
    box-shadow: 0 0 0 4px rgba(130, 10, 209, 0.22);
  }

  /* Quem prefere menos movimento vê o campo simplesmente aparecer. */
  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.01s;
  }
`;

/* Linha ocupando a tabela inteira quando a busca não encontra nada — sem ela o
   <tbody> vazio faz a tabela parecer quebrada. */
export const EmptyRow = styled.td`
  padding: 24px 12px;
  text-align: center;
  font-size: 1.35rem;
  color: var(--text-muted);
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

export const AdjustedValueTag = styled.span`
  display: block;
  width: fit-content;
  margin-top: 3px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(164, 93, 231, 0.14);
  color: #cda5f2;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
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
  /* Folga maior que a dos filtros: as bolinhas do PageDots são alvos pequenos e
     precisam de ar em volta para não parecerem parte dos botões. */
  gap: 1.8rem;
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
