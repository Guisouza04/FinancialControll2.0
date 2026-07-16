import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
`;

// Chip de tag selecionável. $selected preenche com a cor da tag; caso contrário
// fica em contorno (glass). $color é a cor da própria tag.
export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  font-family: inherit;
  line-height: 1;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s var(--ease);
  border: 1.5px solid ${({ $color }) => $color};
  background: ${({ $selected, $color }) =>
    $selected ? $color : "transparent"};
  color: ${({ $selected }) => ($selected ? "#fff" : "var(--text-primary)")};

  &:hover {
    filter: brightness(1.08);
  }

  .dot {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    /* Quando selecionado o fundo já é a cor; o ponto vira branco p/ contraste */
    background: ${({ $selected, $color }) =>
      $selected ? "rgba(255,255,255,0.9)" : $color};
    flex: 0 0 auto;
  }

  .remove {
    margin-left: 0.2rem;
    font-size: 1.3rem;
    opacity: 0.7;
    line-height: 1;
    &:hover {
      opacity: 1;
    }
  }
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  font-family: inherit;
  line-height: 1;
  border-radius: 999px;
  cursor: pointer;
  color: var(--text-primary);
  background: var(--glass-bg);
  border: 1.5px dashed var(--glass-border);
  transition: all 0.15s var(--ease);

  &:hover {
    border-color: var(--RoxoClaro);
    background: var(--glass-bg-strong);
  }
`;

export const Empty = styled.span`
  font-size: 1.3rem;
  color: var(--text-muted);
`;

// Formulário inline de criação de tag (nome + paleta de cores).
export const CreateForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  background: var(--glass-bg);

  input[type="text"] {
    width: 100%;
    padding: 0.9rem 1rem;
    font-size: 1.4rem;
    font-family: inherit;
    color: var(--text-primary);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-sm);

    &:focus {
      outline: none;
      border-color: var(--RoxoNubank);
    }
  }
`;

export const Swatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

export const Swatch = styled.button`
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  cursor: pointer;
  background: ${({ $color }) => $color};
  border: 2.5px solid
    ${({ $active }) => ($active ? "#fff" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 2px rgba(0,0,0,0.35)" : "none"};
  transition: transform 0.12s var(--ease);

  &:hover {
    transform: scale(1.1);
  }
`;

/* Ações do formulário de criação — uma em cada canto (Cancelar à esquerda,
   Criar tag à direita). */
export const CreateActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
`;
