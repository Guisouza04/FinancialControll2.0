import { useState } from "react";
import api from "../../services/api";
import logoGoogle from "../../assets/IconGoogle.svg";
import logoApple from "../../assets/IconApple.svg";
import logoMicrosoft from "../../assets/IconMicrosoft.svg";
import * as S from "./styles";
const {
  Title,
  SocialContainer,
  SocialLink,
  SocialLogo,
  Text,
  Input,
  Form,
  Button,
  Paragraph,
} = S;

const SignUpForm = () => {
  const [CPF, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "CPFuser") {
      const onlyNumbers = value.replace(/\D/g, "");
      setCPF(onlyNumbers);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validação local
    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/security/signup", {
        CPF,
        password,
        confirmPassword,
        email,
      });

      if (response.data.success) {
        setSuccess("Cadastro realizado com sucesso!");
        setCPF("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          window.location.href = "/Login";
        }, 1500);
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      if (
        err.response?.status === 400 &&
        err.response.data.error === "As senhas não correspondem"
      ) {
        setError("As senhas não correspondem.");
      } else if (
        err.response?.status === 400 &&
        err.response.data.error === "CPF já cadastrado"
      ) {
        setError("CPF já cadastrado.");
      } else if (err.response?.status === 500) {
        setError("Erro no servidor. Tente novamente.");
      } else {
        setError("Erro inesperado. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title className="Title">Criar uma Conta</Title>
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
      <Text>ou use seu e-mail para registro</Text>
      <Input
        type="text"
        pattern="\d{11}"
        maxLength={11}
        name="CPFuser"
        placeholder="Seu CPF somente números*"
        value={CPF}
        onChange={handleChange}
        disabled={loading}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Seu melhor Email*"
        value={email}
        onChange={handleChange}
        disabled={loading}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Digite uma senha*"
        value={password}
        onChange={handleChange}
        disabled={loading}
        required
      />
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar Senha*"
        value={confirmPassword}
        onChange={handleChange}
        disabled={loading}
        required
      />
      {error && (
        <Paragraph style={{ color: "red", fontSize: "14px" }}>
          {error}
        </Paragraph>
      )}
      {success && (
        <Paragraph style={{ color: "green", fontSize: "14px" }}>
          {success}
        </Paragraph>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Criar"}
      </Button>
    </Form>
  );
};

export default SignUpForm;
