import styled from "styled-components";

// Envolve um campo e reserva espaço à direita para o asterisco.
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  /* Espaço à direita para o asterisco não encostar no texto digitado. */
  & > input {
    padding-right: 30px;
  }

  /* Remove as setinhas do input number para o asterisco não colidir. */
  & > input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
  & > input[type="number"]::-webkit-outer-spin-button,
  & > input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// Asterisco discreto, verticalmente centralizado no campo.
export const Mark = styled.span`
  position: absolute;
  top: 50%;
  right: 13px;
  transform: translateY(-50%);
  color: var(--RoxoClaro);
  font-size: 15px;
  font-weight: 600;
  line-height: 0;
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
`;
