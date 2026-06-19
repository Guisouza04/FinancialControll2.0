import { Link, useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import ExpenseBox from "../../components/ExpenseBox";

function Optional() {
  return (
    <div className="frame">
      <MenuNavecacao />
      <div className="containerExpenses">
        <TituloPage titulo="Opcionais" />
        <div className="boxExpenses">
          <div className="contentExpenses">
            <ExpenseBox tipo={3}></ExpenseBox>
          </div>
          <Link to="/Despesas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Optional;
