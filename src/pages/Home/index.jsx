import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import Select from "../../components/Select";
import QuickAddModal from "../../components/QuickAddModal";
import Loader from "../../components/Loader";
import { useAccounts } from "../../hooks/useAccounts";
import { useDeferredLoading } from "../../hooks/useDeferredLoading";
import financeService from "../../services/financeService";
import {
  sumActiveInPeriod,
  occurrenceValue,
  accountActiveInPeriod,
  isPaidInPeriod,
} from "../../utils/recurrence";
import { formatBRL } from "../../utils/currency";
import { FINANCE_TYPES } from "../../utils/financeTypes";
import {
  Content,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  Filters,
  MonthSelect,
  YearSelect,
  MonthNavButton,
  QuickAddButton,
  SectionTitle,
  KpiGrid,
  KpiCard,
  KpiLabel,
  KpiValue,
  KpiHint,
  MetersCard,
  Meter,
  MeterHead,
  MeterName,
  MeterHeadRight,
  Dot,
  MeterValues,
  MeterTrack,
  MeterFill,
  MeterFoot,
  StatusPill,
  MeterHint,
  MeterFootRight,
  EyeLink,
  InsightGrid,
  InsightCol,
  DistribCard,
  DonutWrap,
  DonutCenter,
  Legend,
  LegendHeadRow,
  LegendRow,
  TagRankCard,
  TagRow,
  TagName,
  TagValue,
  SettleCard,
  SettlePane,
  SettleHead,
  StackTrack,
  StackSeg,
  SettleLegend,
  SettleLegendRow,
  PaneTitle,
  DueList,
  DueHeadRow,
  DueRow,
  DueDay,
  DueName,
  DueRight,
  DueBadge,
  DueFoot,
  EmptyState,
  LoaderArea,
  Ready,
  InlineNotice,
} from "./styles";

// Cor neutra do bucket "Sem tag" (nunca colide com a cor de uma tag real).
const UNTAGGED_COLOR = "#7a7a85";

// "A vencer" não é bom nem ruim — é o estado normal de quem ainda não pagou.
// Por isso um neutro, e não uma cor de STATUS (que leria como julgamento) nem a
// cor de um bucket (que leria como categoria).
const UPCOMING_COLOR = "rgba(255, 255, 255, 0.28)";

// Quantos vencimentos a lista mostra antes de resumir o resto em "+N".
const DUE_LIST_LIMIT = 6;

// Divisão-alvo do salário. Só o que é REGRA DE ORÇAMENTO mora aqui: `pct` e
// `kind` — este distingue TETO (não pode passar) de META (você quer alcançar),
// o que muda a leitura do medidor.
//   contas       → teto de 60%
//   investimentos→ meta de 20%
//   opcionais    → teto de 10%
//   metas        → meta de 10%
// Rótulo, cor e rota vêm de FINANCE_TYPES — são identidade do tipo, não do
// orçamento, e são compartilhados com o FinanceTabs. `route` alimenta o atalho
// do 👁 nas duas seções (medidores e legenda), já que `buckets` faz spread
// destes objetos.
const PLANO = { 1: { pct: 60, kind: "teto" }, 2: { pct: 20, kind: "meta" },
                3: { pct: 10, kind: "teto" }, 4: { pct: 10, kind: "meta" } };

const BUDGET = FINANCE_TYPES.map((t) => ({
  tipo: t.tipo,
  label: t.label,
  color: t.color,
  route: t.route,
  ...PLANO[t.tipo],
}));

// Atalho "ver na tela da finança". SVG inline no padrão do projeto (não há
// biblioteca de ícones) — `currentColor` para o hover do link pintar o traço.
const EyeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Cores de status (paleta fixa — nunca reutilizadas como cor de série).
const STATUS = {
  good: "#3ddc84",
  warning: "#fab219",
  critical: "#ff6b6b",
};

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Dashboard() {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));

  const [salary, setSalary] = useState(null);
  const [salaryLoading, setSalaryLoading] = useState(true);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Busca todos os lançamentos de cada tipo uma vez; a filtragem por período é
  // feita no cliente (os dados independem do mês, então trocar o filtro não
  // dispara novas requisições).
  const contas = useAccounts(1);
  const investimentos = useAccounts(2);
  const opcionais = useAccounts(3);
  const metas = useAccounts(4);

  const accountsByTipo = useMemo(
    () => ({
      1: contas.accounts,
      2: investimentos.accounts,
      3: opcionais.accounts,
      4: metas.accounts,
    }),
    [contas.accounts, investimentos.accounts, opcionais.accounts, metas.accounts]
  );

  useEffect(() => {
    let mounted = true;
    financeService
      .fetchSalary()
      .then((data) => {
        if (mounted) setSalary(data.salario);
      })
      .catch((err) => console.error("Erro ao buscar salário:", err))
      .finally(() => {
        if (mounted) setSalaryLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const loading =
    salaryLoading ||
    contas.loading ||
    investimentos.loading ||
    opcionais.loading ||
    metas.loading;

  // Loader só depois do limiar — ver useDeferredLoading.
  const showLoader = useDeferredLoading(loading);

  // Cálculo por bucket (gasto no período, limite e razão vs. limite).
  const buckets = useMemo(
    () =>
      BUDGET.map((b) => {
        const spent = sumActiveInPeriod(accountsByTipo[b.tipo], year, month);
        const limit = salary != null ? (salary * b.pct) / 100 : null;
        const ratio = limit && limit > 0 ? spent / limit : null;
        return { ...b, spent, limit, ratio };
      }),
    [accountsByTipo, year, month, salary]
  );

  const totalSpent = buckets.reduce((s, b) => s + b.spent, 0);
  const free = salary != null ? salary - totalSpent : null;
  const committedPct = salary && salary > 0 ? (totalSpent / salary) * 100 : null;
  const contasBucket = buckets[0];

  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const y = String(now.getFullYear() + 5 - i);
    return { value: y, label: y };
  });
  const monthOptions = MONTH_NAMES.map((name, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: name,
  }));

  const goCurrentMonth = () => {
    setYear(String(now.getFullYear()));
    setMonth(String(now.getMonth() + 1).padStart(2, "0"));
  };

  // Após criar um lançamento pela ação rápida (⚡), recarrega os dados do tipo
  // criado para o resumo/medidores/tags refletirem na hora.
  const handleQuickCreated = (tipo) => {
    const hooks = { 1: contas, 2: investimentos, 3: opcionais, 4: metas };
    hooks[tipo]?.fetchAccounts();
  };

  // Navegação de período: avança/retrocede um mês, virando o ano quando passa
  // de dez/jan. Limitada à janela do seletor de ano (currentYear-5 .. +5),
  // mesmo padrão do filtro de Finanças.
  const minPeriodIdx = (now.getFullYear() - 5) * 12; // jan do ano mínimo
  const maxPeriodIdx = (now.getFullYear() + 5) * 12 + 11; // dez do ano máximo
  const currentPeriodIdx =
    parseInt(year, 10) * 12 + (parseInt(month, 10) - 1);
  const canGoPrev = currentPeriodIdx > minPeriodIdx;
  const canGoNext = currentPeriodIdx < maxPeriodIdx;

  const shiftPeriod = (delta) => {
    const target = currentPeriodIdx + delta;
    if (target < minPeriodIdx || target > maxPeriodIdx) return;
    setYear(String(Math.floor(target / 12)));
    setMonth(String((target % 12) + 1).padStart(2, "0"));
  };

  const periodLabel = `${MONTH_NAMES[parseInt(month, 10) - 1]} / ${year}`;
  const noSalary = !salaryLoading && salary == null;

  // ---- Medidor: status conforme teto (não passar) x meta (alcançar) ----
  const meterStatus = (b) => {
    if (b.limit == null) return { color: b.color, label: "", fillColor: b.color };
    const r = b.ratio ?? 0;
    if (b.kind === "teto") {
      if (r > 1)
        return {
          color: STATUS.critical,
          fillColor: STATUS.critical,
          label: `⚠ Acima do limite (+${formatBRL(b.spent - b.limit)})`,
        };
      if (r >= 0.9)
        return {
          color: STATUS.warning,
          fillColor: STATUS.warning,
          label: "Perto do limite",
        };
      return {
        color: "var(--text-muted)",
        fillColor: b.color,
        label: `Dentro do limite · falta ${formatBRL(b.limit - b.spent)}`,
      };
    }
    // meta
    if (r >= 1)
      return {
        color: STATUS.good,
        fillColor: STATUS.good,
        label: "✓ Meta atingida",
      };
    return {
      color: "var(--text-muted)",
      fillColor: b.color,
      label: `Faltam ${formatBRL(b.limit - b.spent)} para a meta`,
    };
  };

  // ---------- Donut (distribuição real do mês) ----------
  const donut = useMemo(() => {
    const R = 80;
    const C = 2 * Math.PI * R;
    const GAP = 4; // folga entre fatias (unidades de path)
    let acc = 0;
    const segments = buckets
      .filter((b) => b.spent > 0)
      .map((b) => {
        const frac = totalSpent > 0 ? b.spent / totalSpent : 0;
        const segLen = Math.max(frac * C - GAP, 0.001);
        const startLen = acc * C;
        acc += frac;
        return {
          tipo: b.tipo,
          color: b.color,
          label: b.label,
          spent: b.spent,
          pct: frac * 100,
          dasharray: `${segLen} ${C - segLen}`,
          dashoffset: -startLen,
        };
      });
    return { R, C, segments };
  }, [buckets, totalSpent]);

  // ---------- Quitação do mês (pago × pendente + vencimentos) ----------
  // A única seção da tela que olha o STATUS de pagamento — o resto soma o
  // comprometido, pago ou não. Fonte: `isPaidInPeriod` (competência da parcela),
  // a mesma que o ExpenseBox usa para pintar "Paga"/"Pendente"; se as duas telas
  // divergirem, alguém reimplementou a regra. Ver Competencia-e-Pagamento.
  //
  // Inclui os QUATRO tipos, metas junto: o "comprometido" dos KPIs também as
  // inclui, e um aporte não feito é dinheiro que ainda precisa sair. Numa meta,
  // "pago" lê-se "aporte registrado".
  const settlement = useMemo(() => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    // Dia 0 do mês seguinte = último dia deste mês. Vencimento 31 em fevereiro
    // precisa virar 28/29 — sem o clamp, o Date rolaria para março e a conta
    // apareceria como "a vencer" num mês que já acabou.
    const lastDay = new Date(y, m, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let paid = 0;
    let upcoming = 0;
    let overdue = 0;
    let paidCount = 0;
    let count = 0;
    const pending = [];

    // Percorre por BUDGET (e não pelos hooks direto) para cada linha já sair com
    // a cor e o rótulo do seu bucket.
    for (const b of BUDGET) {
      for (const acc of accountsByTipo[b.tipo] || []) {
        if (!accountActiveInPeriod(acc, year, month)) continue;
        const value = occurrenceValue(acc, year, month);
        count += 1;

        if (isPaidInPeriod(acc, year, month)) {
          paid += value;
          paidCount += 1;
          continue;
        }

        // Legado e importações não têm dia de vencimento. Sem data não há como
        // afirmar atraso — a linha aparece no fim da lista, sem badge de alarme.
        const day = acc.diaVencimento
          ? Math.min(acc.diaVencimento, lastDay)
          : null;
        const due = day ? new Date(y, m - 1, day) : null;
        const late = due != null && due < today;

        if (late) overdue += value;
        else upcoming += value;

        pending.push({
          key: `${acc.tipo}-${acc.id}`,
          name: acc.name,
          value,
          day,
          late,
          // Arredondado: o horário de verão faz a diferença dar 0,96 dia.
          daysLeft: due ? Math.round((due - today) / 86400000) : null,
          color: b.color,
          label: b.label,
        });
      }
    }

    // Ordena por dia — dentro de um mesmo mês, dia menor já é o mais urgente,
    // então os atrasados sobem sozinhos. Sem dia vai para o fim.
    pending.sort((a, c) => (a.day ?? 99) - (c.day ?? 99) || c.value - a.value);

    return {
      paid,
      upcoming,
      overdue,
      paidCount,
      count,
      total: paid + upcoming + overdue,
      pending,
    };
  }, [accountsByTipo, year, month]);

  // Etiqueta de urgência da linha. Só existe quando acrescenta algo: "dia 22"
  // já está na coluna da esquerda, então um vencimento distante não ganha badge.
  const dueBadge = (item) => {
    if (item.late)
      return { text: "Atrasado", color: STATUS.critical, bg: "rgba(255, 107, 107, 0.15)" };
    if (item.daysLeft === 0)
      return { text: "Vence hoje", color: STATUS.warning, bg: "rgba(250, 178, 25, 0.15)" };
    if (item.day == null)
      return { text: "Sem data", color: "var(--text-muted)", bg: "rgba(255, 255, 255, 0.07)" };
    if (item.daysLeft > 0 && item.daysLeft <= 7)
      return {
        text: `em ${item.daysLeft} ${item.daysLeft === 1 ? "dia" : "dias"}`,
        color: "var(--text-secondary)",
        bg: "rgba(255, 255, 255, 0.07)",
      };
    return null;
  };

  // ---------- Gastos por tag (mês selecionado) ----------
  // Agrega o valor dos lançamentos ativos no período por tag, somando todos os
  // tipos. Como uma tag é do lançamento (não da parcela) e um lançamento pode
  // ter VÁRIAS tags, o valor conta em cada tag associada — por isso a soma das
  // fatias pode passar do comprometido (indicado no subtítulo da seção).
  const tagSpending = useMemo(() => {
    const all = [
      ...accountsByTipo[1],
      ...accountsByTipo[2],
      ...accountsByTipo[3],
      ...accountsByTipo[4],
    ].filter((a) => accountActiveInPeriod(a, year, month));

    const map = new Map(); // id -> { id, nome, cor, total }
    let untagged = 0;
    for (const acc of all) {
      const value = occurrenceValue(acc, year, month);
      const tags = Array.isArray(acc.tags) ? acc.tags : [];
      if (tags.length === 0) {
        untagged += value;
        continue;
      }
      for (const t of tags) {
        const entry =
          map.get(t.id) || { id: t.id, nome: t.nome, cor: t.cor, total: 0 };
        entry.total += value;
        map.set(t.id, entry);
      }
    }
    const rows = Array.from(map.values())
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
    // Escala das barras: maior fatia (incluindo "Sem tag") = 100%.
    const maxTotal = Math.max(untagged, ...rows.map((r) => r.total), 0);
    return { rows, untagged, maxTotal, hasAny: rows.length > 0 || untagged > 0 };
  }, [accountsByTipo, year, month]);

  return (
    <div className="frame">
      <MenuNavecacao />
      <Content>
        <Header>
          <div>
            <HeaderTitle>Dashboard</HeaderTitle>
            <HeaderSubtitle>
              Resumo das suas finanças · {periodLabel}
            </HeaderSubtitle>
          </div>
          <Filters>
            <MonthSelect>
              <Select value={month} onChange={setMonth} options={monthOptions} />
            </MonthSelect>
            <YearSelect>
              <Select value={year} onChange={setYear} options={yearOptions} />
            </YearSelect>
            <MonthNavButton
              type="button"
              onClick={() => shiftPeriod(-1)}
              disabled={!canGoPrev}
              aria-label="Mês anterior"
              title="Mês anterior"
            >
              ‹
            </MonthNavButton>
            <MonthNavButton
              type="button"
              onClick={() => shiftPeriod(1)}
              disabled={!canGoNext}
              aria-label="Próximo mês"
              title="Próximo mês"
            >
              ›
            </MonthNavButton>
            <button className="button2" onClick={goCurrentMonth}>
              Mês Atual
            </button>
            <QuickAddButton
              type="button"
              onClick={() => setQuickAddOpen(true)}
              title="Criar lançamento rápido"
            >
              <span className="bolt" aria-hidden="true">
                ⚡
              </span>
              <span className="label">Adicionar</span>
            </QuickAddButton>
          </Filters>
        </Header>

        {quickAddOpen && (
          <QuickAddModal
            onClose={() => setQuickAddOpen(false)}
            onCreated={handleQuickCreated}
          />
        )}

        {loading ? (
          /* Vazio até o limiar — o loader entrando e saindo em poucos frames é
             o que fazia a tela piscar. Ver useDeferredLoading. */
          <LoaderArea>{showLoader && <Loader />}</LoaderArea>
        ) : (
          <Ready>
            {noSalary && (
              <InlineNotice>
                <span>💡</span>
                <span>
                  Configure seu salário para ver a divisão 60/20/10/10 com
                  limites.
                </span>
                <Link to="/Settings">Definir salário</Link>
              </InlineNotice>
            )}

            {/* -------- KPIs -------- */}
            <KpiGrid>
              <KpiCard $accent="var(--RoxoClaro)">
                <KpiLabel>Salário</KpiLabel>
                <KpiValue>
                  {salary != null ? formatBRL(salary) : "—"}
                </KpiValue>
                <KpiHint>
                  {salary != null ? "Base da divisão" : "Não configurado"}
                </KpiHint>
              </KpiCard>

              <KpiCard $accent={STATUS.warning}>
                <KpiLabel>Comprometido no mês</KpiLabel>
                <KpiValue>{formatBRL(totalSpent)}</KpiValue>
                <KpiHint>
                  {committedPct != null
                    ? `${committedPct.toFixed(0)}% do salário`
                    : "Total de lançamentos"}
                </KpiHint>
              </KpiCard>

              <KpiCard $accent={free != null && free < 0 ? STATUS.critical : STATUS.good}>
                <KpiLabel>Saldo livre</KpiLabel>
                <KpiValue $color={free != null && free < 0 ? STATUS.critical : undefined}>
                  {free != null ? formatBRL(free) : "—"}
                </KpiValue>
                <KpiHint>
                  {free != null
                    ? free < 0
                      ? "Você passou do salário"
                      : "Ainda não alocado"
                    : "Depende do salário"}
                </KpiHint>
              </KpiCard>

              <KpiCard $accent={contasBucket.color}>
                <KpiLabel>Contas (teto 60%)</KpiLabel>
                <KpiValue
                  $color={
                    contasBucket.ratio != null && contasBucket.ratio > 1
                      ? STATUS.critical
                      : undefined
                  }
                >
                  {contasBucket.ratio != null
                    ? `${(contasBucket.ratio * 60).toFixed(0)}%`
                    : formatBRL(contasBucket.spent)}
                </KpiValue>
                <KpiHint>
                  {contasBucket.limit != null
                    ? `${formatBRL(contasBucket.spent)} de ${formatBRL(
                      contasBucket.limit
                    )}`
                    : "do salário"}
                </KpiHint>
              </KpiCard>
            </KpiGrid>

            {/* -------- Quitação do mês --------
                Fica logo depois dos KPIs de propósito: é a única seção
                acionável da tela ("o que eu preciso pagar"). O resto abaixo é
                leitura do plano. */}
            <div>
              <SectionTitle>
                Quitação do mês
                <small>
                  Quanto do comprometido já saiu do bolso e o que ainda vence —
                  aportes de metas contam como pagamento
                </small>
              </SectionTitle>
              {settlement.count > 0 ? (
                <SettleCard>
                  <SettlePane>
                    <SettleHead>
                      <div>
                        <span className="value">
                          {formatBRL(settlement.paid)}
                        </span>{" "}
                        <span className="of">
                          de {formatBRL(settlement.total)} quitados
                        </span>
                      </div>
                      <span className="count">
                        {settlement.paidCount} de {settlement.count} lançamentos
                      </span>
                    </SettleHead>

                    <StackTrack
                      role="img"
                      aria-label={`${formatBRL(settlement.paid)} pagos, ${formatBRL(
                        settlement.overdue
                      )} atrasados e ${formatBRL(settlement.upcoming)} a vencer`}
                    >
                      {[
                        { key: "paid", v: settlement.paid, color: STATUS.good, label: "Pago" },
                        { key: "overdue", v: settlement.overdue, color: STATUS.critical, label: "Atrasado" },
                        { key: "upcoming", v: settlement.upcoming, color: UPCOMING_COLOR, label: "A vencer" },
                      ]
                        .filter((s) => s.v > 0)
                        .map((s) => (
                          <StackSeg
                            key={s.key}
                            $pct={
                              settlement.total > 0
                                ? (s.v / settlement.total) * 100
                                : 0
                            }
                            $color={s.color}
                            title={`${s.label}: ${formatBRL(s.v)}`}
                          />
                        ))}
                    </StackTrack>

                    <SettleLegend>
                      <SettleLegendRow $color={STATUS.good}>
                        <span className="mark">✓</span>
                        <span className="label">Pago</span>
                        <span className="amount">
                          {formatBRL(settlement.paid)}
                        </span>
                      </SettleLegendRow>
                      {settlement.overdue > 0 && (
                        <SettleLegendRow $color={STATUS.critical}>
                          <span className="mark">⚠</span>
                          <span className="label">Atrasado</span>
                          <span className="amount">
                            {formatBRL(settlement.overdue)}
                          </span>
                        </SettleLegendRow>
                      )}
                      <SettleLegendRow $color="var(--text-muted)">
                        <span className="mark">•</span>
                        <span className="label">A vencer</span>
                        <span className="amount">
                          {formatBRL(settlement.upcoming)}
                        </span>
                      </SettleLegendRow>
                    </SettleLegend>
                  </SettlePane>

                  <SettlePane>
                    <PaneTitle>Próximos vencimentos</PaneTitle>
                    {settlement.pending.length > 0 ? (
                      <>
                        <DueHeadRow>
                          <span>Dia</span>
                          <span>Lançamento</span>
                          <span>Valor</span>
                        </DueHeadRow>
                        <DueList>
                          {settlement.pending
                            .slice(0, DUE_LIST_LIMIT)
                            .map((item) => {
                              const badge = dueBadge(item);
                              return (
                                <DueRow key={item.key}>
                                  <DueDay
                                    $color={
                                      item.late ? STATUS.critical : undefined
                                    }
                                  >
                                    {item.day ?? "—"}
                                  </DueDay>
                                  <DueName>
                                    <Dot $color={item.color} />
                                    <span className="text" title={item.name}>
                                      {item.name}
                                    </span>
                                  </DueName>
                                  <DueRight>
                                    {badge && (
                                      <DueBadge
                                        $color={badge.color}
                                        $bg={badge.bg}
                                      >
                                        {badge.text}
                                      </DueBadge>
                                    )}
                                    {formatBRL(item.value)}
                                  </DueRight>
                                </DueRow>
                              );
                            })}
                        </DueList>
                        <DueFoot>
                          <span>
                            {settlement.pending.length > DUE_LIST_LIMIT
                              ? `+${
                                settlement.pending.length - DUE_LIST_LIMIT
                              } pendentes além destes`
                              : `${settlement.pending.length} pendente${settlement.pending.length === 1 ? "" : "s"
                              } no mês`}
                          </span>
                          <Link to="/Financas">Ver lançamentos</Link>
                        </DueFoot>
                      </>
                    ) : (
                      <EmptyState>
                        ✓ Tudo quitado neste mês — nada pendente.
                      </EmptyState>
                    )}
                  </SettlePane>
                </SettleCard>
              ) : (
                <EmptyState>
                  {/* Um <span> só: o EmptyState é flex-column, e texto solto +
                      link virariam três linhas empilhadas. */}
                  <span>
                    Nenhum lançamento neste mês. Crie um pelo ⚡ acima ou em{" "}
                    <Link to="/Financas">Finanças</Link>.
                  </span>
                </EmptyState>
              )}
            </div>

            {/* -------- Banda de dois painéis: medidores + distribuição -------- */}
            <InsightGrid>
              <InsightCol>
                <SectionTitle>
                  Divisão do salário
                  <small>
                    60% Contas · 20% Investimentos · 10% Opcionais · 10% Metas —
                    quanto de cada fatia você já usou
                  </small>
                </SectionTitle>
                <MetersCard>
                  {buckets.map((b) => {
                    const st = meterStatus(b);
                    const fillPct =
                      b.ratio != null ? Math.min(b.ratio * 100, 100) : 0;
                    return (
                      <Meter key={b.tipo}>
                        <MeterHead>
                          <MeterName>
                            <Dot $color={b.color} />
                            {b.label}
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "1.25rem",
                                fontWeight: 400,
                              }}
                            >
                              {b.kind === "teto"
                                ? `teto ${b.pct}%`
                                : `meta ${b.pct}%`}
                            </span>
                          </MeterName>
                          <MeterHeadRight>
                            <MeterValues>
                              <strong>{formatBRL(b.spent)}</strong>
                              {b.limit != null && ` de ${formatBRL(b.limit)}`}
                            </MeterValues>
                            <EyeLink
                              to={b.route}
                              title={`Ver ${b.label}`}
                              aria-label={`Ver ${b.label}`}
                            >
                              {EyeIcon}
                            </EyeLink>
                          </MeterHeadRight>
                        </MeterHead>

                        <MeterTrack title={`${b.label}: ${formatBRL(b.spent)}`}>
                          <MeterFill $pct={fillPct} $color={st.fillColor} />
                        </MeterTrack>
                        <MeterFoot>
                          <StatusPill $color={st.color}>{st.label}</StatusPill>
                          <MeterFootRight>
                            {b.ratio != null && (
                              <MeterHint>
                                {(b.ratio * 100).toFixed(0)}% da fatia
                              </MeterHint>
                            )}
                          </MeterFootRight>
                        </MeterFoot>
                      </Meter>
                    );
                  })}
                </MetersCard>
              </InsightCol>

              {/* -------- Distribuição real vs. ideal -------- */}
              <InsightCol>
                <SectionTitle>
                  Como seu dinheiro está dividido
                  <small>
                    Distribuição real dos lançamentos do mês frente ao plano
                    ideal
                  </small>
                </SectionTitle>
                <DistribCard>
                  <DonutWrap>
                    <svg viewBox="0 0 200 200" width="220" height="220">
                      {/* trilha de fundo */}
                      <circle
                        cx="100"
                        cy="100"
                        r={donut.R}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="26"
                      />
                      {donut.segments.map((s) => (
                        <circle
                          key={s.tipo}
                          data-seg
                          cx="100"
                          cy="100"
                          r={donut.R}
                          fill="none"
                          stroke={s.color}
                          strokeWidth="26"
                          strokeDasharray={s.dasharray}
                          strokeDashoffset={s.dashoffset}
                          strokeLinecap="butt"
                        >
                          <title>{`${s.label}: ${formatBRL(
                            s.spent
                          )} (${s.pct.toFixed(0)}%)`}</title>
                        </circle>
                      ))}
                    </svg>
                    <DonutCenter>
                      {totalSpent > 0 ? (
                        <>
                          <span className="center-label">Comprometido</span>
                          <span className="center-value">
                            {formatBRL(totalSpent)}
                          </span>
                          {committedPct != null && (
                            <span className="center-hint">
                              {committedPct.toFixed(0)}% do salário
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="center-hint">Sem lançamentos</span>
                      )}
                    </DonutCenter>
                  </DonutWrap>

                  <Legend>
                    <LegendHeadRow>
                      <span>Categoria</span>
                      <span>Valor</span>
                      <span>Real</span>
                      <span className="col-plano">Plano</span>
                      <span aria-hidden="true" />
                    </LegendHeadRow>
                    {buckets.map((b) => {
                      const realPct =
                        totalSpent > 0 ? (b.spent / totalSpent) * 100 : 0;
                      return (
                        <LegendRow key={b.tipo}>
                          <span className="name">
                            <Dot $color={b.color} />
                            {b.label}
                          </span>
                          <span className="val">{formatBRL(b.spent)}</span>
                          <span
                            className="real"
                            style={{ color: b.color }}
                          >
                            {realPct.toFixed(0)}%
                          </span>
                          <span className="plano">{b.pct}%</span>
                          <EyeLink
                            to={b.route}
                            title={`Ver ${b.label}`}
                            aria-label={`Ver ${b.label}`}
                          >
                            {EyeIcon}
                          </EyeLink>
                        </LegendRow>
                      );
                    })}
                  </Legend>
                </DistribCard>
              </InsightCol>
            </InsightGrid>

            {/* -------- Gastos por tag -------- */}
            <div>
              <SectionTitle>
                Gastos por tag
                <small>
                  Quanto você comprometeu em cada categoria no mês — um
                  lançamento com várias tags conta em cada uma
                </small>
              </SectionTitle>
              {tagSpending.hasAny ? (
                <TagRankCard>
                  {tagSpending.rows.map((r) => {
                    const pct =
                      totalSpent > 0 ? (r.total / totalSpent) * 100 : 0;
                    const barPct =
                      tagSpending.maxTotal > 0
                        ? (r.total / tagSpending.maxTotal) * 100
                        : 0;
                    return (
                      <TagRow key={r.id}>
                        <TagName>
                          <Dot $color={r.cor} />
                          <span>{r.nome}</span>
                        </TagName>
                        <MeterTrack className="bar">
                          <MeterFill $pct={barPct} $color={r.cor} />
                        </MeterTrack>
                        <TagValue>
                          <strong>{formatBRL(r.total)}</strong>
                          <small>{pct.toFixed(0)}% do mês</small>
                        </TagValue>
                      </TagRow>
                    );
                  })}
                  {tagSpending.untagged > 0 && (
                    <TagRow>
                      <TagName>
                        <Dot $color={UNTAGGED_COLOR} />
                        <span>Sem tag</span>
                      </TagName>
                      <MeterTrack className="bar">
                        <MeterFill
                          $pct={
                            tagSpending.maxTotal > 0
                              ? (tagSpending.untagged / tagSpending.maxTotal) *
                              100
                              : 0
                          }
                          $color={UNTAGGED_COLOR}
                        />
                      </MeterTrack>
                      <TagValue>
                        <strong>{formatBRL(tagSpending.untagged)}</strong>
                        <small>
                          {totalSpent > 0
                            ? (
                              (tagSpending.untagged / totalSpent) *
                              100
                            ).toFixed(0)
                            : 0}
                          % do mês
                        </small>
                      </TagValue>
                    </TagRow>
                  )}
                </TagRankCard>
              ) : (
                <EmptyState>
                  Nenhum lançamento com tag neste mês. Adicione tags em{" "}
                  <Link to="/Financas">Finanças</Link> para ver a divisão aqui.
                </EmptyState>
              )}
            </div>
          </Ready>
        )}
      </Content>
    </div>
  );
}

export default Dashboard;
