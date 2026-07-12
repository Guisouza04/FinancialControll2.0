import { Link } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import ExpenseBox from "../../components/ExpenseBox";

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
          <Link to="/Financas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Investments;
