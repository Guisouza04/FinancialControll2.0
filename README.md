# FinancialControl 2.0

Aplicação web de controle financeiro pessoal. Permite gerenciar contas, investimentos e gastos opcionais com filtros por período, controle de parcelas e status de pagamento.

> **Este repositório contém apenas o frontend.** O backend (API REST) deve estar rodando separadamente em `http://localhost:4000/api`.

## Tecnologias

- React 19 + Vite 7
- React Router DOM 7
- Styled Components
- Axios

## Pré-requisitos

- Node.js instalado
- Backend da aplicação rodando em `http://localhost:4000`

## Instalação e execução

```bash
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`.

## Outros comandos

```bash
npm run build    # Build de produção
npm run preview  # Visualizar o build de produção localmente
npm run lint     # Verificar erros de lint
```

## Funcionalidades

- **Autenticação** — Login e cadastro com JWT armazenado no localStorage
- **Contas** — Gerenciamento de contas a pagar com controle de parcelas
- **Investimentos** — Acompanhamento de investimentos
- **Opcionais** — Controle de gastos opcionais
- **Filtros** — Filtrar despesas por mês e ano
- **Status de pagamento** — Marcar despesas como pagas ou pendentes

## Estrutura

```
src/
├── components/   # Componentes reutilizáveis (ExpenseBox, Nav, Card, etc.)
├── hooks/        # useAccounts — hook central de CRUD financeiro
├── pages/        # Telas da aplicação
├── services/     # Axios (api.js) e chamadas à API (financeService.js)
└── styles/       # Estilos globais e variáveis CSS
```
