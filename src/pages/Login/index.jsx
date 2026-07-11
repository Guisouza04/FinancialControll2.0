import { useState } from "react";
import SignUpForm from "../../components/SignInForm";
import LoginForm from "../../components/LoginForm";
import { Body } from "./style";
import { Container } from "./style";
import { SignUpContainer } from "./style";
import { SignInContainer } from "./style";
import { OverlayContainer } from "./style";
import { Overlay } from "./style";
import { OverlayPanel } from "./style";
import { Title } from "./style";
import { Paragraph } from "./style";
import { GhostButton } from "./style";
import { Logo } from "./style";
import { MobileSwitch } from "./style";

import logoIcone from "../../assets/Showzas02.svg";

const TelaLogin = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    console.log("Sign Up clicked, setting isRightPanelActive to true");
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked, setting isRightPanelActive to false");
    setIsRightPanelActive(false);
  };

  return (
    <Body>
      <Container
        className={isRightPanelActive ? "right-panel-active" : ""}
        id="container"
      >
        <SignUpContainer
          className={isRightPanelActive ? "right-panel-active" : ""}
        >
          <SignUpForm /> {/* NOVO: Substituição do Form por SignUpForm */}
        </SignUpContainer>

        <SignInContainer
          className={isRightPanelActive ? "right-panel-active" : ""}
        >
          <LoginForm />
          <Logo src={logoIcone} alt="Logo" />
        </SignInContainer>

        <OverlayContainer
          className={isRightPanelActive ? "right-panel-active" : ""}
        >
          <Overlay className={isRightPanelActive ? "right-panel-active" : ""}>
            <OverlayPanel className="overlay-left">
              <Title>Bem-Vindo de Volta!</Title>
              <Paragraph>
                Para ficar conectado conosco, por favor, faça login com suas
                informações pessoais.
              </Paragraph>
              <GhostButton id="signIn" onClick={handleSignInClick}>
                Faça seu login
              </GhostButton>
            </OverlayPanel>
            <OverlayPanel className="overlay-right">
              <Logo src={logoIcone} alt="Logo" />
              <Title>Olá, Investidor!</Title>
              <Paragraph>
                Insira seus dados e comece sua jornada conosco
              </Paragraph>
              <GhostButton id="signUp" onClick={handleSignUpClick}>
                Cadastrar-se
              </GhostButton>
            </OverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>

      {/* Alternador visível apenas no mobile (o overlay deslizante fica oculto) */}
      <MobileSwitch>
        {isRightPanelActive ? (
          <>
            Já tem conta?
            <button type="button" onClick={handleSignInClick}>
              Entrar
            </button>
          </>
        ) : (
          <>
            Não tem conta?
            <button type="button" onClick={handleSignUpClick}>
              Cadastre-se
            </button>
          </>
        )}
      </MobileSwitch>
    </Body>
  );
};

export default TelaLogin;
