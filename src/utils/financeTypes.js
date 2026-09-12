/* Os quatro baldes do plano 60/20/10/10 — a identidade de cada `tipo`: como se
   chama, em que tela mora e de que cor é.

   Fonte ÚNICA desse mapa. Antes ele existia só dentro do `BUDGET` do Dashboard,
   e a rota de cada bucket aparecia solta em `App.jsx`, no hub de Finanças e no
   Nav — três lugares para sair de sincronia. Quem precisa navegar entre tipos
   (FinanceTabs e o atalho de visualização do Dashboard) lê daqui.

   `color` é a paleta categórica validada para a superfície roxa (contraste +
   CVD). As cores de status (`good`/`warning`/`critical`) nunca entram aqui:
   um bucket verde por acaso leria como aprovação. */
export const FINANCE_TYPES = [
  { tipo: 1, label: "Contas", labelSingular: "Conta", route: "/Contas", color: "#3987e5" },
  { tipo: 2, label: "Investimentos", labelSingular: "Investimento", route: "/Investments", color: "#199e70" },
  { tipo: 3, label: "Opcionais", labelSingular: "Opcional", route: "/Optional", color: "#c98500" },
  { tipo: 4, label: "Metas", labelSingular: "Meta", route: "/metas", color: "#d55181" },
];

/* Busca por `tipo`. Devolve `undefined` para tipo desconhecido — quem chama
   decide o fallback. */
export const financeTypeOf = (tipo) =>
  FINANCE_TYPES.find((t) => t.tipo === Number(tipo));
