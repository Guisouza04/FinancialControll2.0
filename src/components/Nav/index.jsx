import { Nav } from "./styles";
import { NavArrow } from "./styles";
import { Lista } from "./styles";
import { Itens } from "./styles";
import { Logo } from "./styles";
import logoIcone from "../../assets/Showzas.svg";
import { Link } from "react-router-dom";

function MenuNavecacao() {
  return (
    <Nav>
      <NavArrow>➜</NavArrow>
      <Lista>
        <Itens>
          <Link to="/">Dashboard</Link>
        </Itens>
        <Itens>
          <Link to="/despesas">Despesas</Link>
        </Itens>
        <Itens>
          <Link to="/metas">Metas</Link>
        </Itens>
        <Itens>
          <Link to="/dados">Dados</Link>
        </Itens>
      </Lista>
      <Logo src={logoIcone} alt="Logo" />
    </Nav>
  );
}

export default MenuNavecacao;
