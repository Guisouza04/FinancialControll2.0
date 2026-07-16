import styled from "styled-components";

/* Área de conteúdo do Dashboard (célula direita do .frame). Rola sozinha; o
   Nav fica fixo à esquerda. */
export const Content = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 4rem 5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: 768px) {
    height: auto;
    overflow-y: visible;
    padding: 2rem;
    gap: 2.5rem;
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
  gap: 2.2rem;
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

/* ---------------- Distribuição (donut + legenda) ---------------- */
export const DistribCard = styled(Card)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2rem;
  }
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

export const LegendHeadRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 5.5rem 5.5rem;
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
    grid-template-columns: 1fr auto 4.5rem;
    span.col-plano {
      display: none;
    }
  }
`;

export const LegendRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 5.5rem 5.5rem;
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

  @media (max-width: 460px) {
    grid-template-columns: 1fr auto 4.5rem;
    .plano {
      display: none;
    }
  }
`;

/* ---------------- Estados vazios / loading ---------------- */
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
