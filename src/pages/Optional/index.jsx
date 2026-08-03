import { Link } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import ExpenseBox from "../../components/ExpenseBox";
import FinanceTabs from "../../components/FinanceTabs";

function Optional() {
  return (
    <div className="frame">
      <MenuNavecacao />
      <div className="containerExpenses">
        <div className="pageHead">
          <TituloPage titulo="Opcionais" />
          <FinanceTabs />
        </div>
        <div className="boxExpenses">
          <div className="contentExpenses">
            <ExpenseBox tipo={3}></ExpenseBox>
          </div>
          <Link to="/Financas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Optional;
