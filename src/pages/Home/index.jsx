import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import Select from "../../components/Select";
import { useAccounts } from "../../hooks/useAccounts";
import financeService from "../../services/financeService";
import { sumActiveInPeriod } from "../../utils/recurrence";
import { formatBRL } from "../../utils/currency";
import {
  Content,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  Filters,
  MonthSelect,
  YearSelect,
  MonthNavButton,
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
  Dot,
  MeterValues,
  MeterTrack,
  MeterFill,
  MeterFoot,
  StatusPill,
  MeterHint,
  DistribCard,
  DonutWrap,
  DonutCenter,
  Legend,
  LegendHeadRow,
  LegendRow,
  EmptyState,
  InlineNotice,
} from "./styles";

// Divisão-alvo do salário. `kind` distingue TETO (não pode passar) de META
// (você quer alcançar), o que muda a leitura do medidor.
//   contas       → teto de 60%
//   investimentos→ meta de 20%
//   opcionais    → teto de 10%
//   metas        → meta de 10%
const BUDGET = [
  { tipo: 1, label: "Contas", pct: 60, kind: "teto", color: "#3987e5" },
  { tipo: 2, label: "Investimentos", pct: 20, kind: "meta", color: "#199e70" },
  { tipo: 3, label: "Opcionais", pct: 10, kind: "teto", color: "#c98500" },
  { tipo: 4, label: "Metas", pct: 10, kind: "meta", color: "#d55181" },
];

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
          </Filters>
        </Header>

        {loading ? (
          <EmptyState>Carregando seu resumo…</EmptyState>
        ) : (
          <>
            {noSalary && (
              <InlineNotice>
                <span>💡</span>
                <span>
                  Configure seu salário para ver a divisão 60/20/10/10 com
                  limites.
                </span>
                <Link to="/dados">Definir salário</Link>
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

            {/* -------- Medidores (regra 60/20/10/10) -------- */}
            <div>
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
                        <MeterValues>
                          <strong>{formatBRL(b.spent)}</strong>
                          {b.limit != null && ` de ${formatBRL(b.limit)}`}
                        </MeterValues>
                      </MeterHead>
                      <MeterTrack title={`${b.label}: ${formatBRL(b.spent)}`}>
                        <MeterFill $pct={fillPct} $color={st.fillColor} />
                      </MeterTrack>
                      <MeterFoot>
                        <StatusPill $color={st.color}>{st.label}</StatusPill>
                        {b.ratio != null && (
                          <MeterHint>
                            {(b.ratio * 100).toFixed(0)}% da fatia
                          </MeterHint>
                        )}
                      </MeterFoot>
                    </Meter>
                  );
                })}
              </MetersCard>
            </div>

            {/* -------- Distribuição real vs. ideal -------- */}
            <div>
              <SectionTitle>
                Como seu dinheiro está dividido
                <small>
                  Distribuição real dos lançamentos do mês frente ao plano ideal
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
                      </LegendRow>
                    );
                  })}
                </Legend>
              </DistribCard>
            </div>
          </>
        )}
      </Content>
    </div>
  );
}

export default Dashboard;
