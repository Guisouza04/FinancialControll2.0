import styled from "styled-components";
import { Link } from "react-router-dom";
import { contentEnter } from "../../styles/animations";

/* Atalho de visualização no fim da linha (medidor ou legenda) para a tela da finança.
   É um <Link> de verdade — abre em nova aba com ctrl/meio-clique de graça. */
export const EyeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease);

  &:hover,
  &:focus-visible {
    color: var(--Complementar);
    background-color: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--RoxoClaro);
    outline-offset: 2px;
  }
`;

/* Área de conteúdo do Dashboard (célula direita do .frame). Rola sozinha; o
   Nav fica fixo à esquerda. */
export const Content = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 3rem 4rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  @media (max-width: 768px) {
    height: auto;
    overflow-y: visible;
    padding: 2rem;
    gap: 2rem;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

export const HeaderTitle = styled.h2`
  font-size: 3rem;
`;

export const HeaderSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.4rem;
  margin-top: 0.4rem;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Larguras fixas para os selects de mês/ano — evita que o filtro "pule" de
// tamanho ao trocar de mês (ex.: "Maio" x "Fevereiro"). O Select interno é
// width:100%, então basta constranger o container.
export const MonthSelect = styled.div`
  flex: 0 0 auto;
  width: 15rem;
`;

export const YearSelect = styled.div`
  flex: 0 0 auto;
  width: 10rem;
`;

// Botões ‹ › para navegar mês a mês na linha do tempo (mesmo padrão do
// filtro de Finanças / ExpenseBox).
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

// Botão de criação rápida no header: cria um lançamento sem sair do
// Dashboard. Gradiente da marca para se destacar como ação primária.
export const QuickAddButton = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 1.8rem;
  height: 4.4rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  background-image: var(--grad-brand);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s var(--ease), filter 0.15s var(--ease);

  .bolt {
    font-size: 1.7rem;
    line-height: 1;
  }

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    /* No mobile só o raio, para economizar espaço. */
    padding: 0 1.4rem;
    .label {
      display: none;
    }
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.9rem;
  margin-bottom: 0.4rem;

  small {
    display: block;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--text-muted);
    margin-top: 0.4rem;
    letter-spacing: 0;
  }
`;

/* Superfície de vidro reutilizável */
export const Card = styled.div`
  background-color: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem;
`;

/* ---------------- KPIs ---------------- */
export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1.6rem;
`;

export const KpiCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;

  /* barra de acento na borda superior */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(p) => p.$accent || "var(--RoxoClaro)"};
    opacity: 0.9;
  }
`;

export const KpiLabel = styled.span`
  color: var(--text-muted);
  font-size: 1.3rem;
  font-weight: 500;
`;

export const KpiValue = styled.span`
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(p) => p.$color || "var(--text-primary)"};
`;

export const KpiHint = styled.span`
  font-size: 1.25rem;
  color: var(--text-muted);
`;

/* ---------------- Medidores (regra 60/20/10/10) ---------------- */
export const MetersCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

export const Meter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

export const MeterHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

/* Lado direito do cabeçalho do medidor: o valor gasto e o atalho. Sem esse
   agrupamento, o `space-between` do MeterHead com três filhos jogaria o valor
   para o centro. */
export const MeterHeadRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const MeterName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.55rem;
  font-weight: 600;
`;

export const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

export const MeterValues = styled.div`
  font-size: 1.45rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;

  strong {
    color: var(--text-primary);
    font-weight: 700;
  }
`;

export const MeterTrack = styled.div`
  position: relative;
  height: 14px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

export const MeterFill = styled.div`
  height: 100%;
  border-radius: var(--radius-pill);
  background: ${(p) => p.$color};
  width: ${(p) => p.$pct}%;
  transition: width 0.5s var(--ease);
`;

export const MeterFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.3rem;
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: ${(p) => p.$color || "var(--text-muted)"};
`;

export const MeterHint = styled.span`
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;

/* Agrupa o "% da fatia" e o atalho do lado direito do rodapé. Sem esse agrupamento,
   o `space-between` do MeterFoot com três filhos jogaria o hint para o centro. */
export const MeterFootRight = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
`;

/* Banda de dois painéis lado a lado: medidores (mais largo) + distribuição.
   Colapsa para uma coluna em telas estreitas. */
export const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 2.4rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* Coluna de um painel do InsightGrid: título + card, empilhados. */
export const InsightCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

/* ---------------- Distribuição (donut + legenda) ---------------- */
/* Empilhado (donut em cima, legenda embaixo) — cabe bem na coluna estreita. */
export const DistribCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const DonutWrap = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  flex-shrink: 0;

  svg {
    transform: rotate(-90deg);
    display: block;
  }

  circle {
    transition: opacity 0.2s var(--ease), stroke-width 0.2s var(--ease);
    cursor: default;
  }

  &:hover circle[data-seg]:not(:hover) {
    opacity: 0.4;
  }
`;

export const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;

  .center-label {
    font-size: 1.2rem;
    color: var(--text-muted);
  }
  .center-value {
    font-size: 2.1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .center-hint {
    font-size: 1.15rem;
    color: var(--text-muted);
    margin-top: 0.2rem;
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`;

/* A última coluna (2.6rem) é a do atalho de visualização; o cabeçalho precisa dela, ainda que
   vazia, senão as colunas do corpo desalinham do título. */
export const LegendHeadRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 5.5rem 5.5rem 2.6rem;
  gap: 1.2rem;
  padding: 0 0.6rem 0.8rem;
  font-size: 1.15rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;

  span:not(:first-child) {
    text-align: right;
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr auto 4.5rem 2.6rem;
    span.col-plano {
      display: none;
    }
  }
`;

export const LegendRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 5.5rem 5.5rem 2.6rem;
  gap: 1.2rem;
  align-items: center;
  padding: 0.9rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 1.45rem;
  transition: background-color 0.2s var(--ease);

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .name {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    font-weight: 600;
  }
  .val {
    text-align: right;
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
  }
  .real {
    text-align: right;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .plano {
    text-align: right;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }

  /* No mobile o "Plano" sai, mas o atalho fica: ele é ação, não informação. */
  @media (max-width: 460px) {
    grid-template-columns: 1fr auto 4.5rem 2.6rem;
    .plano {
      display: none;
    }
  }
`;

/* ---------------- Gastos por tag ---------------- */
export const TagRankCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

/* Linha do ranking: nome (com ponto colorido) · barra proporcional · valor. */
export const TagRow = styled.div`
  display: grid;
  grid-template-columns: minmax(11rem, 15rem) 1fr auto;
  align-items: center;
  gap: 1.6rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr auto;
    row-gap: 0.7rem;

    .bar {
      grid-column: 1 / -1;
      order: 3;
    }
  }
`;

export const TagName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.5rem;
  font-weight: 600;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TagValue = styled.div`
  text-align: right;
  font-size: 1.45rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  strong {
    font-weight: 700;
  }
  small {
    display: block;
    font-size: 1.15rem;
    color: var(--text-muted);
    font-weight: 400;
  }
`;

/* ---------------- Quitação do mês ---------------- */
/* Card único em duas colunas: à esquerda o quanto já saiu do bolso, à direita o
   que ainda vence. Colapsa cedo (1024px) porque a lista de vencimentos precisa
   de largura para nome + valor na mesma linha. */
export const SettleCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.8rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2.4rem;
  }
`;

export const SettlePane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  min-width: 0;
`;

export const SettleHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .value {
    font-size: 2.6rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .of {
    font-size: 1.45rem;
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
  }
  .count {
    font-size: 1.3rem;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
`;

/* Barra empilhada pago · atrasado · a vencer. `gap` de 2px deixa a trilha
   aparecer entre os segmentos — sem essa folga, verde e vermelho encostados
   viram uma faixa só na leitura periférica. */
export const StackTrack = styled.div`
  display: flex;
  gap: 2px;
  height: 14px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

export const StackSeg = styled.div`
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.$color};
  transition: width 0.5s var(--ease);
`;

/* Legenda em linhas: marcador + rótulo + valor. O rótulo é obrigatório — cor de
   status sozinha não identifica nada para quem não distingue verde de vermelho. */
export const SettleLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

export const SettleLegendRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  font-size: 1.4rem;

  .mark {
    width: 1.6rem;
    text-align: center;
    color: ${(p) => p.$color};
    font-weight: 700;
  }
  .label {
    color: var(--text-secondary);
  }
  .amount {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

/* ---- Lista "o que ainda vence" ---- */
export const DueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

/* Mesmas colunas do DueRow. Existe por causa da primeira: um número sozinho
   ("3") não se lê como dia do mês — vira código de alguma coisa. */
export const DueHeadRow = styled.div`
  display: grid;
  grid-template-columns: 3.4rem 1fr auto;
  gap: 1.2rem;
  padding: 0 0.6rem 0.6rem;
  font-size: 1.15rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;

  span:first-child {
    text-align: center;
  }
  span:last-child {
    text-align: right;
  }
`;

/* dia · nome (com ponto do bucket) · valor. O dia é a primeira coluna porque a
   pergunta aqui é "quando", não "quanto". */
export const DueRow = styled.div`
  display: grid;
  grid-template-columns: 3.4rem 1fr auto;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 1.4rem;
  transition: background-color 0.2s var(--ease);

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

export const DueDay = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: ${(p) => p.$color || "var(--text-secondary)"};
  font-variant-numeric: tabular-nums;
`;

export const DueName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;

  span.text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const DueRight = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

export const DueBadge = styled.span`
  font-size: 1.15rem;
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill);
  color: ${(p) => p.$color};
  background: ${(p) => p.$bg};
  white-space: nowrap;
`;

export const DueFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.6rem 0;
  font-size: 1.25rem;
  color: var(--text-muted);

  a {
    color: var(--Complementar);
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const PaneTitle = styled.h4`
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/* ---------------- Estados vazios / loading ---------------- */

/* Envelope do conteúdo pronto — existe só para a entrada animada quando os
   dados chegam (antes era um fragmento). Repete o `flex-direction`/`gap` do
   `Content` porque as seções deixaram de ser filhas diretas dele: sem isso o
   espaçamento entre KPIs, medidores e donut sumiria. */
export const Ready = styled.div`
  ${contentEnter}
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

/* Carregamento: o Loader sozinho, sem card em volta. Come toda a sobra da tela
   (`flex: 1` no Content, que é flex-column) e se centra nela. O `min-height`
   é para o mobile, onde o Content tem altura automática e não há sobra para
   esticar — sem ele, o loader nasceria colado no cabeçalho. */
export const LoaderArea = styled.div`
  flex: 1;
  min-height: 50vh;
  display: grid;
  place-items: center;
`;

export const EmptyState = styled(Card)`
  text-align: center;
  color: var(--text-muted);
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;

  a {
    color: var(--Complementar);
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const InlineNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 1.6rem;
  border-radius: var(--radius-md);
  background: rgba(250, 178, 25, 0.12);
  border: 1px solid rgba(250, 178, 25, 0.35);
  color: #f6d78a;
  font-size: 1.35rem;

  a {
    color: #ffe6a8;
    font-weight: 700;
    text-decoration: underline;
    white-space: nowrap;
  }
`;
