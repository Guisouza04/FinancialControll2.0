# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📚 Vault (fonte de verdade sobre o sistema)

**`../Vault/`** é um cofre Obsidian com a documentação profunda do sistema:
regra de negócio, o que cada tela entrega, decisões arquiteturais (ADRs) e
limites. **Este `CLAUDE.md` é o cartão de referência rápida; o vault é a
profundidade.**

**Antes de implementar qualquer coisa, leia `../Vault/06-Guias/Guia-Antes-de-Implementar.md`.**
Ele diz exatamente quais notas ler para o que você vai tocar.

Pontos de entrada:

| Arquivo | Para |
|---|---|
| `../Vault/Mapa-do-Sistema.md` | Hub — comece aqui se não sabe por onde |
| `../Vault/06-Guias/Guia-Antes-de-Implementar.md` | Checklist antes de mexer |
| `../Vault/05-Decisoes/ADR-Index.md` | **Por que** algo é do jeito que é |
| `../Vault/07-Limites/O-que-o-sistema-nao-faz.md` | Antes de propor feature nova |
| `../Vault/07-Limites/Pendencias.md` | Bugs e dívida conhecidos |

**Regras:**

1. **Consulte antes de implementar.** Várias decisões deste projeto são
   contra-intuitivas e têm ADR justamente porque alguém tentaria "consertá-las"
   (`na_fatura` não excluir do total, metas sem tabela, filtro client-side).
2. **Atualize junto com o código.** Mudou regra de negócio → atualiza a nota,
   no mesmo trabalho. É parte do "pronto", não tarefa separada.
3. **Divergência → o vault vence** e este arquivo é corrigido.

---

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint (React Hooks + React Refresh plugins)
```

No test framework configured — only ESLint for code quality.

## Tech Stack

React 19 + Vite 7 + React Router DOM 7. Styling via **styled-components** (CSS-in-JS). No TypeScript. Backend expected at `http://localhost:8000/api`.

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
| `/metas` | Metas | Cards de progresso das metas (`tipo=4`) — **path minúsculo** |
| `/importar` | ImportarExtrato | Importa extrato OFX de cartão com tela de revisão manual |
| `/Settings` | Settings | **Configurações** (item do Nav): Perfil, Dados (salário), Alterar Senha, Sair |
| `/dados` | — | **Redirect** para `/Settings` (a tela de Dados foi absorvida) |
| `*` | NotFound | 404 |

> **A antiga tela `/dados` não existe mais.** A hierarquia estava invertida — o
> Nav levava a "Dados", e era dentro dela que havia um card para
> "Configurações". Hoje o Nav leva a **Configurações** (`/Settings`), que reúne
> os quatro cards (Perfil · Dados · Alterar Senha · Sair). `src/pages/Dados/` foi
> removido e `/dados` virou `<Navigate to="/Settings" replace />` para não
> quebrar links antigos. Ver `../Vault/02-Telas/Tela-Dados.md`.

> **A caixa das rotas é inconsistente — e isso não quebra nada.** O Nav linka
> `/metas` em minúsculo e `/Settings` em maiúsculo, o hub de Finanças linka `/contas`,
> `/investments` e `/optional`, enquanto o `App.jsx` registra `/Contas`,
> `/Investments`, `/Optional`. **Funciona porque o React Router 7 casa rotas de
> forma case-insensitive por padrão** (`caseSensitive` é opt-in por rota e não é
> usado aqui). Se fosse sensível à caixa, três dos quatro cards do hub cairiam
> no 404. Não "conserte" um link achando que a caixa causa 404 — a causa é
> outra. Ver `../Vault/05-Decisoes/ADR-006-Caixa-das-rotas.md`.

### Navegação entre as quatro seções de finança

As telas dos quatro baldes (`/Contas`, `/Investments`, `/Optional`, `/metas`) têm
uma **barra de abas** (`FinanceTabs`) na linha do título, com a aba atual
destacada — trocar de seção é um clique, sem passar pelo hub. O hub `/Financas`
continua sendo a porta de entrada e o **único** acesso a `/importar`; o botão
"Voltar" de cada tela também segue lá. Ver a seção *FinanceTabs* abaixo.

---

## Auth Flow

1. `POST /security/login` → resposta: `{ success: true, authToken: "JWT" }`
2. Token salvo em `localStorage.authToken`
3. `PrivateRoute` (`src/components/Private/PrivateRoute.jsx`) lê `localStorage.authToken` — sem token redireciona para `/Login`
4. Axios interceptor em `src/services/api.js` injeta `Authorization: Bearer {token}` em **todas** as requisições automaticamente
5. Logout (Settings): `localStorage.removeItem('authToken')` + navega para `/Login`. É **client-side apenas** — não há revogação no servidor, então um JWT vazado vale até expirar (1 dia)
6. **Interceptor de resposta:** em **401**, `api.js` limpa o token e redireciona para `/Login` (com guarda para não redirecionar se já estiver lá). É o que derruba a sessão quando o token expira — `PrivateRoute` só checa se o token **existe**, não se é válido

Cadastro: `POST /security/signup` com `{ CPF, email, password, confirmPassword }`.

---

## Tipo: Mapeamento Central

## Valor por competência

`account.value` é o valor padrão do lançamento. Em cálculos que representam um
mês específico, use `occurrenceValue(account, year, month)`: ele aplica uma
eventual exceção de `valoresCompetencia` sem alterar as demais parcelas.
O `ExpenseBox` oferece a escolha entre editar somente a competência filtrada ou
abrir a edição global. Metas (tipo 4) não aceitam valores variáveis nesta versão.

Ver `../Vault/01-Dominio/Valor-por-Competencia.md` e ADR-008.

O parâmetro `tipo` é o mecanismo central que conecta páginas, endpoints e o `ExpenseBox`:

| tipo | Categoria | Endpoint da API | Página |
|---|---|---|---|
| 1 | Contas | `GET /financas/contas` | `/Contas` |
| 2 | Investimentos | `GET /financas/investimentos` | `/Investments` |
| 3 | Opcionais | `GET /financas/opcionais` | `/Optional` |
| 4 | Metas | `GET /financas/metas` | `/metas` |

> **`src/utils/financeTypes.js` é a fonte única de "tipo → tela".** `FINANCE_TYPES`
> tem `{ tipo, label, labelSingular, route, color }` dos quatro baldes, e
> `financeTypeOf(tipo)` busca um. Consomem: o `BUDGET` do Dashboard (que mantém
> local só `pct`/`kind`, que são regra de orçamento) e o `FinanceTabs`. **Rota ou
> cor nova de bucket muda aqui, não em cada tela.** Os `TIPO_OPTIONS` dos modais
> (`ExpenseBox`, `QuickAddModal`, `ImportarExtrato`) ainda são listas próprias —
> dá para derivá-los de `labelSingular`, mas não foram migrados.

---

## Camada de Dados

### `src/services/api.js`
Instância Axios com `baseURL: http://localhost:8000/api` e interceptor de token.

> **Dev:** o backend (container `financial_api`) sobe na **8000** e o CORS libera
> **só** `http://localhost:5173` (`CORS_ORIGIN` no `.env` do backend). Se o Vite
> subir em outra porta (5174 quando a 5173 já está ocupada), toda chamada falha
> como **"Network Error"** no axios — é o CORS barrando, não o backend fora do ar.

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
| `MENSAL` | `dia_vencimento`, `data_inicio`, `data_fim` | Todo mês no dia, do mês inicial até o **mês final (editável)** — padrão dezembro. Sem `fimAno`, o fim fica **no ano do início**; passando `fimAno` (só a tela de Metas faz), pode atravessar o ano |
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
- **Filtros:** Ano (input) + Mês (Select) + **Status** (Todas / Pagas / Pendentes) + **Tag** (Todas as tags / uma tag) + **Busca** (texto). Default: mês e ano atuais.
- **Busca:** **escondida atrás de uma 🔍** (`SearchToggle`, ao lado do "Mês Atual") — o campo só aparece ao clicar, **expandindo da lupa para o lado** (animação de `width`/`padding`/`opacity`, ~0.28s) até o fim da barra de filtros; não ocupa mais uma barra de largura cheia. Lupa e campo ficam no `SearchArea`, que já come a sobra da linha com a busca fechada — abrir não empurra nada. O `SearchInput` **fica sempre montado** (prop `$open`), senão a saída não animaria; fechado sai da ordem de tabulação. **Fechar limpa o termo** (Esc no campo também fecha): um filtro ativo invisível faria a tabela mentir, mostrando uma lista curta sem nada na tela explicando por quê. Aberta, a 🔍 fica com a borda de marca.
- Campo de texto incremental, **último elo da cadeia de filtros** — roda sobre `filteredAccounts` (período/status/tag) produzindo `visibleAccounts`, então nunca traz lançamento de outro mês. Casa por **nome do lançamento e nome das tags**, insensível a caixa e acento (`src/utils/search.js`: `normalizeText` + `matchesSearch`, compartilhado com Metas e ImportarExtrato). **Não altera o total** — `totalPayable` continua somando `filteredAccounts`, e a `TotalBar` avisa isso quando há busca ativa (decisão de produto; não "conserte"). Digitar reseta a paginação para a página 1.
- **Tags:** chips coloridos na coluna Nome; no modal, um `TagPicker` seleciona/cria/exclui tags (ver seção *Tags*).
- **Paginação:** itens por página **dinâmicos** — calculados pela altura disponível da tabela via `ResizeObserver` no `TableWrapper` (a tabela ocupa a altura da tela e enche de linhas). O contador entre "Anterior" e "Próxima" é o **`PageDots`** (`src/components/PageDots`): bolinhas horizontais, a atual acesa por um brilho radial roxo. São `<input type="radio">` de verdade (grupo com `name` de `useId()`) — ganham navegação por ← → e leitura de tela de graça. O brilho **não é repintado, é deslocado**: fica sempre no `background-image` e some empurrado 16px (o tamanho do dot) para fora do círculo, com `:checked ~ input` mandando os posteriores para o lado oposto — mexer no tamanho do dot exige mexer no deslocamento junto. As regras usam `&&` (especificidade dobrada) porque o `globalStyles` estiliza `input`/`input:focus` e o anel do foco global desenharia um retângulo sobre a bolinha. Acima de **7 páginas** vira janela deslizante (pontas em `scale(.6)`) e só então aparece o contador `6 / 12`.
- **Tabela:** Nome | Valor (`R$ 1.234,56`) | Parcela (índice/total da ocorrência) | Status (verde "Paga" / vermelho "Pendente") | Ações. Layout de altura cheia (`flex` do `.frame` até o corpo) com cabeçalho fixo (`sticky`); scroll no `TableWrapper`.
- **Ações:** Editar (✏️ → abre modal pré-preenchido: nome, valor e recorrência/período), Deletar com confirmação, Toggle de pagamento com confirmação
- **Modal (add/edição):** Overlay com Nome, Valor (máscara BRL) e Recorrência (Única/Mensal/Anual + campos condicionais) — mesmo modal para criar e editar. **Renderizado no `<body>` via `ModalPortal`** (`src/components/ModalPortal`, `createPortal`): o `Container` tem `backdrop-filter`, o que cria stacking context e prendia o overlay dentro do card — o `z-index: 1000` valia só ali e o `:hover` do botão "Voltar" (`transform: scale`) passava por cima do modal. Modal novo dentro de uma superfície de vidro deve usar o portal
- **Botão de filtro:** "Mês Atual" (ou "Data Atual" se o ano do filtro difere do sistema) restaura mês+ano correntes

**Lógica de filtro por período:**
- Contas com `recorrencia`: `isActiveInPeriod`/`occurrenceLabel` de `src/utils/recurrence.js`
- Legado (sem `recorrencia`): janela de meses consecutivos por `creationMonth` + `durationMonths`
- Sem filtro: mostra todos

---

## `FinanceTabs` (`src/components/FinanceTabs`)

Barra de abas das quatro seções de finança, na linha do título de `/Contas`,
`/Investments`, `/Optional` e `/metas`. Sem props — a aba ativa vem da URL, para
que nenhuma tela possa se declarar a seção errada. Os rótulos, rotas e cores vêm
de `FINANCE_TYPES` (ver *Tipo: Mapeamento Central*).

- **Usa `NavLink`, não `Link`** — é o **primeiro do projeto** (o `Nav` lateral usa
  `Link` e não destaca item ativo). O `NavLink` aplica sozinho a classe `.active`
  e `aria-current="page"`.
- **Não passe `caseSensitive`.** O default `false` faz o `NavLink` comparar os dois
  lados em minúsculo, e é só por isso que o destaque funciona com as rotas de
  caixa mista (`/Contas` maiúscula, `/metas` minúscula). Ligar a flag apagaria o
  destaque em metade das telas. Ver `../Vault/05-Decisoes/ADR-006-Caixa-das-rotas.md`.
- **Importar Extrato fica de fora** de propósito: é uma ação, não um tipo. Só o
  hub `/Financas` leva a `/importar`.
- **O ponto colorido é reforço, não informação** — o rótulo carrega o significado,
  então nada se perde em daltonismo. Mesma paleta categórica dos medidores.
- **Layout:** a classe global `.pageHead` põe título e abas na mesma linha; abaixo
  de ~600px as abas quebram para a linha seguinte (`flex-wrap`, sem scroll
  horizontal — scroll esconderia destino).
- **O período NÃO acompanha a troca de aba:** cada tela abre no mês atual. Levar o
  filtro na URL é trabalho em aberto.

---

## Dashboard (`src/pages/Home`)

Tela inicial (`/`) — resumo financeiro do mês selecionado. Filtro de Mês/Ano local (default: atual); a divisão-alvo do salário é **60% Contas · 20% Investimentos · 10% Opcionais · 10% Metas**.

- **Dados:** `useAccounts(1..4)` (busca cada tipo **uma vez**, sem filtro; a soma por período é client-side via `sumActiveInPeriod`) + `financeService.fetchSalary()`.
- **Config `BUDGET`:** cada bucket tem `pct`, `kind` e `route` — `teto` (Contas, Opcionais: não pode passar → vermelho quando excede) vs `meta` (Investimentos, Metas: alvo a alcançar → verde ao atingir). `route` é a tela da finança correspondente.
- **Atalho 👁:** um `EyeLink` para `b.route` (Contas/Investments/Optional/metas) nos medidores **e** na legenda do donut. Na legenda ele fecha a linha, como **5ª coluna** do grid — o `LegendHeadRow` tem uma célula vazia para não desalinhar. No medidor ele fica no **cabeçalho**, ao lado do valor gasto, dentro de `MeterHeadRight` (sem esse agrupamento o `space-between` do `MeterHead` jogaria o valor para o centro). Abaixo de 460px o "Plano" some, mas o olho fica.
- **Seções:** KPIs (salário, comprometido, saldo livre, % de contas) → **Quitação do mês** (ver abaixo) → **medidores** por bucket (gasto × limite, forma "razão vs. limite") → **donut** SVG da distribuição real + legenda Real × Plano → **Gastos por tag** (ver abaixo).
- **Quitação do mês:** a **única** seção que olha o *status de pagamento* (o resto soma o comprometido, pago ou não). Usa `isPaidInPeriod` — a mesma função do `ExpenseBox`; se as duas telas divergirem, alguém reimplementou a regra. Card de dois painéis: barra empilhada **pago · atrasado · a vencer** (com legenda e valores) + lista **Próximos vencimentos** (pendentes do mês por `diaVencimento`, 6 itens + "+N"). Inclui os 4 tipos — numa meta, "pago" é "aporte registrado". **Atraso = data de vencimento < hoje** (comparação com a data real, sem caso especial por mês); `diaVencimento` sofre `Math.min(dia, últimoDiaDoMês)` (vencimento 31 em fevereiro rolaria para março); **sem dia de vencimento nunca é atraso** (legado/importação → badge "Sem data" no fim da lista). "A vencer" usa um neutro, não `STATUS` nem cor de bucket: ainda não pagar não é bom nem ruim.
- **Gastos por tag:** ranking horizontal do valor comprometido por tag no mês, somando **todos os tipos** (usa `accountActiveInPeriod` + `account.tags`). Como a tag é do lançamento e um lançamento pode ter **várias**, o valor conta em cada tag (a soma pode passar do comprometido — avisado no subtítulo). Lançamentos sem tag caem no bucket neutro **"Sem tag"**; barras escaladas pela maior fatia. Cores vêm da própria tag; sem lançamentos com tag no mês → estado vazio com link p/ Finanças.
- **Layout:** grid de duas colunas (`InsightGrid`) com medidores + distribuição lado a lado; colapsa em 1 coluna abaixo de 1024px.
- **Ação rápida (⚡):** botão `QuickAddButton` no header abre o `QuickAddModal` (`src/components/QuickAddModal`) — cria um lançamento (mesmo form de recorrência/tags do `ExpenseBox`, cujos styled components são reusados) sem sair do Dashboard. Ao salvar, `onCreated(tipo)` chama `fetchAccounts()` do hook daquele tipo para atualizar o resumo na hora.
- **Paleta categórica** (validada p/ CVD/contraste na superfície roxa): Contas `#3987e5`, Investimentos `#199e70`, Opcionais `#c98500`, Metas `#d55181`. Cores de status são fixas e nunca reutilizadas como cor de série.
- **Estado vazio:** sem salário configurado → aviso com link p/ `/Settings` (medidores ficam sem limite; distribuição ainda funciona).
- **Carregando:** `loading` é o **ou** das cinco fontes (salário + os quatro `useAccounts`) — a tela só aparece com tudo pronto. Enquanto isso, o `Loader` (ver seção *Loader*) **sozinho, sem card nem texto**, centrado na sobra da tela pelo `LoaderArea` (`flex: 1` + `place-items: center`; o `min-height: 50vh` é para o mobile, onde o `Content` tem altura automática e não há sobra para esticar).

## Metas (`src/pages/Metas`)

Rota `/metas` (`tipo=4`) — o 4º bucket da divisão 60/20/10/10. Uma meta é um
**aporte recorrente** para um objetivo (ex.: R$ 500/mês por 12 meses), não um
boleto: a tela mostra cards de progresso, não a tabela do `ExpenseBox`.

**Alvo e progresso são DERIVADOS — não existem no banco.** Não houve migração: o
modelo `Lancamento` já tinha tudo o que era preciso.

| Conceito | Origem | Onde |
|---|---|---|
| Alvo | `value × occurrenceCount(account)` | `goalProgress` em `utils/recurrence.js` |
| Guardado | `value × aportes dentro da janela (`goalCompetencias`)` | idem |
| Aporte do mês | `togglePaymentStatus(id, competencia, pago)` | `useAccounts` (o mesmo toggle de "parcela paga") |
| Concluída | aportes pagos ≥ total | `goalProgress().concluida` |

- **`occurrenceCount(account)`** dá o total de ocorrências (UNICA/MENSAL/ANUAL;
  legado → `durationMonths`). Foi extraído de dentro do `occurrenceLabel`, que
  agora o consome — a regra de contagem vive num lugar só.
- **Registrar aporte = marcar a competência como paga.** Para uma meta, "parcela
  paga" lê-se "aporte feito"; por isso a página reusa `occurrenceCompetencia` +
  `isPaidInPeriod` (ver *Pagamento por competência*).
- **Filtro de mês ≠ filtro da lista.** O Ano/Mês do topo só define **de qual
  competência é o aporte**; a lista mostra todas as metas sempre (uma meta
  atravessa meses e sumiria da tela se filtrada por período). Com "Todos os
  meses" a competência de uma MENSAL é ambígua → o botão de aporte fica
  desabilitado, mesma regra do `ExpenseBox`.
- **Só conta aporte DENTRO da janela.** `goalCompetencias(account)` lista as
  competências que a meta cobre, e `goalProgress` conta apenas os `pagamentos`
  que caem nelas. Sem isso, mover o início de uma meta de julho para setembro
  deixaria o aporte de julho órfão **contando como progresso para sempre** (bug
  real, encontrado em uso).
- **O botão de aporte segue a meta, não o filtro.** `competenciaDoAporte` usa o
  mês do filtro **se** ele fizer parte da meta; senão, cai em
  `nextPendingCompetencia` — o primeiro mês da janela ainda não aportado. Mover
  o início para setembro passa a oferecer "Registrar aporte de Setembro/2026",
  em vez de bloquear o botão dizendo que o mês do filtro está fora. Por isso o
  rótulo traz **mês/ano**: a meta atravessa anos e "Janeiro" seria ambíguo.
  Consequência: com "Todos os meses" o botão continua funcionando (mira o
  próximo pendente) — a meta não tem a ambiguidade que trava o `ExpenseBox`.
- **Sem `pagamentos`** (backend legado): cai no `contaPaga` único → tudo ou nada.
- **Fim com ano + mês:** o modal escolhe ano E mês de término (`fimAno`), então uma
  meta atravessa o ano — ao contrário das despesas, cujo fim é sempre no ano do
  início. `formOccurrenceCount` (contraparte de `occurrenceCount` para os campos
  do formulário) calcula as ocorrências e alimenta o `qtd_parcelas` do payload.
  `fimAno` é **opcional** em `validateRecurrence`/`buildRecurrencePayload`: sem ele
  o comportamento é o antigo, e `ExpenseBox`/`QuickAddModal` seguem intocados.
- **Sem tags:** o modal de meta não tem `TagPicker` (decisão de produto). Como
  `tag_ids` tem default `[]` no backend e o update **substitui** o conjunto,
  omitir o campo deixa a meta sem tags — o que é o esperado aqui.
- Metas continuam **não criáveis** pelo `ExpenseBox`/`QuickAddModal` (`TIPO_OPTIONS`
  exclui o 4) — criar meta é ação da própria página.
- **Cor:** `#d55181`, a mesma da série Metas no `BUDGET` do Dashboard. A barra fica
  verde (`#3ddc84`) só quando concluída.

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

## Card dos hubs (`src/components/Card`)

Card de Finanças (Contas, Investimentos, Opcionais, Importar Extrato) e Configurações (Perfil, Dados, Alterar Senha, Sair).

```jsx
<Cards name="Contas" subtitle="Despesas fixas do mês" hint="60% do plano" svgContent={<svg …/>} />
```

**Em repouso mostra só o ícone.** No hover o ícone cresce (30% → 65%), borra (`blur(7px)`) e flutua enquanto o texto aparece por cima; o card escala 1.04 com rotação de -1°. `subtitle`/`hint` são opcionais (`hint` é a linha em destaque, `--Complementar`).

- **O texto só existe no hover — daí duas saídas:** `a:focus-visible &` para teclado (a regra sobe um nível porque o card **não** é focável; quem recebe foco é o `<Link>`/`<div>` ancestral, então `:focus-within` não serviria), e `@media (hover: none)` para toque, onde o card volta ao layout empilhado com ícone e texto visíveis — senão no celular seriam ícones mudos.
- **`overflow: hidden` é obrigatório:** o ícone cresce e borra; sem ele o borrão vaza pelas bordas arredondadas.
- **O CSS vence o `width`/`height` do `<svg>`** (os ícones chegam com tamanho fixo) — é isso que os deixa crescer; `width: auto` preserva a proporção.
- **A prop `variant="preencherFill"` não existe mais:** ela escurecia o ícone no hover do desenho antigo. Se aparecer numa chamada, é resquício.
- Do design original ficou só a estrutura; cores e tipografia são as do sistema. Os percentuais (60/20/10) são **texto escrito à mão**, não derivados de `BUDGET`.

## Loader (`src/components/Loader`)

Indicador de carregamento **único do sistema** — quatro bolas pulsando em onda, na cor `--Complementar`. Nenhuma tela deve escrever "Carregando…" solto de novo.

```jsx
<Loader />                          // só as bolas
<Loader label="Lendo arquivo…" />   // texto opcional, abaixo delas
```

| Tela | Onde | Rótulo |
|---|---|---|
| Dashboard | `LoaderArea`, centrado na sobra da tela | — |
| `ExpenseBox` (Contas/Investimentos/Opcionais) | `LoaderArea`, centrado no card | — |
| Metas | `Loading`, no lugar da lista | — |
| Importar Extrato | dentro da `DropZone` | "Lendo arquivo…" |

- **O loader é ADIADO e tem permanência mínima (`src/hooks/useDeferredLoading.js`):** `const showLoader = useDeferredLoading(loading)` — **500ms de carência** antes de aparecer e **600ms mínimos** na tela depois de aparecer. Trocar de aba nas finanças resolve dentro da carência; e a permanência existe porque só a carência não bastava: um carregamento pouco acima dela mostrava o loader por dois ou três frames — a espera sumia, o **lampejo** não. Assim a percepção vira binária: ou não aparece, ou fica tempo de ser lido como intencional. Durante a carência a moldura (card/área) continua em pé, só sem conteúdo; o loader entra com fade (`softEnter`, 0.35s). **Ao mexer no hook:** o ramo de `loading` sai cedo se o loader já está visível — reagendar ali reescreveria o instante de entrada e esticaria a permanência a cada render.
- **A chegada dos dados é animada:** `contentEnter` (`src/styles/animations.js`) — 0.24s de fade + 6px de subida. Aplique **condicional** (`${(p) => p.$ready && contentEnter}`) quando o elemento existe nos dois estados: é a troca de classe que dispara a animação; fixa, ela rodaria só no mount. Em elementos que só existem carregados (a grade de Metas) pode ser fixa. O Dashboard ganhou um `Ready` envolvendo as seções só para isso — ele **repete o `gap` do `Content`**, porque as seções deixaram de ser filhas diretas dele.
- **`label` é opcional e existe por acessibilidade:** com ele, o texto visível é o que o leitor de tela anuncia (`role="status"` + `aria-live`, bolas em `aria-hidden`); sem ele, o wrapper cai num `aria-label="Carregando"` próprio — **o anúncio nunca some, mesmo sem texto na tela**. Passar os dois duplica.
- **A onda é feita de atrasos, não de keyframes diferentes:** 0.3s entre bolas; o anel sai 0.9s depois da **sua** bola (acompanha o encolhimento, não o crescimento). Mexer num delay isolado desmonta a onda.
- **`prefers-reduced-motion`** desliga a animação e deixa as bolas paradas em opacidade decrescente.
- **Centrar é de quem usa:** o componente não se posiciona — cada tela envolve num wrapper com `place-items: center` e alguma altura, porque a sobra disponível é diferente em cada uma.
- **Botões de submit ficam de fora de propósito** ("Salvando…", "Entrando…", "Importando…"): o botão já fica `disabled` e o verbo diz **o que** está acontecendo, coisa que quatro bolas não dizem — além de a troca mudar a largura do botão no meio do clique.

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
- `.pageHead` — Título + `FinanceTabs` na mesma linha (`space-between`, com wrap). Existe para as abas não custarem altura: como bloco à parte, o `gap: 4rem` do `.containerExpenses` as afastaria do título e empurraria a tabela para baixo
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

> Lista completa e priorizada em `../Vault/07-Limites/Pendencias.md`.

| Item | Detalhe |
|---|---|
| Social login placeholder | Botões Google/Apple/Microsoft na tela de login são não-funcionais |
| `baseURL` hardcoded | `src/services/api.js` aponta para `http://localhost:8000/api` no código — sem `VITE_API_URL`. Impede deploy sem editar código |
| Perfil sem validação de e-mail duplicado | `PUT /security/profile` confia na constraint → e-mail já existente estoura `IntegrityError` (500) em vez de 400 |
| Modais de Perfil/Salário abrem vazios | Em `/Settings`, não carregam salário/perfil atuais — o usuário não vê o que está configurado |

**Resolvidos:** logout limpa o token; Perfil virou modal (hoje em `/Settings`) com submit real; **os endpoints de salário (`POST /financas/salary`) e perfil (`PUT /security/profile`) existem e estão implementados** — a antiga pendência de "confirmar backend" está encerrada.
