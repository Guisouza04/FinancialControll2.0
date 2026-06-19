import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import { Div } from "./styles";

function NotFound() {
  return (
    <Div>
      <MenuNavecacao />
      <TituloPage titulo={"404 - Página não encontrada"} />
    </Div>
  );
}

export default NotFound;
