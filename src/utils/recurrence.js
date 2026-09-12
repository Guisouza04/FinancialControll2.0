/**
 * Utilitários de recorrência das finanças.
 *
 * Contrato (frontend → backend) no create/update:
 *   recorrencia:    "UNICA" | "MENSAL" | "ANUAL"
 *   dia_vencimento: number (1–31)
 *   data_inicio:    "YYYY-MM-DD"  (primeira ocorrência)
 *   data_fim:       "YYYY-MM-DD"  (última data a considerar)
 *   qtd_parcelas:   number        (total de ocorrências)
 *
 * UNICA:  ocorre só no mês/ano escolhido.
 * MENSAL: ocorre todo mês em `dia_vencimento`, do mês inicial até o mês final
 *         (padrão: dezembro do ano inicial; o fim é editável).
 * ANUAL:  ocorre uma vez por ano na data (dia+mês vêm de data_inicio), por N anos.
 *
 * Registros LEGADOS (sem `recorrencia`) continuam tratados pela lógica antiga
 * de `qtd_parcelas`/`creationMonth` no ExpenseBox.
 */

export const RECURRENCE = {
  UNICA: "UNICA",
  MENSAL: "MENSAL",
  ANUAL: "ANUAL",
};

export const RECURRENCE_OPTIONS = [
  { value: RECURRENCE.UNICA, label: "Única (só um mês)" },
  { value: RECURRENCE.MENSAL, label: "Mensal" },
  { value: RECURRENCE.ANUAL, label: "Anual" },
];

// Teto padrão de anos para recorrência anual.
export const MAX_ANUAL_YEARS = 5;

const pad = (n) => String(n).padStart(2, "0");

const parseISO = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return { y, m, d };
};

/**
 * Total de ocorrências a partir dos campos do FORMULÁRIO (antes de salvar).
 * Contraparte de `occurrenceCount`, que trabalha sobre uma conta já salva.
 *
 * `fimAno` é opcional: sem ele o fim fica no mesmo ano do início — como era
 * antes de a meta poder atravessar o ano (ExpenseBox/QuickAddModal não passam).
 */
export const formOccurrenceCount = ({
  recorrencia,
  anos,
  fimAno,
  fimMes,
  startYear,
  startMonth,
}) => {
  if (recorrencia === RECURRENCE.UNICA) return 1;
  if (recorrencia === RECURRENCE.ANUAL) return Math.max(parseInt(anos, 10) || 1, 1);

  const sy = parseInt(startYear, 10);
  const sm = parseInt(startMonth, 10);
  const fy = parseInt(fimAno, 10) || sy;
  const fm = parseInt(fimMes, 10);
  if (!sy || !sm || !fm) return 0;
  return Math.max(fy * 12 + fm - (sy * 12 + sm) + 1, 0);
};

/**
 * Valida os campos de recorrência do formulário.
 * @returns {string|null} mensagem de erro ou null se válido
 */
export const validateRecurrence = ({
  recorrencia,
  dia,
  mes,
  anos,
  fimAno,
  fimMes,
  startYear,
  startMonth,
}) => {
  const d = parseInt(dia, 10);
  if (!d || d < 1 || d > 31) return "Informe um dia de vencimento válido (1–31).";

  if (recorrencia === RECURRENCE.UNICA) {
    const m = parseInt(mes, 10);
    if (!m || m < 1 || m > 12) return "Selecione o mês.";
  }

  if (recorrencia === RECURRENCE.MENSAL) {
    const fm = parseInt(fimMes, 10);
    const sm = parseInt(startMonth, 10);
    if (!fm || fm < 1 || fm > 12) return "Selecione o mês final.";

    // Sem `fimAno` o fim é no ano do início (comportamento antigo) e basta
    // comparar os meses; com ele, a comparação é ano+mês.
    const sy = parseInt(startYear, 10);
    const fy = parseInt(fimAno, 10);
    if (fy && sy) {
      if (fy * 12 + fm < sy * 12 + sm)
        return "O fim da meta deve ser igual ou posterior ao início.";
    } else if (fm < sm) {
      return "O mês final deve ser igual ou posterior ao inicial.";
    }
  }

  if (recorrencia === RECURRENCE.ANUAL) {
    const m = parseInt(mes, 10);
    if (!m || m < 1 || m > 12) return "Selecione o mês da recorrência anual.";
    const y = parseInt(anos, 10);
    if (!y || y < 1 || y > MAX_ANUAL_YEARS)
      return `Escolha por quantos anos (1–${MAX_ANUAL_YEARS}).`;
  }
  return null;
};

/**
 * Monta os campos de recorrência para o payload.
 * `startYear`/`startMonth` definem o início (no create = data atual;
 * na edição = início original preservado).
 */
export const buildRecurrencePayload = ({
  recorrencia,
  dia,
  mes,
  anos,
  fimAno,
  fimMes,
  startYear,
  startMonth,
}) => {
  const d = parseInt(dia, 10);
  const sy = parseInt(startYear, 10);

  if (recorrencia === RECURRENCE.UNICA) {
    const m = parseInt(mes, 10);
    const iso = `${sy}-${pad(m)}-${pad(d)}`;
    return {
      recorrencia: RECURRENCE.UNICA,
      dia_vencimento: d,
      data_inicio: iso,
      data_fim: iso,
      qtd_parcelas: 1,
    };
  }

  if (recorrencia === RECURRENCE.MENSAL) {
    const sm = parseInt(startMonth, 10);
    const fm = parseInt(fimMes, 10);
    // Sem `fimAno`, o fim fica no ano do início (comportamento das telas de
    // despesa). A tela de Metas passa o ano para a meta poder atravessá-lo.
    const fy = parseInt(fimAno, 10) || sy;
    return {
      recorrencia: RECURRENCE.MENSAL,
      dia_vencimento: d,
      data_inicio: `${sy}-${pad(sm)}-${pad(d)}`,
      data_fim: `${fy}-${pad(fm)}-${pad(d)}`,
      qtd_parcelas: formOccurrenceCount({
        recorrencia,
        fimAno: fy,
        fimMes,
        startYear,
        startMonth,
      }),
    };
  }

  if (recorrencia === RECURRENCE.ANUAL) {
    const m = parseInt(mes, 10);
    const y = parseInt(anos, 10);
    return {
      recorrencia: RECURRENCE.ANUAL,
      dia_vencimento: d,
      data_inicio: `${sy}-${pad(m)}-${pad(d)}`,
      data_fim: `${sy + y - 1}-${pad(m)}-${pad(d)}`,
      qtd_parcelas: y,
    };
  }

  return null;
};

/**
 * Deriva o estado do formulário a partir de uma conta (para edição).
 * Trata contas com recorrência e legadas (via creationMonth/durationMonths).
 */
export const deriveRecurrenceForm = (account) => {
  const now = new Date();

  if (account.recorrencia && account.dataInicio && account.dataFim) {
    const s = parseISO(account.dataInicio);
    const e = parseISO(account.dataFim);
    const dia = String(account.diaVencimento || s.d || 1);
    return {
      recorrencia: account.recorrencia,
      dia,
      mes: pad(s.m),
      anos: String(Math.max(1, e.y - s.y + 1)),
      fimAno: String(e.y),
      fimMes: pad(e.m),
      startYear: String(s.y),
      startMonth: pad(s.m),
    };
  }

  // Legado: sem recorrência — deriva de creationMonth + durationMonths.
  const [ly, lm] = (account.creationMonth || `${now.getFullYear()}-01`)
    .split("-")
    .map(Number);
  const dur = account.durationMonths || 1;
  const recorrencia = dur > 1 ? RECURRENCE.MENSAL : RECURRENCE.UNICA;
  const fimMes = Math.min(12, lm + dur - 1);
  return {
    recorrencia,
    dia: "1",
    mes: pad(lm),
    anos: "1",
    fimMes: pad(fimMes),
    startYear: String(ly),
    startMonth: pad(lm),
  };
};

/**
 * A conta (com recorrência) está ativa no período filtrado?
 * filterYear/filterMonth são strings ("" = sem filtro naquele campo).
 */
export const isActiveInPeriod = (account, filterYear, filterMonth) => {
  const fy = filterYear ? parseInt(filterYear, 10) : null;
  const fm = filterMonth ? parseInt(filterMonth, 10) : null;
  const s = parseISO(account.dataInicio);
  const e = parseISO(account.dataFim);

  if (account.recorrencia === RECURRENCE.UNICA) {
    if (fy && fm) return fy === s.y && fm === s.m;
    if (fy) return fy === s.y;
    if (fm) return fm === s.m;
    return true;
  }

  if (account.recorrencia === RECURRENCE.MENSAL) {
    const startIdx = s.y * 12 + (s.m - 1);
    const endIdx = e.y * 12 + (e.m - 1);
    if (fy && fm) {
      const idx = fy * 12 + (fm - 1);
      return idx >= startIdx && idx <= endIdx;
    }
    if (fy) return fy * 12 + 11 >= startIdx && fy * 12 <= endIdx;
    if (fm) {
      for (let i = startIdx; i <= endIdx; i++) {
        if (i % 12 === fm - 1) return true;
      }
      return false;
    }
    return true;
  }

  if (account.recorrencia === RECURRENCE.ANUAL) {
    const dueMonth = s.m;
    if (fy && fm) return fm === dueMonth && fy >= s.y && fy <= e.y;
    if (fy) return fy >= s.y && fy <= e.y;
    if (fm) return fm === dueMonth;
    return true;
  }

  return true;
};

/**
 * A conta está ativa no período (ano+mês), tratando recorrência E legado.
 *
 * Espelha a lógica de filtro do `ExpenseBox` (sem o filtro de status), para que
 * o Dashboard some exatamente os mesmos lançamentos que aparecem nas telas de
 * despesa. `filterYear`/`filterMonth` são strings ("" = sem filtro no campo).
 */
export const accountActiveInPeriod = (account, filterYear, filterMonth) => {
  // Contas com recorrência usam a regra (UNICA/MENSAL/ANUAL).
  if (account.recorrencia) {
    return isActiveInPeriod(account, filterYear, filterMonth);
  }

  // Legado: janela de meses consecutivos a partir do creationMonth.
  if (!account.creationMonth) return true;
  const [startYear, startMonth] = account.creationMonth.split("-").map(Number);
  const startDate = new Date(startYear, startMonth - 1);
  const endDate = new Date(startYear, startMonth - 1);
  endDate.setMonth(endDate.getMonth() + (account.durationMonths || 1));

  const fy = filterYear ? parseInt(filterYear, 10) : null;
  const fm = filterMonth ? parseInt(filterMonth, 10) : null;

  if (fy && fm) {
    const filterDate = new Date(fy, fm - 1);
    return filterDate >= startDate && filterDate < endDate;
  }
  if (fy) return startYear <= fy && endDate.getFullYear() >= fy;
  if (fm) {
    for (let i = 0; i < (account.durationMonths || 1); i++) {
      const d = new Date(startYear, startMonth - 1 + i);
      if (d.getMonth() + 1 === fm) return true;
    }
    return false;
  }
  return true;
};

/**
 * Soma o valor das contas ativas no período. `naFatura` é apenas um marcador
 * (compra de cartão) e NÃO exclui do total — a antiga regra de "não somar" foi
 * aposentada quando passamos a itemizar as compras de cartão via importação.
 */
export const sumActiveInPeriod = (accounts, filterYear, filterMonth) =>
  (accounts || [])
    .filter((a) => accountActiveInPeriod(a, filterYear, filterMonth))
    .reduce(
      (sum, a) => sum + occurrenceValue(a, filterYear, filterMonth),
      0
    );

/**
 * Competência ("YYYY-MM") da ocorrência exibida no período filtrado.
 *
 * É a chave usada para marcar/consultar o pagamento de UMA parcela específica
 * (modelo: tabela `pagamentos(conta_id, competencia, pago)` no backend).
 *
 * Retorna `null` quando não é possível determinar uma competência única —
 * ex.: conta MENSAL/legada sem um mês selecionado no filtro ("Todos os meses").
 */
export const occurrenceCompetencia = (account, filterYear, filterMonth) => {
  const fy = filterYear ? parseInt(filterYear, 10) : null;
  const fm = filterMonth ? parseInt(filterMonth, 10) : null;

  if (account.recorrencia) {
    const s = parseISO(account.dataInicio);

    // UNICA: a competência é sempre o mês/ano da própria ocorrência.
    if (account.recorrencia === RECURRENCE.UNICA) {
      return `${s.y}-${pad(s.m)}`;
    }

    // ANUAL: ocorre no mês de início; o ano vem do filtro (ou do início).
    if (account.recorrencia === RECURRENCE.ANUAL) {
      const y = fy || s.y;
      return `${y}-${pad(s.m)}`;
    }

    // MENSAL: precisa de ano E mês do filtro para identificar a parcela.
    if (fy && fm) return `${fy}-${pad(fm)}`;
    return null;
  }

  // Legado (sem recorrência): usa o mês/ano do filtro.
  if (fy && fm) return `${fy}-${pad(fm)}`;
  return null;
};

/**
 * Valor efetivo da ocorrência exibida. Sem competência única (ex.: "Todos os
 * meses") mantém o valor padrão, pois não há uma parcela específica a resolver.
 */
export const occurrenceValue = (account, filterYear, filterMonth) => {
  const baseValue = Number(account.value) || 0;
  const competencia = occurrenceCompetencia(account, filterYear, filterMonth);
  if (!competencia || !Array.isArray(account.valoresCompetencia)) return baseValue;

  const override = account.valoresCompetencia.find(
    (entry) => entry.competencia === competencia
  );
  return override ? Number(override.value) || 0 : baseValue;
};

/**
 * A parcela exibida no período filtrado está paga?
 *
 * Usa `account.pagamentos` (lista de competências "YYYY-MM" pagas). Quando o
 * backend ainda não envia essa lista (`pagamentos` ausente), cai no campo
 * único legado `contaPaga` para não quebrar registros antigos.
 */
export const isPaidInPeriod = (account, filterYear, filterMonth) => {
  if (Array.isArray(account.pagamentos)) {
    const comp = occurrenceCompetencia(account, filterYear, filterMonth);
    return comp ? account.pagamentos.includes(comp) : false;
  }
  return account.contaPaga === "S";
};

/**
 * Total de ocorrências (parcelas/aportes) do lançamento.
 *
 * Legado (sem `recorrencia`): cai em `durationMonths`, a janela de meses que o
 * ExpenseBox já usa para esses registros.
 *
 * @returns {number} total de ocorrências (mínimo 1)
 */
export const occurrenceCount = (account) => {
  if (account.recorrencia === RECURRENCE.UNICA) return 1;

  if (account.recorrencia === RECURRENCE.MENSAL) {
    const s = parseISO(account.dataInicio);
    const e = parseISO(account.dataFim);
    const startIdx = s.y * 12 + (s.m - 1);
    const endIdx = e.y * 12 + (e.m - 1);
    return Math.max(endIdx - startIdx + 1, 1);
  }

  if (account.recorrencia === RECURRENCE.ANUAL) {
    const s = parseISO(account.dataInicio);
    const e = parseISO(account.dataFim);
    return Math.max(e.y - s.y + 1, 1);
  }

  return Math.max(Number(account.durationMonths) || 1, 1);
};

/**
 * Rótulo "índice/total" da ocorrência para a coluna de Parcela.
 */
export const occurrenceLabel = (account, filterYear, filterMonth) => {
  const fy = filterYear ? parseInt(filterYear, 10) : null;
  const fm = filterMonth ? parseInt(filterMonth, 10) : null;
  const s = parseISO(account.dataInicio);
  const now = new Date();

  const clamp = (idx, total) => Math.min(Math.max(idx, 1), total);

  if (account.recorrencia === RECURRENCE.UNICA) {
    return "1/1";
  }

  if (account.recorrencia === RECURRENCE.MENSAL) {
    const total = occurrenceCount(account);
    const startIdx = s.y * 12 + (s.m - 1);
    const refIdx =
      fy && fm ? fy * 12 + (fm - 1) : now.getFullYear() * 12 + now.getMonth();
    return `${clamp(refIdx - startIdx + 1, total)}/${total}`;
  }

  if (account.recorrencia === RECURRENCE.ANUAL) {
    const total = occurrenceCount(account);
    const refYear = fy || now.getFullYear();
    return `${clamp(refYear - s.y + 1, total)}/${total}`;
  }

  return "";
};

/**
 * Competências ("YYYY-MM") em que a meta aceita aporte — a janela dela.
 *
 * Serve para não contar aporte fora do período: mover o início de uma meta de
 * julho para setembro deixa um `pagamentos: ["2026-07"]` órfão, que não pode
 * seguir contando como progresso.
 *
 * @returns {string[]} vazio para registros legados (sem recorrência/datas)
 */
export const goalCompetencias = (account) => {
  if (!account.recorrencia || !account.dataInicio || !account.dataFim) return [];

  const s = parseISO(account.dataInicio);
  const e = parseISO(account.dataFim);

  if (account.recorrencia === RECURRENCE.UNICA) {
    return [`${s.y}-${pad(s.m)}`];
  }

  if (account.recorrencia === RECURRENCE.MENSAL) {
    const startIdx = s.y * 12 + (s.m - 1);
    const endIdx = e.y * 12 + (e.m - 1);
    const out = [];
    for (let i = startIdx; i <= endIdx; i++) {
      out.push(`${Math.floor(i / 12)}-${pad((i % 12) + 1)}`);
    }
    return out;
  }

  if (account.recorrencia === RECURRENCE.ANUAL) {
    const out = [];
    for (let y = s.y; y <= e.y; y++) out.push(`${y}-${pad(s.m)}`);
    return out;
  }

  return [];
};

/**
 * Competência do próximo aporte pendente da meta — o primeiro mês da janela
 * ainda não aportado. Se todos já foram, devolve o último (a meta acabou).
 *
 * É o que o botão de aporte mira quando o mês do filtro não faz parte da meta:
 * bloquear o botão só porque o filtro está em outro mês não ajuda ninguém.
 *
 * @returns {string|null} "YYYY-MM" ou null (meta sem janela — legado)
 */
export const nextPendingCompetencia = (account) => {
  const janela = goalCompetencias(account);
  if (!janela.length) return null;
  const pagos = Array.isArray(account.pagamentos) ? account.pagamentos : [];
  return janela.find((c) => !pagos.includes(c)) ?? janela[janela.length - 1];
};

/**
 * Progresso de uma META (tipo 4), derivado do que o backend já guarda — não há
 * campo de alvo nem de acumulado.
 *
 *   alvo     = valor do aporte × total de ocorrências
 *   guardado = valor do aporte × aportes feitos DENTRO da janela da meta
 *
 * `pagamentos` é a lista de competências quitadas; para uma meta, "quitada"
 * significa "aporte feito". Só contam as que caem na janela (`goalCompetencias`),
 * senão um aporte de um período que a meta não cobre mais inflaria o progresso.
 * Sem a lista (backend legado), cai no `contaPaga` único — tudo ou nada — mesmo
 * critério de `isPaidInPeriod`.
 *
 * @returns {{alvo:number, guardado:number, pct:number, aportesPagos:number,
 *            totalAportes:number, concluida:boolean}}
 */
export const goalProgress = (account) => {
  const valor = Number(account.value) || 0;
  const totalAportes = occurrenceCount(account);
  const janela = goalCompetencias(account);

  let aportesPagos;
  if (Array.isArray(account.pagamentos)) {
    aportesPagos = janela.length
      ? account.pagamentos.filter((c) => janela.includes(c)).length
      : // Legado (sem datas p/ montar a janela): sem como saber quais valem;
        // limita ao total para o progresso não passar de 100%.
        Math.min(account.pagamentos.length, totalAportes);
  } else {
    aportesPagos = account.contaPaga === "S" ? totalAportes : 0;
  }

  const alvo = valor * totalAportes;
  const guardado = valor * aportesPagos;

  return {
    alvo,
    guardado,
    pct: alvo > 0 ? Math.min((guardado / alvo) * 100, 100) : 0,
    aportesPagos,
    totalAportes,
    concluida: totalAportes > 0 && aportesPagos >= totalAportes,
  };
};
