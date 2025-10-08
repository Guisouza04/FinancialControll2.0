import { Link, useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import ExpenseBox from "../../components/BoxDespesas";

function Investments() {
  return (
    <div className="frame">
      <MenuNavecacao />
      <div className="containerExpenses">
        <TituloPage titulo="Investimentos" />
        <div className="boxExpenses">
          <div className="contentExpenses">
            <ExpenseBox tipo={2}></ExpenseBox>
          </div>
          <Link to="/Despesas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Investments;
