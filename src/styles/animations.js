import { css, keyframes } from "styled-components";

const contentIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

/* Entrada do conteúdo de uma tela — usada quando os dados terminam de carregar,
   inclusive ao trocar de aba nas finanças. Curta de propósito: é para tirar o
   corte seco da troca, não para o usuário esperar por ela.

   Aplique de forma CONDICIONAL (`${(p) => p.$ready && contentEnter}`): é a
   troca de classe que dispara a animação. Fixa no componente, ela rodaria uma
   vez só, no mount, e a chegada dos dados continuaria seca. */
export const contentEnter = css`
  animation: ${contentIn} 0.24s var(--ease) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* Entrada do próprio loader. Sem deslocamento (ele já se mexe sozinho) e mais
   lenta que a do conteúdo: aparecer de estalo é metade da sensação de pisca,
   mesmo quando ele fica na tela o tempo devido. */
export const softEnter = css`
  animation: ${fadeIn} 0.35s var(--ease) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
