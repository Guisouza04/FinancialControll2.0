import { useEffect } from "react";
import api from "../../services/api";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import { Div } from "./styles";
import { FormContainer } from "./styles";
import { StyledForm } from "./styles";
import { Title } from "./styles";
import { BoxBotao } from "./styles";
import { useState } from "react";
import { Link } from "react-router-dom";

const Perfil = () => {
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
  };

  return (
    <div className="frame">
      <MenuNavecacao />
      <Div>
        <TituloPage titulo={"Dados > Perfil"} />
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Title>Seus Dados</Title>
            <input
              type="text"
              name="nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="Apelido"
              placeholder="Como você gostaria de ser chamado?"
              value={formData.apelido}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Seu melhor E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <BoxBotao>
              <Link to="../Dados">
                <BotaoPadrao nomeBotao={"Voltar"}></BotaoPadrao>
              </Link>
              <BotaoPadrao nomeBotao={"Salvar"}></BotaoPadrao>
            </BoxBotao>
          </StyledForm>
        </FormContainer>
      </Div>
    </div>
  );
};

export default Perfil;
