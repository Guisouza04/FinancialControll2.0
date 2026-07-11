import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  /* Paleta base (mantida para compatibilidade) */
  --background: #1E0033;
  --RoxoNubank: #820AD1;
  --Complementar: #E5CCFF;
  --RoxoClaro: #A45DE7;
  --RoxoEscuro: #4F0186;
  --TextSecundarios: #B3B3B3;

  /* Tokens do tema "dark glass" */
  --bg-deep: #14001F;            /* fundo mais profundo p/ o gradiente */
  --bg-elevated: #240140;        /* superfícies elevadas opacas */
  --text-primary: #F4EEFB;
  --text-muted: #B9A9CC;

  /* Superfícies de vidro */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-bg-strong: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-border-strong: rgba(164, 93, 231, 0.45);

  /* Gradiente de marca */
  --grad-brand: linear-gradient(135deg, #A45DE7 0%, #820AD1 55%, #4F0186 100%);

  /* Raios */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 12px 32px rgba(0, 0, 0, 0.35);
  --shadow-glow: 0 0 0 1px rgba(164, 93, 231, 0.25), 0 18px 48px rgba(130, 10, 209, 0.35);

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", "Montserrat", sans-serif;
  color: var(--text-primary);
 }

 html {
  font-size: 62.5%;
 }

 body {
  min-height: 100vh;
  width: 100vw;
  color: var(--text-primary);
  background-color: var(--bg-deep);
  /* Fundo com profundidade: brilhos de luz roxa + base escura */
  background-image:
    radial-gradient(1100px 600px at 12% -8%, rgba(130, 10, 209, 0.45), transparent 60%),
    radial-gradient(900px 500px at 110% 10%, rgba(164, 93, 231, 0.28), transparent 55%),
    radial-gradient(800px 800px at 50% 120%, rgba(79, 1, 134, 0.40), transparent 60%),
    linear-gradient(180deg, #1B0030 0%, #14001F 100%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
 }

 h1, h2, h3, h4 {
  font-family: "Montserrat", "Inter", sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.15;
 }

 a {
  text-decoration: none;
 }

 li {
  list-style: none;
 }

 /* Scrollbar discreta e moderna */
 *::-webkit-scrollbar {
  width: 10px;
  height: 10px;
 }
 *::-webkit-scrollbar-thumb {
  background: rgba(164, 93, 231, 0.35);
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  background-clip: padding-box;
 }
 *::-webkit-scrollbar-thumb:hover {
  background: rgba(164, 93, 231, 0.6);
  background-clip: padding-box;
 }
 *::-webkit-scrollbar-track {
  background: transparent;
 }

 .frame {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  height: 100vh;
  max-height: 837px;
 }

 select,
 input {
  padding: 12px 14px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  background-color: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease), background-color 0.25s var(--ease);

  &:hover {
    border-color: var(--RoxoClaro);
  }

  &:focus {
    border-color: var(--RoxoNubank);
    background-color: var(--glass-bg-strong);
    box-shadow: 0 0 0 4px rgba(130, 10, 209, 0.22);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }
 }

 select option {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
 }

 .modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 0, 20, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
 }

 .defaultModal {
    position: fixed;
    background-color: rgba(36, 1, 64, 0.85);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid var(--glass-border-strong);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    text-align: center;
 }

 .button2 {
    padding: 13px 26px;
    border-radius: var(--radius-sm);
    border: none;
    background-image: var(--grad-brand);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.01em;
    width: fit-content;
    box-shadow: 0 10px 24px -8px rgba(130, 10, 209, 0.7);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), filter 0.2s var(--ease);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px -8px rgba(130, 10, 209, 0.85);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
 }

 /* Botão "Adicionar Contas" das telas de despesas */
 #btnAddExpense {
  align-self: flex-end;
 }

   .button3 {
    padding: 13px 26px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--glass-border);
    background-color: var(--glass-bg);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--text-primary);
    font-size: 15px;
    cursor: pointer;
    font-weight: 600;
    width: 12rem;
    transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), background-color 0.2s var(--ease);

    &:hover {
      border-color: var(--RoxoClaro);
      background-color: var(--glass-bg-strong);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0) scale(0.98);
    }
 }

 /* Telas de despesas {Contas, Investimentos, Opcionais e Metas} */
 .containerExpenses {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: flex-start;
  gap: 4rem;
  padding: 5rem;
  max-height: 867px;
 }

 .boxExpenses {
    display: flex;
  flex-direction: column;

  a {
    margin-top: 2rem;
    align-self: center;
  }
 }

 .contentExpenses {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: auto;
  border-bottom: solid 1px var(--glass-border);
  border-top: solid 1px var(--glass-border);
  padding: 2rem;
 }

 /* ===================== Responsivo — Mobile ===================== */
 @media (max-width: 768px) {
  html {
    font-size: 58%;
  }

  body {
    overflow-x: hidden;
  }

  .frame {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    max-height: none;
  }

  /* Reserva espaço para a barra superior fixa (hambúrguer).
     O conteúdo é sempre o último filho do .frame. */
  .frame > *:last-child {
    padding-top: 7rem;
  }

  .containerExpenses {
    padding: 2rem;
    gap: 2.5rem;
    max-height: none;
    width: 100%;
  }

  .contentExpenses {
    padding: 1.2rem;
  }

  .modalOverlay {
    padding: 1.5rem;
  }

  #btnAddExpense {
    align-self: stretch;
  }
 }
`;

export default GlobalStyles;
