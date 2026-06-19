import { Link, useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import ExpenseBox from "../../components/ExpenseBox";

function Contas() {
  return (
    <div className="frame">
      <MenuNavecacao />
      <div className="containerExpenses">
        <TituloPage titulo="Contas" />
        <div className="boxExpenses">
          <div className="contentExpenses">
            <ExpenseBox tipo={1}></ExpenseBox>
          </div>
          <Link to="/Despesas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Contas;
