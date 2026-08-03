import { FINANCE_TYPES } from "../../utils/financeTypes";
import { TabBar, Tab, TabDot } from "./styles";

/* Barra de abas das quatro seções de finança (Contas · Investimentos ·
   Opcionais · Metas). Sem props: a aba ativa vem da URL, não de quem renderiza
   — assim nenhuma tela pode se declarar a seção errada.

   Importar Extrato fica de fora de propósito: é uma ação, não um tipo. */
function FinanceTabs() {
  return (
    <TabBar aria-label="Seções de finanças">
      {FINANCE_TYPES.map((t) => (
        <Tab key={t.tipo} to={t.route} end>
          <TabDot $color={t.color} aria-hidden="true" />
          {t.label}
        </Tab>
      ))}
    </TabBar>
  );
}

export default FinanceTabs;
