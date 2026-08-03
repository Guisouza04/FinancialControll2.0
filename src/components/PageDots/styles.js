import styled from "styled-components";

/* Tamanho do dot, em px. O deslocamento do brilho TEM que ser exatamente este
   valor: é ele que joga o gradiente inteiro para fora do círculo — é assim que
   o dot "apaga", sem trocar nenhuma cor. */
const DOT = 16;

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 1.2rem;
`;

export const Dots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  /* O "&&" dobra a especificidade de propósito: o globalStyles estiliza "input"
     e também "input:focus" (padding, borda, anel de box-shadow). Com um seletor
     de mesma força, quem venceria dependeria da ordem de injeção do CSS — e o
     foco global desenharia um retângulo por cima da bolinha. */
  && > input {
    appearance: none;
    -webkit-appearance: none;
    flex: 0 0 auto;
    width: ${DOT}px;
    height: ${DOT}px;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    vertical-align: middle;
    /* Poço escuro com luz por cima e aro interno — o estado apagado. */
    background-color: rgba(10, 0, 20, 0.45);
    box-shadow: rgba(255, 255, 255, 0.15) 0 1px 1px,
      inset rgba(0, 0, 0, 0.55) 0 0 0 1px;
    /* O brilho da página atual, na paleta de marca. Fica SEMPRE pintado; o que
       muda entre aceso e apagado é só a posição do gradiente. */
    background-image: radial-gradient(
      #fbf7ff 0%,
      var(--Complementar) 15%,
      rgba(164, 93, 231, 0.55) 28%,
      rgba(130, 10, 209, 0) 70%
    );
    background-repeat: no-repeat;
    transition: background-position 0.15s cubic-bezier(0.8, 0, 1, 1),
      transform 0.25s cubic-bezier(0.8, 0, 1, 1), box-shadow 0.2s var(--ease);
  }

  /* Direção do deslize — no eixo X, não no Y do componente original. O brilho
     sai pelo lado de onde a seleção foi embora: os dots ANTES do aceso caem na
     regra base (+DOT, some pela direita) e os DEPOIS em -DOT (some pela
     esquerda), então a luz parece atravessar a fileira. */
  && > input,
  && > input:active {
    background-position: ${DOT}px 0;
  }

  && > input:checked {
    background-position: 0 0;
    box-shadow: rgba(164, 93, 231, 0.55) 0 0 0 1px,
      0 0 12px rgba(130, 10, 209, 0.55);
    /* Entrada com atraso: o brilho do dot novo acende depois do outro apagar. */
    transition: background-position 0.2s 0.15s cubic-bezier(0, 0, 0.2, 1),
      transform 0.25s cubic-bezier(0, 0, 0.2, 1), box-shadow 0.2s var(--ease);
  }

  && > input:checked ~ input,
  && > input:checked ~ input:active {
    background-position: -${DOT}px 0;
  }

  && > input:hover:not(:checked) {
    box-shadow: rgba(255, 255, 255, 0.15) 0 1px 1px,
      inset rgba(164, 93, 231, 0.9) 0 0 0 1px;
  }

  && > input:active {
    transform: scale(1.4);
    transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
  }

  && > input:focus-visible {
    box-shadow: 0 0 0 3px rgba(130, 10, 209, 0.5);
  }

  /* Extremos da janela deslizante: quando há mais páginas do que bolinhas, os
     dois das pontas viram "tem mais para cá" em vez de páginas de peso igual. */
  && > input[data-edge="true"] {
    transform: scale(0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    && > input {
      transition: none;
    }
  }
`;

/* Só aparece quando a janela trunca — aí as bolinhas deixam de contar o total
   sozinhas e o número é a única forma de saber onde se está. */
export const Counter = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;
