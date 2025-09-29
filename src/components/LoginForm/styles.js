import styled from "styled-components";
import { css } from "styled-components";
import { keyframes } from "styled-components";

export const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
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

export const Text = styled.span`
  font-size: 12px;
`;
