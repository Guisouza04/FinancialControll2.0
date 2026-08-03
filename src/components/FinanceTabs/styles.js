import styled from "styled-components";
import { NavLink } from "react-router-dom";

/* Segmented control das quatro seções de finança. Quebra em duas linhas no
   estreito em vez de rolar na horizontal — scroll esconderia destino, que é
   justamente o que a barra existe para revelar. */
export const TabBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.4rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-pill);
`;

/* NavLink, não Link: ele mesmo aplica `.active` + aria-current na rota atual.
   NÃO passar `caseSensitive` — o default `false` é o que faz o destaque
   funcionar com as rotas de caixa mista do projeto (/Contas vs /metas). */
export const Tab = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.8rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--text-muted);
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease),
    border-color 0.2s var(--ease);

  &:hover {
    color: var(--text-primary);
    background: var(--glass-bg-strong);
  }

  &.active {
    color: var(--text-primary);
    background: var(--glass-bg-strong);
    border-color: var(--glass-border-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--RoxoClaro);
    outline-offset: 2px;
  }
`;

/* Reforço visual da cor do bucket — a mesma série do Dashboard, para reconhecer
   a seção pela cor. É REFORÇO: o rótulo carrega o significado, então nada se
   perde em daltonismo ou monocromático. */
export const TabDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;
