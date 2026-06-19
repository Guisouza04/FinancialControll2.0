Faça uma varredura completa no frontend deste projeto em busca de bugs. Leia todos os arquivos relevantes em src/ antes de reportar.

Verifique especificamente:

**Autenticação & Segurança**
- O token `authToken` é lido e removido corretamente do `localStorage` em todos os fluxos (login, logout, expiração)
- O `PrivateRoute` protege todas as rotas que deveriam ser protegidas
- O interceptor do Axios injeta o token em todas as requisições autenticadas

**Rotas**
- Todas as rotas definidas no `App.jsx` têm uma página correspondente implementada
- Todos os links no `Nav` e nos `Cards` apontam para rotas existentes
- Não há rotas linkadas que não existem (ex: `/metas` no Nav)

**Chamadas de API (`financeService.js` + `useAccounts.js`)**
- Os endpoints usados correspondem aos métodos corretos (GET, POST, PUT, DELETE)
- Os payloads enviados para a API têm os campos corretos (`de_conta`, `vl_conta`, `qtd_parcelas`, `tipo`)
- O `transformAccount` mapeia corretamente todos os campos da resposta da API
- Os erros das chamadas de API são tratados e propagados corretamente

**Lógica de Componentes**
- O `ExpenseBox` calcula corretamente a parcela atual com base em `creationMonth` e `durationMonths`
- A lógica de filtro por mês/ano está correta (inclui itens ativos no período)
- A paginação não quebra quando o número de itens muda (ex: após deletar o último item de uma página)
- O `togglePaymentStatus` inverte corretamente `"S"↔"N"`

**Estado & Efeitos**
- Dependências de `useEffect` estão completas (sem variáveis faltando no array de deps)
- Não há memory leaks (ex: chamadas de API após componente desmontado)
- Formulários limpam o estado corretamente após submit ou cancelamento

**Funcionalidades Incompletas**
- Identifique funções que existem no frontend mas não enviam dados para a API (ex: salvar perfil, alterar senha, salvar salário)
- Identifique botões ou ações que não fazem nada

Ao final, apresente os bugs encontrados agrupados por severidade:
- 🔴 **Crítico** — quebra o funcionamento ou representa risco de segurança
- 🟡 **Médio** — funcionalidade incompleta ou comportamento incorreto
- 🟢 **Baixo** — inconsistências menores ou melhorias de robustez

Para cada bug, informe: **onde está** (arquivo:linha), **o que acontece** e **por que é um problema**. Não aplique nenhuma correção.
