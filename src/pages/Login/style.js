import styled from "styled-components";
import { css } from "styled-components";
import { keyframes } from "styled-components";

export const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100dvh;
    padding: 2rem 1.5rem 3rem;
  }
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
  }
`;

export const MobileSwitch = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
    align-items: center;
    margin-top: 2.2rem;
    font-size: 1.5rem;
    color: var(--text-muted);

    button {
      background: none;
      border: none;
      color: var(--RoxoClaro);
      font-weight: 700;
      font-size: 1.5rem;
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

export const FormContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
`;

export const SignInContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  z-index: 2;
  ${({ className = "" }) =>
    className.includes("right-panel-active") &&
    css`
      transform: translateX(100%);
    `}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: auto;
    transform: none;
    display: ${({ className = "" }) =>
      className.includes("right-panel-active") ? "none" : "block"};
  }
`;

export const SignUpContainer = styled(FormContainer)`
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${({ className = "" }) =>
    className.includes("right-panel-active") &&
    css`
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: ${show} 0.6s;
    `}

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: auto;
    transform: none;
    opacity: 1;
    animation: none;
    display: ${({ className = "" }) =>
      className.includes("right-panel-active") ? "block" : "none"};
  }
`;

const show = keyframes`
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${({ className = "" }) =>
    className.includes("right-panel-active") &&
    css`
      transform: translateX(-100%);
    `}

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Overlay = styled.div`
  background: linear-gradient(90deg, #820ad1 0%, #4f0186ff 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${({ className = "" }) =>
    className.includes("right-panel-active") &&
    css`
      transform: translateX(50%);
    `}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  &.overlay-left {
    ${({ className = "" }) =>
      className.includes("right-panel-active") &&
      css`
        transform: translateX(0);
      `}
  }

  &.overlay-right {
    right: 0;
    transform: translateX(0);
    ${({ className = "" }) =>
      className.includes("right-panel-active") &&
      css`
        transform: translateX(20%);
      `}
  }
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0;

  &.Title {
    color: var(--RoxoEscuro);
  }
`;

export const Paragraph = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: var(--TextSecundarios);
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid var(--RoxoNubank);
  background: linear-gradient(90deg, #4f0186ff 0%, var(--background) 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;

  &:active,
  &:hover {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

export const Logo = styled.img`
  position: relative;
  bottom: 1rem;
  width: 16.5rem;
`;
