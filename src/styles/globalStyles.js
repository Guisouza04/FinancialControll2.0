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

`;

export default GlobalStyles;
