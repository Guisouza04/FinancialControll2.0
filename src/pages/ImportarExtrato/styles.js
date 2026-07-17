import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 4rem 5rem 5rem;
  height: 100vh;
  overflow-y: auto;
  min-height: 0;
  /* Estado vazio (só título + intro + upload): centraliza no meio da tela.
     Com a tabela carregada, volta ao topo (conteúdo longo). */
  justify-content: ${(p) => (p.$centered ? "center" : "flex-start")};
  align-items: ${(p) => (p.$centered ? "center" : "stretch")};

  @media (max-width: 768px) {
    padding: 2rem;
    height: auto;
    overflow-y: visible;
    justify-content: flex-start;
  }
`;

/* Painel centralizado do estado vazio (largura controlada). */
export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2.4rem;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
`;

export const Intro = styled.p`
  color: var(--text-muted);
  font-size: 1.45rem;
  max-width: 70ch;
  line-height: 1.5;
`;

export const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3.5rem 2rem;
  border: 2px dashed var(--glass-border);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s var(--ease), background-color 0.2s var(--ease);

  &:hover {
    border-color: var(--RoxoClaro);
    background: var(--glass-bg-strong);
  }

  strong {
    font-size: 1.6rem;
  }
  span {
    color: var(--text-muted);
    font-size: 1.35rem;
  }
  input {
    display: none;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.2rem;
`;

export const FileTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
  }
  button {
    background: none;
    border: none;
    color: var(--RoxoClaro);
    cursor: pointer;
    font-size: 1.3rem;
    text-decoration: underline;
  }
`;

export const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 1.35rem;
  color: var(--text-muted);
`;

export const Required = styled.span`
  color: #ff9d9d;
  margin-left: 0.2rem;
`;

export const TableWrapper = styled.div`
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: auto;
  flex: 1;
  min-height: 12rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.4rem;

  thead th {
    position: sticky;
    top: 0;
    background: var(--bg-elevated);
    text-align: left;
    padding: 1.2rem 1.4rem;
    font-weight: 600;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--glass-border);
    white-space: nowrap;
  }

  tbody td {
    padding: 1rem 1.4rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    vertical-align: middle;
  }

  tbody tr.excluded {
    opacity: 0.4;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .col-check {
    width: 4rem;
    text-align: center;
  }
  .col-valor {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .col-tipo {
    width: 18rem;
  }
  .desc {
    max-width: 40ch;
    line-height: 1.35;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--RoxoNubank);
    cursor: pointer;
  }
`;

export const MovBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.8rem;
  border-radius: var(--radius-pill);
  font-size: 1.15rem;
  font-weight: 600;
  color: ${(p) => (p.$credito ? "#3ddc84" : "#ff9d9d")};
  background: ${(p) =>
    p.$credito ? "rgba(61,220,132,0.12)" : "rgba(255,107,107,0.12)"};
`;

export const DupTag = styled.span`
  display: inline-block;
  margin-left: 0.8rem;
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill);
  font-size: 1.1rem;
  font-weight: 600;
  color: #f6d78a;
  background: rgba(250, 178, 25, 0.14);
  border: 1px solid rgba(250, 178, 25, 0.3);
  white-space: nowrap;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 0.5rem;

  .summary {
    font-size: 1.5rem;
    color: var(--text-secondary);

    strong {
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
  }
`;

export const Empty = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: 1.35rem;
  max-width: 46ch;
`;
