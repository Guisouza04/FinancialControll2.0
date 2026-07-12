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
`;

export const Chevron = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-muted);
  transition: transform 0.2s var(--ease);
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
`;

export const Panel = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 200;
  margin: 0;
  padding: 6px;
  list-style: none;
  max-height: 244px;
  overflow-y: auto;
  background: rgba(28, 0, 44, 0.97);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  animation: selectFade 0.14s var(--ease);

  @keyframes selectFade {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const OptionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--text-muted)")};
  background: ${({ $selected, $active }) =>
    $selected || $active ? "var(--glass-bg-strong)" : "transparent"};
  cursor: pointer;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);

  &:hover {
    background: rgba(164, 93, 231, 0.22);
    color: #fff;
  }

  &::after {
    content: ${({ $selected }) => ($selected ? '"✓"' : '""')};
    color: var(--RoxoClaro);
    font-size: 13px;
    font-weight: 700;
  }
`;
