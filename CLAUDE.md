# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint (React Hooks + React Refresh plugins)
```

No test framework configured — only ESLint for code quality.

## Tech Stack

React 19 + Vite 7 + React Router DOM 7. Styling via **styled-components** (CSS-in-JS). No TypeScript. Backend expected at `http://localhost:4000/api`.

---

## Routing (`src/App.jsx`)

All routes except `/Login` are wrapped in `PrivateRoute`.

| Route | Page | Description |
|---|---|---|
| `/` | Home | Dashboard — só renderiza o Nav |
| `/Login` | TelaLogin | Login/Cadastro (público) |
| `/Despesas` | Despesas | Hub de navegação para Contas, Investimentos, Opcionais |
| `/Contas` | Contas | `ExpenseBox tipo={1}` |
| `/Investments` | Investments | `ExpenseBox tipo={2}` |
| `/Optional` | Optional | `ExpenseBox tipo={3}` |
| `/Dados` | Dados | Hub para Perfil, Settings, modal de Salário |
| `/Perfil` | Perfil | Editar dados do usuário (save ainda não implementado) |
| `/Settings` | Settings | Alterar senha, logout |
| `*` | NotFound | 404 |

> **Quirk:** O Nav linka para `/metas` mas essa rota não existe no App.jsx.

---

## Auth Flow

1. `POST /security/login` → resposta: `{ success: true, authToken: "JWT" }`
2. Token salvo em `localStorage.authToken`
3. `PrivateRoute` (`src/components/Private/PrivateRoute.jsx`) lê `localStorage.authToken` — sem token redireciona para `/Login`
4. Axios interceptor em `src/services/api.js` injeta `Authorization: Bearer {token}` em **todas** as requisições automaticamente
5. Logout (Settings): apenas navega para `/Login` — **não limpa o localStorage** (bug conhecido)

Cadastro: `POST /security/signup` com `{ CPF, email, password, confirmPassword }`.

---

## Tipo: Mapeamento Central

O parâmetro `tipo` é o mecanismo central que conecta páginas, endpoints e o `ExpenseBox`:

| tipo | Categoria | Endpoint da API | Página |
|---|---|---|---|
| 1 | Contas | `GET /financas/contas` | `/Contas` |
| 2 | Investimentos | `GET /financas/investimentos` | `/Investments` |
| 3 | Opcionais | `GET /financas/opcionais` | `/Optional` |
| 4 | Metas | `GET /financas/metas` | Não implementado |

---

## Camada de Dados

### `src/services/api.js`
Instância Axios com `baseURL: http://localhost:4000/api` e interceptor de token.

### `src/services/financeService.js`
Todos os métodos de CRUD financeiro:

```js
fetchAccounts(tipo, year, month)       // GET /financas/{endpoint}?year=&month=
createAccount(accountData)             // POST /financas/create
updateAccount(id, accountData)         // PUT /financas/update/{id}
deleteAccount(id)                      // DELETE /financas/delete/{id}
updatePaymentStatus(id, status)        // PUT /financas/payment-status/{id}
transformAccount(item)                 // Helper: normaliza resposta da API
```

**Shape da API (response):**
```json
{ "id": 1, "de_conta": "Nome", "vl_conta": "150.00", "qtd_parcelas": 12, "tipo": 1, "conta_paga": "S", "dt_create": "2025-01-15T..." }
```

**Shape transformado (frontend):**
```json
{ "id": 1, "name": "Nome", "value": 150.0, "creationMonth": "2025-01", "durationMonths": 12, "tipo": 1, "contaPaga": "S" }
```

**Payload para create/update:**
```json
{ "de_conta": "string", "vl_conta": "string", "qtd_parcelas": number, "tipo": number }
```

### `src/hooks/useAccounts.js`
Custom hook usado por todas as páginas de despesas:

```js
const { accounts, loading, error, fetchAccounts, addAccount, updateAccount, deleteAccount, togglePaymentStatus }
  = useAccounts(tipo, filterYear, filterMonth)
```

- Faz fetch automático no mount e quando `tipo`/filtros mudam
- Todos os métodos retornam `{ success: true, data? }` ou `{ success: false, error: string }`
- `togglePaymentStatus(id, currentStatus)` inverte `"S"↔"N"` automaticamente

---

## Componente Central: `ExpenseBox`

`src/components/ExpenseBox/index.jsx` — usado em Contas, Investments e Optional com `tipo` diferente.

**Props:** `tipo` (1, 2 ou 3)

**Funcionalidades:**
- **Filtros:** Ano (input numérico) + Mês (dropdown 01-12). Default: mês e ano atuais.
- **Paginação:** 5 itens por página com Previous/Next.
- **Tabela:** Nome | Valor | Parcela (atual/total calculada pela `creationMonth`) | Status (verde "Paga" / vermelho "Pendente") | Ações
- **Ações:** Editar inline (✏️ → salva com ✅ ou cancela com ❌), Deletar com confirmação, Toggle de pagamento com confirmação
- **Modal de adição:** Overlay com campos Nome, Valor, Parcelas — usa classes globais `.modalOverlay` e `.defaultModal`

**Lógica de filtro por período:**
- Inclui itens que estejam ativos no mês/ano filtrado (baseado em `creationMonth` + `durationMonths`)
- Sem filtro: mostra todos

---

## Estilo Global (`src/styles/globalStyles.js`)

**Variáveis CSS (`:root`):**
```css
--background: #1E0033       /* roxo escuro — fundo principal */
--RoxoNubank: #820AD1       /* roxo primário */
--Complementar: #E5CCFF     /* roxo claro */
--RoxoClaro: #A45DE7
--RoxoEscuro: #4F0186
--TextSecundarios: #B3B3B3
```

**Classes utilitárias:**
- `.frame` — Grid `auto 1fr` (sidebar Nav + conteúdo)
- `.containerExpenses` — Flex column, padding 5rem, gap 4rem (wrapper das páginas de despesa)
- `.button2` / `.button3` — Botões roxo gradiente / branco
- `.modalOverlay` / `.defaultModal` — Overlay fixo + modal centralizado

**Base font-size:** `62.5%` no `html` → `1rem = 10px`

---

## Convenções do Projeto

- **Estrutura de componente:** `ComponentName/index.jsx` + `ComponentName/styles.js`
- **Nomenclatura:** Nomes em português para features/páginas, inglês para lógica técnica
- **Endpoints:** Financeiros em `/financas/*`, autenticação em `/security/*`
- **Sem estado global:** Não há Redux nem Context API — estado é local ou no `useAccounts` hook
- **Imports de componentes:** Usar alias/nomes descritivos nas importações de styled components

---

## Bugs / Pendências Conhecidas

| Item | Detalhe |
|---|---|
| Logout não limpa token | `Settings` navega para `/Login` sem remover `localStorage.authToken` |
| Perfil sem submit | Botão salvar em `/Perfil` só faz `console.log`, sem chamada de API |
| Dados sem backend | Modal de salário em `/Dados` não salva nada |
| Metas não implementado | `tipo=4` tem suporte no service mas sem página/rota |
| Rota `/metas` quebrada | Nav linka para `/metas` que não existe no App.jsx |
| Social login placeholder | Botões Google/Apple/Microsoft na tela de login são não-funcionais |
