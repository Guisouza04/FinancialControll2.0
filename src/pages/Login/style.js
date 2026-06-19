import styled from "styled-components";
import { css } from "styled-components";
import { keyframes } from "styled-components";

export const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
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

export const Text = styled.span`
  font-size: 12px;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: transform 80ms ease-in;

  &:hover {
    color: var(--RoxoEscuro);
  }
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

export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  color: var(--background);
`;

export const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

export const SocialLink = styled.a`
  border: 1px solid var(--TextSecundarios);
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
  transition: transform 80ms ease-in;

  &:hover {
    transform: scale(0.95);
    box-shadow: 1px 1px 25px 0px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 1px 1px 25px 0px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 1px 1px 25px 0px rgba(0, 0, 0, 0.5);
  }
`;

export const SocialLogo = styled.img`
  width: 90%;

  &.Google {
    width: 26px;
  }

  &.Microsoft {
    width: 26px;
  }
`;

export const Logo = styled.img`
  position: relative;
  bottom: 1rem;
  width: 16.5rem;
`;
