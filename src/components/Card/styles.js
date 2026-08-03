import styled, { keyframes } from "styled-components";

/* A flutuação do ícone no hover. Via helper do styled-components (e não
   @keyframes solto) para o nome ser único e não colidir com outra animação. */
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
`;

export const StyledWrapper = styled.div`
  .card {
    width: 195px;
    height: 285px;
    /* Vidro do sistema no lugar do cinza sólido do design original. */
    background: var(--glass-bg);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* O ícone é absoluto (precisa deste contexto) e cresce até 65% no hover —
       sem o overflow, o borrão vaza pelas bordas arredondadas. */
    position: relative;
    overflow: hidden;
    color: var(--text-primary);
    transition: 0.2s ease-in-out;
    cursor: pointer;
  }

  .img {
    height: 30%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    transition: 0.2s ease-in-out;
    z-index: 1;
  }

  /* Os ícones chegam com width/height fixos no próprio <svg> (60px, 80px…). O
     CSS vence o atributo de apresentação, e é isso que os deixa crescer no
     hover. O "width: auto" preserva a proporção de qualquer viewBox. */
  .img svg {
    height: 100%;
    width: auto;
    max-width: 100%;
  }

  .textBox {
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 1.6rem;
    gap: 15px;
    transition: 0.2s ease-in-out;
    z-index: 2;
  }

  .textBox > .text {
    font-weight: 700;
  }

  .textBox > .head {
    font-size: 2rem;
    letter-spacing: -0.01em;
  }

  .textBox > .price {
    font-size: 1.7rem;
    color: var(--Complementar);
  }

  .textBox > span {
    font-size: 1.2rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .card:hover > .textBox {
    opacity: 1;
  }

  .card:hover > .img {
    height: 65%;
    filter: blur(7px);
    animation: ${float} 3s infinite;
  }

  .card:hover {
    transform: scale(1.04) rotate(-1deg);
    border-color: var(--glass-border-strong);
    box-shadow: 0 24px 36px rgba(0, 0, 0, 0.3),
      0 24px 46px rgba(130, 10, 209, 0.48);
  }

  /* O texto só existe no hover — quem navega por teclado nunca o veria. O card
     não é focável (o alvo é o <Link>/<div> em volta, que é o ancestral), então
     a regra sobe um nível a partir do link focado. */
  a:focus-visible & .textBox {
    opacity: 1;
  }

  a:focus-visible & .img {
    height: 65%;
    filter: blur(7px);
  }

  /* Sem hover (toque), o efeito nunca dispara e o card ficaria sendo um ícone
     mudo. Aqui ele vira o layout empilhado de sempre: ícone em cima, texto
     embaixo, os dois visíveis — o "position: static" tira o ícone da
     sobreposição. */
  @media (hover: none) {
    .img {
      position: static;
      height: 30%;
    }

    .textBox {
      opacity: 1;
      gap: 6px;
      margin-top: 1.6rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .card:hover > .img {
      transition: none;
      animation: none;
    }

    .card:hover {
      transform: none;
    }
  }
`;
