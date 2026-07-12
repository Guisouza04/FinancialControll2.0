import { useState } from "react";
import api from "../../services/api";
import logoGoogle from "../../assets/IconGoogle.svg";
import logoApple from "../../assets/IconApple.svg";
import logoMicrosoft from "../../assets/IconMicrosoft.svg";
import RequiredField from "../RequiredField";
import * as S from "./styles";
const {
  Title,
  SocialContainer,
  SocialLink,
  SocialLogo,
  Text,
  Input,
  Form,
  Anchor,
  Button,
  Paragraph,
} = S;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/security/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        setSuccess("Login realizado com sucesso!");
        // Mantém loading ativo durante o redirecionamento.
        setTimeout(() => {
          window.location.href = "/Dados";
        }, 1000);
      } else {
        setError("Usuário ou senha incorretos.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response?.status === 401) {
        setError("Usuário ou senha incorretos.");
      } else if (err.response?.status === 500) {
        setError("Erro no servidor. Tente novamente.");
      } else {
        setError("Erro inesperado. Verifique sua conexão.");
      }
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title className="Title">Login</Title>
      <SocialContainer>
        <SocialLink href="#">
          <SocialLogo src={logoGoogle} className="Google" />
        </SocialLink>
        <SocialLink href="#">
          <SocialLogo src={logoApple} />
        </SocialLink>
        <SocialLink href="#">
          <SocialLogo src={logoMicrosoft} className="Microsoft" />
        </SocialLink>
      </SocialContainer>
      <Text>ou use sua conta</Text>
      <RequiredField>
        <Input
          type="text"
          name="username"
          placeholder="Usuário"
          value={username}
          onChange={handleChange}
          disabled={loading}
        />
      </RequiredField>
      <RequiredField>
        <Input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={handleChange}
          disabled={loading}
        />
      </RequiredField>
      {error && (
        <Paragraph styles={{ color: "red", fontSize: "14px" }}>
          {error}
        </Paragraph>
      )}
      {success && (
        <Paragraph styles={{ color: "green", fontSize: "14px" }}>
          {success}
        </Paragraph>
      )}
      <Anchor href="#">Esqueceu sua senha?</Anchor>
      <Button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </Button>
    </Form>
  );
};

export default LoginForm;
