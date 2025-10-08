import styled from "styled-components";

export const StandardButton = styled.div`
  align-self: ${({ variant }) => (variant === "centered" ? "center" : "")};

  button {
    align-items: center;
    background-image: linear-gradient(
      144deg,
      var(--RoxoClaro),
      var(--RoxoNubank) 50%,
      var(--RoxoEscuro)
    );
    border: 0;
    border-radius: 8px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
    box-sizing: border-box;
    color: #ffffff;
    font-weight: 500;
    display: flex;
    font-size: 18px;
    justify-content: center;
    line-height: 1em;
    max-width: 100%;
    min-width: 140px;
    padding: 3px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:active,
  button:hover {
    outline: 0;
    transform: scale(0.95);
  }

  button span {
    background-color: var(--background);
    padding: 16px 24px;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    transition: 300ms;
  }

  button:hover span {
    background: none;
  }

  button:active {
    transform: scale(0.9);
  }
`;
