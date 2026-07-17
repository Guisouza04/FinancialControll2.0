import styled from "styled-components";

// Cor da série "Metas" na paleta categórica do Dashboard (`BUDGET` em
// src/pages/Home/index.jsx). Cores de status nunca viram cor de série.
const META_COLOR = "#d55181";
const DONE_COLOR = "#3ddc84";

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .hint {
    font-size: 1.2rem;
    color: var(--text-muted);
  }
`;

export const GroupLabel = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 2.4rem 0 1.2rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const GoalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  gap: 1.6rem;
`;

export const GoalCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  opacity: ${(p) => (p.$concluida ? 0.75 : 1)};
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);

  &:hover {
    border-color: var(--RoxoClaro);
    transform: translateY(-2px);
  }
`;

export const GoalHead = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

export const GoalName = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  word-break: break-word;
`;

export const GoalStats = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 1.35rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;

  strong {
    font-size: 1.7rem;
    color: var(--text-primary);
  }

  .pct {
    margin-left: auto;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }
`;

export const Bar = styled.div`
  height: 8px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
`;

export const BarFill = styled.div`
  height: 100%;
  border-radius: inherit;
  width: ${(p) => p.$pct}%;
  background: ${(p) => (p.$concluida ? DONE_COLOR : META_COLOR)};
  transition: width 0.3s var(--ease), background-color 0.3s var(--ease);
`;

export const GoalMeta = styled.div`
  font-size: 1.25rem;
  color: var(--text-muted);
  line-height: 1.6;
`;

export const GoalFoot = styled.footer`
  margin-top: auto;
  padding-top: 0.6rem;
`;

export const ContributeButton = styled.button`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s var(--ease), opacity 0.2s var(--ease);
  color: ${(p) => (p.$feito ? DONE_COLOR : "#fff")};
  background: ${(p) => (p.$feito ? "rgba(61, 220, 132, 0.12)" : META_COLOR)};
  border: 1px solid ${(p) => (p.$feito ? "rgba(61, 220, 132, 0.4)" : "transparent")};

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.2rem 0.4rem;
  opacity: 0.7;
  transition: opacity 0.2s var(--ease);

  &:hover {
    opacity: 1;
  }
`;

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.4rem;
  padding: 6rem 2rem;
  border: 2px dashed var(--glass-border);
  border-radius: var(--radius-lg);

  strong {
    font-size: 1.8rem;
    color: var(--text-primary);
  }
  span {
    font-size: 1.4rem;
    color: var(--text-muted);
    max-width: 46ch;
    line-height: 1.5;
  }
`;

export const Loading = styled.div`
  padding: 4rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 1.4rem;
`;
