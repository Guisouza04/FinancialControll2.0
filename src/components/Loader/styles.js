import styled from "styled-components";
import { softEnter } from "../../styles/animations";

export const Wrapper = styled.div`
  ${softEnter}
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;

  /* Cor de marca no lugar do cinza do original. O anel que se expande usa um
     roxo translúcido: sólido, ele viraria um disco opaco de 20px piscando. */
  --loader-color: var(--Complementar);
  --loader-ring: rgba(164, 93, 231, 0.5);
  --loader-anim: 2s ease-in-out infinite;
`;

export const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    margin: 0 10px;
    border: solid 2px var(--loader-color);
    border-radius: 50%;
    background-color: transparent;
    animation: circle-keys var(--loader-anim);
  }

  /* Sem "top/left": um filho absoluto sem offsets herda a posição estática, que
     num container flex centralizado já é o centro. O translate(-50%,-50%) do
     original era inócuo — as animações definem "transform" e o sobrescreviam. */
  .circle .dot {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--loader-color);
    animation: dot-keys var(--loader-anim);
  }

  .circle .outline {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    animation: outline-keys var(--loader-anim);
  }

  /* Cada bola entra 0.3s depois da anterior — é o que faz a onda andar para a
     direita em vez das quatro pulsarem juntas. O anel sai 0.9s depois da sua
     própria bola, então ele acompanha o encolhimento, não o crescimento. */
  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) .dot {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) .dot {
    animation-delay: 0.9s;
  }

  .circle:nth-child(1) .outline {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .outline {
    animation-delay: 1.2s;
  }

  .circle:nth-child(3) .outline {
    animation-delay: 1.5s;
  }

  .circle:nth-child(4) .outline {
    animation-delay: 1.8s;
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 20px var(--loader-ring);
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }

  /* Movimento infinito é justamente o que essa preferência pede para cortar.
     Fica um trio de bolas cheias e paradas; quem informa o estado é o texto. */
  @media (prefers-reduced-motion: reduce) {
    .circle,
    .circle .dot {
      animation: none;
    }

    .circle .outline {
      display: none;
    }

    .circle:nth-child(2) {
      opacity: 0.75;
    }

    .circle:nth-child(3) {
      opacity: 0.5;
    }

    .circle:nth-child(4) {
      opacity: 0.3;
    }
  }
`;

export const Label = styled.span`
  font-size: 1.5rem;
  color: var(--text-muted);
`;
