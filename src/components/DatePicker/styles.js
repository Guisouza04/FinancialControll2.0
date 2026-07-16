import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid
    ${({ $open }) => ($open ? "var(--RoxoNubank)" : "var(--glass-border)")};
  border-radius: var(--radius-sm);
  background-color: ${({ $open }) =>
    $open ? "var(--glass-bg-strong)" : "var(--glass-bg)"};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  box-shadow: ${({ $open }) =>
    $open ? "0 0 0 4px rgba(130, 10, 209, 0.22)" : "none"};
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease),
    background-color 0.2s var(--ease);

  &:hover {
    border-color: var(--RoxoClaro);
  }

  & > span:first-child {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }

  .cal-icon {
    flex-shrink: 0;
    font-size: 15px;
    line-height: 1;
    opacity: 0.85;
  }
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  width: 28rem;
  max-width: min(28rem, calc(100vw - 3rem));
  padding: 1.2rem;
  background: rgba(28, 0, 44, 0.97);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  animation: dpFade 0.14s var(--ease);

  @keyframes dpFade {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Abre pra cima quando não há espaço embaixo */
  &.up {
    top: auto;
    bottom: calc(100% + 6px);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

/* Rótulo do cabeçalho — clicável, abre/fecha a seleção de ano. */
export const MonthLabel = styled.button`
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  font-family: inherit;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: -0.01em;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: var(--radius-sm);
  transition: background 0.15s var(--ease);

  &:hover {
    background: rgba(164, 93, 231, 0.2);
  }
`;

export const NavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-primary);
  font-size: 1.6rem;
  cursor: pointer;
  transition: background 0.15s var(--ease), border-color 0.15s var(--ease);

  &:hover {
    background: rgba(164, 93, 231, 0.22);
    border-color: var(--RoxoClaro);
  }
`;

export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
  margin-bottom: 0.4rem;

  span {
    text-align: center;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-muted);
    padding: 0.4rem 0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
`;

export const DayCell = styled.button`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1.35rem;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--text-primary)")};
  background: ${({ $selected }) =>
    $selected ? "var(--grad-brand)" : "transparent"};
  font-weight: ${({ $selected, $today }) =>
    $selected || $today ? 700 : 500};
  box-shadow: ${({ $today, $selected }) =>
    $today && !$selected ? "inset 0 0 0 1px var(--RoxoClaro)" : "none"};
  transition: background 0.15s var(--ease), color 0.15s var(--ease);

  &:hover {
    background: ${({ $selected }) =>
      $selected ? "var(--grad-brand)" : "rgba(164, 93, 231, 0.25)"};
    color: #fff;
  }

  /* Célula vazia (fora do mês) — sem interação */
  &.empty {
    visibility: hidden;
    pointer-events: none;
  }
`;

export const YearGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.4rem 0;
`;

export const YearCell = styled.button`
  padding: 1.3rem 0;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--text-primary)")};
  background: ${({ $selected }) =>
    $selected ? "var(--grad-brand)" : "transparent"};
  font-weight: ${({ $selected, $current }) =>
    $selected || $current ? 700 : 500};
  box-shadow: ${({ $current, $selected }) =>
    $current && !$selected ? "inset 0 0 0 1px var(--RoxoClaro)" : "none"};
  transition: background 0.15s var(--ease), color 0.15s var(--ease);

  &:hover {
    background: ${({ $selected }) =>
      $selected ? "var(--grad-brand)" : "rgba(164, 93, 231, 0.25)"};
    color: #fff;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);

  button {
    background: none;
    border: none;
    color: var(--RoxoClaro);
    font-size: 1.3rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
