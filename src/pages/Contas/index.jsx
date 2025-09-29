import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import { Container } from "./styles";
import { ContainerAccouts } from "./styles";
import { ContentAccouts } from "./styles";
import { AddCount } from "./styles";
import { BoxAccouts } from "./styles";

function Contas() {
  return (
    <div className="frame">
      <MenuNavecacao />
      <Container>
        <TituloPage titulo="Contas" />
        <ContainerAccouts>
          <ContentAccouts></ContentAccouts>
          <BotaoPadrao type="Submit" nomeBotao={"Salvar"} />
        </ContainerAccouts>
      </Container>
    </div>
  );
}

export default Contas;
