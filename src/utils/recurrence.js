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
 * Valida os campos de recorrência do formulário.
 * @returns {string|null} mensagem de erro ou null se válido
 */
export const validateRecurrence = ({
  recorrencia,
  dia,
  mes,
  anos,
  fimMes,
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
    if (fm < sm) return "O mês final deve ser igual ou posterior ao inicial.";
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
    return {
      recorrencia: RECURRENCE.MENSAL,
      dia_vencimento: d,
      data_inicio: `${sy}-${pad(sm)}-${pad(d)}`,
      data_fim: `${sy}-${pad(fm)}-${pad(d)}`,
      qtd_parcelas: fm - sm + 1,
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
    .reduce((sum, a) => sum + (Number(a.value) || 0), 0);

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
 * Rótulo "índice/total" da ocorrência para a coluna de Parcela.
 */
export const occurrenceLabel = (account, filterYear, filterMonth) => {
  const fy = filterYear ? parseInt(filterYear, 10) : null;
  const fm = filterMonth ? parseInt(filterMonth, 10) : null;
  const s = parseISO(account.dataInicio);
  const e = parseISO(account.dataFim);
  const now = new Date();

  const clamp = (idx, total) => Math.min(Math.max(idx, 1), total);

  if (account.recorrencia === RECURRENCE.UNICA) {
    return "1/1";
  }

  if (account.recorrencia === RECURRENCE.MENSAL) {
    const startIdx = s.y * 12 + (s.m - 1);
    const endIdx = e.y * 12 + (e.m - 1);
    const total = endIdx - startIdx + 1;
    const refIdx =
      fy && fm ? fy * 12 + (fm - 1) : now.getFullYear() * 12 + now.getMonth();
    return `${clamp(refIdx - startIdx + 1, total)}/${total}`;
  }

  if (account.recorrencia === RECURRENCE.ANUAL) {
    const total = e.y - s.y + 1;
    const refYear = fy || now.getFullYear();
    return `${clamp(refYear - s.y + 1, total)}/${total}`;
  }

  return "";
};
