import styled from "styled-components";

export const StyledWrapper = styled.div`
  .card {
    width: 220px;
    height: 321px;
    background: var(--glass-bg);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: var(--shadow-sm);
    transition: all 0.35s var(--ease);
    text-decoration: none;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.01) translateZ(0);
    border-color: var(--glass-border-strong);
    box-shadow: 0 24px 36px rgba(0, 0, 0, 0.3),
      0 24px 46px rgba(130, 10, 209, 0.48);
  }

  .card:hover .overlay {
    transform: scale(4) translateZ(0);
  }

  .card:hover .circle {
    border-color: var(--Complementar);
    background: var(--RoxoNubank);
  }

  .card:hover .circle:after {
    background: var(--Complementar);
  }

  .card:hover svg path,
  .card:hover svg rect,
  .card:hover svg polygon,
  .card:hover svg ellipse,
  .card:hover svg {
    stroke: var(--background);
    fill: ${({ variant }) => (variant === "preencherFill" ? "#1E0033" : "")};
  }

  .card:hover p {
    color: var(--TextSecundarios);
  }

  .card:hover .circle img {
    filter: brightness(0) invert(1); /* Simulates color change for img */
  }

  .card p {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--text-primary);
    margin-top: 30px;
    z-index: 1000;
    transition: color 0.3s ease-out;
  }

  .circle {
    width: 131px;
    height: 131px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--RoxoNubank);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-out;
  }

  .circle:after {
    content: "";
    width: 116px;
    height: 116px;
    display: block;
    position: absolute;
    background: var(--RoxoNubank);
    border-radius: 50%;
    top: 8px;
    left: 8px;
    transition: background 0.3s ease-out;
  }

  .circle svg {
    z-index: 10000;
    transform: translateZ(0);
  }

  .circle img {
    width: 60%;
    height: 100%;
    object-fit: contain;
    z-index: 10000;
    transition: filter 0.3s ease-out;
  }

  .overlay {
    width: 118px;
    position: absolute;
    height: 118px;
    border-radius: 50%;
    background: var(--RoxoNubank);
    top: 70px;
    left: 50px;
    z-index: 0;
    transition: transform 0.3s ease-out;
  }
`;
