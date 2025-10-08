import { createGlobalStyle } from "styled-components";
// import { keyframes } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  --background: #1E0033;
  --RoxoNubank: #820AD1;
  --Complementar: #E5CCFF;
  --RoxoClaro: #A45DE7;
  --RoxoEscuro: #4F0186;
  --TextSecundarios: #B3B3B3
}

* {
  margin:0;
  padding:0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
  color: #FFF;
 }

 html {
  font-size: 62.5%;
 }

 body {
  min-height: 100vh;
  width: 100vw;
  background-color: #1E0033;
 }

 a {
  text-decoration: none;
 }

 li {
  list-style: none;
 }

 .frame {
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  height: 100vh;
  max-height: 837px;
 }

 select {
  padding: 12px;
  border: 2px solid var(--RoxoClaro);
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: var(--RoxoNubank);
    box-shadow: rgba(155, 75, 247, 0.2) 0 0px 25px 10px;
  }
  &::placeholder {
    color: var(--TextSecundarios);
    opacity: 0.7;
  }
  &:focus {
    background-color: var(--background);
  }
 }

 input {
  padding: 12px;
  border: 2px solid var(--RoxoClaro);
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus,
  &:hover {
    border-color: var(--RoxoNubank);
    box-shadow: rgba(155, 75, 247, 0.2) 0 0px 25px 10px;
  }

  &::placeholder {
    color: var(--TextSecundarios);
    opacity: 0.7;
  }
 }

 .modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
 }

 .defaultModal {
    position: fixed;
    background-color: var(--background);
    border: 2px solid var(--RoxoNubank);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
 }

 .button2 {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background-image: linear-gradient(144deg, var(--RoxoClaro), var(--RoxoNubank) 50%, var(--RoxoEscuro));
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    font-weight: 500;
    width: fit-content;
    transition: all 0.2s ease;

  &:hover {
    background-color: #d9b3ff;
    transform: scale(0.95);
  }
 }

 /* Botão "Adicionar Contas" das telas de despesas */
 #btnAddExpense {
  align-self: flex-end;
 }

   .button3 {
    padding: 12px 24px;
    border-radius: 8px;
    border: 2px solid #ddd;
    background-color: #fff;
    color: #666;
    font-size: 16px;
    cursor: pointer;
    font-weight: 500;
    width: 12rem;
    transition: all 0.2s ease;

    &:hover {
      border-color: #bbb;
      background-color: #f8f8f8;
      transform: scale(0.95);
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
  border-bottom: solid 1px var(--background);
  border-top: solid 1px var(--background);
  padding: 2rem;
 }
`;

export default GlobalStyles;
