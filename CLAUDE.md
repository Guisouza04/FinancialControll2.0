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
| `/` | Home | **Dashboard** — resumo financeiro: KPIs, medidores da divisão 60/20/10/10 e donut de distribuição |
| `/Login` | TelaLogin | Login/Cadastro (público) |
| `/Financas` | Despesas (componente) | Hub "Finanças": Contas, Investimentos, Opcionais |
| `/Contas` | Contas | `ExpenseBox tipo={1}` |
| `/Investments` | Investments | `ExpenseBox tipo={2}` |
| `/Optional` | Optional | `ExpenseBox tipo={3}` |
| `/importar` | ImportarExtrato | Importa extrato OFX de cartão com tela de revisão manual |
| `/Dados` | Dados | Hub: modal de Perfil, página Settings, modal de Salário |
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
updatePaymentStatus(id, competencia, status)  // PUT /financas/payment-status/{id} — status POR parcela
fetchSalary()                          // GET /financas/salary → { salario:number|null, periodoPagamento }
importPreview(content)                 // POST /financas/import/preview → { moeda, transacoes[] } (não grava)
importCommit(items)                    // POST /financas/import/commit → { success, created } (grava lançamentos ÚNICOS)
fetchTags()                            // GET /financas/tags → [{ id, nome, cor }]
createTag({ nome, cor })               // POST /financas/tags → tag criada (cor hex "#RRGGBB")
updateTag(id, { nome, cor })           // PUT /financas/tags/{id}
deleteTag(id)                          // DELETE /financas/tags/{id} (some das ligações; lançamentos ficam)
transformAccount(item)                 // Helper: normaliza resposta da API
```

**Shape da API (response):**
```json
{ "id": 1, "de_conta": "Nome", "vl_conta": "150.00", "qtd_parcelas": 12, "tipo": 1, "conta_paga": "S", "dt_create": "2025-01-15T...",
  "pagamentos": ["2026-08", "2026-10"] }
```
> **`pagamentos`** é a lista de competências (`"YYYY-MM"`) pagas — status **por parcela** (ver seção *Pagamento por competência*). Ausente em registros/backends legados → cai no `conta_paga` único.

**Shape transformado (frontend):**
```json
{ "id": 1, "name": "Nome", "value": 150.0, "creationMonth": "2025-01", "durationMonths": 12, "tipo": 1, "contaPaga": "S",
  "pagamentos": ["2026-08", "2026-10"], "tags": [{ "id": 3, "nome": "Mercado", "cor": "#199e70" }],
  "recorrencia": "MENSAL", "diaVencimento": 10, "dataInicio": "2026-07-10", "dataFim": "2026-12-10" }
```

**Payload para create/update:**
```json
{ "de_conta": "string", "vl_conta": "string", "tipo": number,
  "recorrencia": "UNICA" | "MENSAL" | "ANUAL", "dia_vencimento": number, "data_inicio": "YYYY-MM-DD", "data_fim": "YYYY-MM-DD",
  "qtd_parcelas": number, "tag_ids": number[] }
```
> **`tag_ids`** é o conjunto **completo** de tags do lançamento (o backend substitui, não faz merge). IDs de tags de outro usuário são ignorados.

> **`vl_conta`** é enviado como string com ponto decimal (`"1234.56"`); a máscara BRL no input é só de exibição (`src/utils/currency.js`).

### Recorrência

Campos gerados por `src/utils/recurrence.js` no create/update. **O backend persiste** `recorrencia`/`dia_vencimento`/`data_inicio`/`data_fim` (migração `0002_recorrencia`); `qtd_parcelas` continua como total de ocorrências.

| Recorrência | Campos | Regra |
|---|---|---|
| `UNICA` | `dia_vencimento`, `data_inicio` = `data_fim` | Ocorre só no mês/ano escolhido |
| `MENSAL` | `dia_vencimento`, `data_inicio`, `data_fim` | Todo mês no dia, do mês inicial até o **mês final (editável)** — padrão dezembro |
| `ANUAL` | `dia_vencimento`, `data_inicio` (dia+mês), `data_fim` (`ano_inicio + N - 1`) | Uma vez por ano na data, por N anos (teto 5) |

- Registros **legados** (sem `recorrencia`) continuam tratados pela lógica antiga de `qtd_parcelas`/`creationMonth`. `deriveRecurrenceForm` converte legado → formulário ao editar.
- **Quinzenal** ainda não implementado.
- **Edição** é feita via **modal** (✏️ na linha), reusando o formulário de recorrência — permite alterar nome, valor e o período (fim do mensal, converter única↔mensal, etc.). O início é preservado.

> **Filtro por período é feito no frontend.** O backend (`GET /financas/{tipo}`) retorna **todos** os lançamentos do usuário para o tipo (não filtra mais por `dt_create` — isso escondia contas recorrentes fora do mês de criação).

**Helpers de período reutilizáveis (`src/utils/recurrence.js`):**
- `accountActiveInPeriod(account, ano, mes)` — encapsula recorrência + legado (mesma lógica de filtro do ExpenseBox, sem o filtro de status).
- `sumActiveInPeriod(accounts, ano, mes)` — soma o valor de **todas** as contas ativas no período. Usado pelo Dashboard.

> **`naFatura` é só um MARCADOR (💳) de compra de cartão** — **não** exclui do total (a regra antiga de "não somar", que evitava dupla contagem com uma fatura-lump, foi aposentada quando passamos a itemizar as compras via importação de extrato). O checkbox no modal vale para qualquer tipo. Compras de cartão têm `dataCompra` (data original) separada do **período do lançamento**, que é o **mês do vencimento da fatura** (quando entra no orçamento).

### Pagamento por competência (status por parcela)

Uma conta recorrente é **1 linha** expandida visualmente em vários meses. Por isso o pagamento **não** pode ser um campo único na conta — é rastreado **por competência** (`"YYYY-MM"`).

- **Modelo (A):** backend usa tabela `pagamentos(conta_id, competencia, pago)`. Marcar como paga faz upsert da competência; desmarcar remove/desativa.
- **Contrato:** `GET` devolve `pagamentos: ["YYYY-MM", ...]` por conta. `PUT /financas/payment-status/{id}` recebe `{ competencia: "YYYY-MM", conta_paga: "S"|"N" }`.
- **Frontend (`src/utils/recurrence.js`):** `occurrenceCompetencia(account, ano, mes)` deriva a competência da parcela exibida (UNICA→mês de início; ANUAL→ano do filtro + mês de início; MENSAL/legado→ano+mês do filtro, `null` se sem mês). `isPaidInPeriod(...)` checa se a competência está em `pagamentos`.
- **UX:** com filtro "Todos os meses" a competência de uma conta MENSAL é ambígua → o toggle bloqueia e pede para selecionar um mês.
- **Compatibilidade:** se `pagamentos` vier ausente (`null`), a UI cai no `contaPaga` único legado.

### Tags (categorização de lançamentos)

Rótulos livres do usuário (ex.: "Mercado", "Combustível") para categorizar lançamentos, **transversais ao `tipo`** — o `tipo` é o *plano/orçamento* (60/20/10/10), a tag é a *natureza do gasto*. Um lançamento pode ter **várias** tags (N:N).

- **Modelo:** propriedade do **lançamento** (não da parcela) → valem para todas as ocorrências de um recorrente, sem a complexidade por-competência de `pagamentos`. Cada tag tem `cor` (hex) escolhida de uma paleta (`src/utils/tagColors.js`).
- **Backend:** tabela `tags(id, user_id, nome, cor)` + associação `lancamento_tags(lancamento_id, tag_id)`. Nome único por usuário (case-insensitive). CRUD em `/financas/tags`. Create/update de lançamento aceitam `tag_ids` (conjunto completo). Migração `0007_tags`.
- **Frontend:** `src/hooks/useTags.js` (busca 1x, expõe `addTag`/`editTag`/`removeTag`); `src/components/TagPicker` (seleção multi + criação inline com paleta + exclusão global com confirmação). O `ExpenseBox` usa o picker no modal, exibe chips na tabela e filtra por tag.

### `src/hooks/useAccounts.js`
Custom hook usado por todas as páginas de despesas:

```js
const { accounts, loading, error, fetchAccounts, addAccount, updateAccount, deleteAccount, togglePaymentStatus }
  = useAccounts(tipo, filterYear, filterMonth)
```

- Faz fetch automático no mount e quando `tipo`/filtros mudam
- Todos os métodos retornam `{ success: true, data? }` ou `{ success: false, error: string }`
- `togglePaymentStatus(id, competencia, currentPaid)` marca/desmarca **a parcela** daquela competência (atualiza a lista `pagamentos` localmente)

---

## Componente Central: `ExpenseBox`

`src/components/ExpenseBox/index.jsx` — usado em Contas, Investments e Optional com `tipo` diferente.

**Props:** `tipo` (1, 2 ou 3)

**Funcionalidades:**
- **Filtros:** Ano (input) + Mês (Select) + **Status** (Todas / Pagas / Pendentes) + **Tag** (Todas as tags / uma tag). Default: mês e ano atuais.
- **Tags:** chips coloridos na coluna Nome; no modal, um `TagPicker` seleciona/cria/exclui tags (ver seção *Tags*).
- **Paginação:** itens por página **dinâmicos** — calculados pela altura disponível da tabela via `ResizeObserver` no `TableWrapper` (a tabela ocupa a altura da tela e enche de linhas).
- **Tabela:** Nome | Valor (`R$ 1.234,56`) | Parcela (índice/total da ocorrência) | Status (verde "Paga" / vermelho "Pendente") | Ações. Layout de altura cheia (`flex` do `.frame` até o corpo) com cabeçalho fixo (`sticky`); scroll no `TableWrapper`.
- **Ações:** Editar (✏️ → abre modal pré-preenchido: nome, valor e recorrência/período), Deletar com confirmação, Toggle de pagamento com confirmação
- **Modal (add/edição):** Overlay com Nome, Valor (máscara BRL) e Recorrência (Única/Mensal/Anual + campos condicionais) — mesmo modal para criar e editar
- **Botão de filtro:** "Mês Atual" (ou "Data Atual" se o ano do filtro difere do sistema) restaura mês+ano correntes

**Lógica de filtro por período:**
- Contas com `recorrencia`: `isActiveInPeriod`/`occurrenceLabel` de `src/utils/recurrence.js`
- Legado (sem `recorrencia`): janela de meses consecutivos por `creationMonth` + `durationMonths`
- Sem filtro: mostra todos

---

## Dashboard (`src/pages/Home`)

Tela inicial (`/`) — resumo financeiro do mês selecionado. Filtro de Mês/Ano local (default: atual); a divisão-alvo do salário é **60% Contas · 20% Investimentos · 10% Opcionais · 10% Metas**.

- **Dados:** `useAccounts(1..4)` (busca cada tipo **uma vez**, sem filtro; a soma por período é client-side via `sumActiveInPeriod`) + `financeService.fetchSalary()`.
- **Config `BUDGET`:** cada bucket tem `pct` e `kind` — `teto` (Contas, Opcionais: não pode passar → vermelho quando excede) vs `meta` (Investimentos, Metas: alvo a alcançar → verde ao atingir).
- **Seções:** KPIs (salário, comprometido, saldo livre, % de contas) → **medidores** por bucket (gasto × limite, forma "razão vs. limite") → **donut** SVG da distribuição real + legenda Real × Plano.
- **Paleta categórica** (validada p/ CVD/contraste na superfície roxa): Contas `#3987e5`, Investimentos `#199e70`, Opcionais `#c98500`, Metas `#d55181`. Cores de status são fixas e nunca reutilizadas como cor de série.
- **Estado vazio:** sem salário configurado → aviso com link p/ `/dados` (medidores ficam sem limite; distribuição ainda funciona).

## Importação de Extrato OFX (`src/pages/ImportarExtrato`)

Rota `/importar` (card no hub de Finanças). Fluxo **stateless com revisão manual**:

1. Usuário seleciona um `.ofx`. `readOfxText(file)` lê respeitando o charset do cabeçalho (OFX 1.x SGML costuma ser Windows-1252/Latin-1; 2.x é UTF-8) — ler tudo como UTF-8 corromperia acentos.
2. `importPreview(content)` → backend faz o parse (`app/services/ofx.py`, sem lib externa) e devolve as transações **sem gravar**.
3. Tela de revisão: cada linha tem checkbox + Data + Descrição + badge Débito/Crédito + Valor + Select de tipo. **Créditos (pagamentos/estornos) já vêm desmarcados**; tipo padrão = Conta. Há "aplicar tipo às selecionadas".
4. Usuário informa o **vencimento da fatura** (`data_vencimento`, via `DatePicker` customizado) — o mês em que as compras entram no orçamento. `importCommit(items)` grava cada transação como **lançamento ÚNICO** (`recorrencia="UNICA"`) nesse mês, com `na_fatura=true` (marcador 💳) e `data_compra` = data original da compra (só informação).

> **Duas datas:** `data_compra` (quando comprou, ex.: 30/06) ≠ período do lançamento (`data_inicio`/`data_fim` = mês do vencimento da fatura, ex.: agosto — onde conta no orçamento). Campo `data_compra` adicionado na migração `0005_data_compra`.
> **Backend:** endpoints `POST /financas/import/{preview,commit}`. O conteúdo do arquivo é enviado como **texto no corpo** (não multipart) para não exigir `python-multipart`. Sem tabela de staging (por ora). Exemplo de teste: `FinancialControllBackend/samples/exemplo_fatura.ofx`.
> **Dedup por FITID (migração `0006_fitid`):** cada lançamento importado guarda o `fitid` (id único da transação OFX). O `preview` marca `ja_importada=true` quando o FITID já existe (a UI traz a linha desmarcada com badge "já importada"); o `commit` **pula** FITIDs já gravados (ou repetidos no mesmo lote) e retorna `{ created, skipped }`. Transações **sem FITID** não são deduplicadas. Registros importados **antes** dessa migração não têm `fitid` → não são detectados (limpeza manual).

## Toasts (`src/components/Toast`)

Notificações globais. `ToastProvider` (montado no `main.jsx`) renderiza a fila; as telas só consomem `useToast()` (`src/context/toast.js` — context + hook isolados p/ não quebrar o Fast Refresh) e chamam `success`/`error`/`warning`/`info`/`show`/`dismiss`. Duração padrão: **4s** (`show(tipo, msg, { duration })`; `duration: 0` = fixo, sem barra).

**As três regras abaixo valem para todo toast do sistema — a lógica é do provider, nenhuma tela precisa implementá-las:**

1. **Barra de tempo:** `ToastProgress` na base do toast encolhe de 100% a 0 durante a duração (`scaleX` linear — roda no compositor, sem reflow por frame), na cor do tipo.
2. **Dedupe com reset:** toasts são indexados por `tipo + mensagem` (`dedupeKey`, refs `idByKey`/`keyById` — refs, não state, para `show` consultar de forma síncrona). Reacionar a **mesma** condição reaproveita o toast já visível, reinicia o timer e remonta a barra (via `key={resetKey}`) em vez de empilhar cópias; se ele já estava saindo, a saída é cancelada e ele volta. Mensagens diferentes continuam empilhando.
3. **Saída animada:** `slideOut` = `slideIn` invertido, mesma curva e duração (`TRANSITION_MS`, exportado de `styles.js` e compartilhado com o provider). `dismiss` marca `leaving` e só remove do DOM quando a animação termina.

> **Ao testar animação de toast no navegador:** aba em segundo plano (`document.visibilityState === "hidden"`) congela animações CSS e estrangula timers — a barra aparece travada em `scaleX(1)` e as medições de tempo saem distorcidas. Meça com a aba visível.

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
- **Controles nativos não estilizáveis são substituídos por componentes próprios (tema dark-glass):** `Select` (no lugar do `<select>`) e `DatePicker` (`src/components/DatePicker`, no lugar do `<input type="date">` — o calendário/popup nativo não é estilizável por CSS). Ambos: gatilho + popup, fecham no clique fora/Esc, `value`/`onChange` diretos.

---

## Bugs / Pendências Conhecidas

| Item | Detalhe |
|---|---|
| Metas não implementado | `tipo=4` tem suporte no service mas sem página/rota |
| Rota `/metas` quebrada | Nav linka para `/metas` que não existe no App.jsx |
| Social login placeholder | Botões Google/Apple/Microsoft na tela de login são não-funcionais |
| Salário — confirmar backend | Modal de `/Dados` faz `POST /financas/salary`; validar se o backend implementa |
| Perfil — confirmar backend | Modal de Perfil (em `/Dados`) faz `PUT /security/profile`; validar se o backend implementa |

**Resolvidos recentemente:** logout agora limpa o token (`localStorage.removeItem('authToken')` em `Settings`); Perfil deixou de ser página e virou modal em `/Dados` com submit real via API.
