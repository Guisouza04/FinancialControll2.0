import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import BotaoPadrao from "../../components/Button";
import Select from "../../components/Select";
import RequiredField from "../../components/RequiredField";
import { useAccounts } from "../../hooks/useAccounts";
import { formatBRL, formatDigitsAsBRL, digitsToApiValue, hasPositiveValue, reaisToDigits } from "../../utils/currency";
import {
  RECURRENCE,
  RECURRENCE_OPTIONS,
  MAX_ANUAL_YEARS,
  validateRecurrence,
  buildRecurrencePayload,
  deriveRecurrenceForm,
  occurrenceCompetencia,
  goalCompetencias,
  nextPendingCompetencia,
  goalProgress,
} from "../../utils/recurrence";
import { useToast } from "../../context/toast";
import { useConfirm } from "../../context/confirm";
// Mesmo modal das outras telas — reusa os estilos do ExpenseBox, como o
// QuickAddModal já faz.
import {
  ModalContent,
  Form,
  FormBody,
  Field,
  FieldLabel,
  SectionLabel,
  ModalButtons,
  ModalTitle,
} from "../../components/ExpenseBox/styles";
import {
  Toolbar,
  Filters,
  GoalGrid,
  GoalCard,
  GoalHead,
  GoalName,
  Bar,
  BarFill,
  GoalStats,
  GoalMeta,
  GoalFoot,
  ContributeButton,
  IconButton,
  GroupLabel,
  Empty,
  Loading,
} from "./styles";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const TIPO_META = 4;

// Formata "YYYY-MM-DD" -> "Mês/AAAA" (sem criar Date, evitando fuso).
const formatMonthYear = (iso) => {
  if (!iso) return "—";
  const [y, m] = String(iso).split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]}/${y}`;
};

function Metas() {
  const toast = useToast();
  const confirm = useConfirm();

  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  // Filtro de período: define de qual competência é o aporte registrado. A LISTA
  // não é filtrada por ele — uma meta atravessa vários meses e some da tela se
  // filtrarmos por período.
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);

  const {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    togglePaymentStatus,
  } = useAccounts(TIPO_META, filterYear, filterMonth);

  // ------- Formulário do modal (add e edição compartilham o estado) -------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [valueDigits, setValueDigits] = useState("");
  const [recorrencia, setRecorrencia] = useState(RECURRENCE.MENSAL);
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState(currentMonth);
  const [fimAno, setFimAno] = useState(currentYear);
  const [fimMes, setFimMes] = useState("12");
  const [anos, setAnos] = useState("1");
  const [startY, setStartY] = useState(currentYear);
  const [startM, setStartM] = useState(currentMonth);
  const [saving, setSaving] = useState(false);

  const currentYearNum = now.getFullYear();
  const monthOptions = MONTH_NAMES.map((label, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label,
  }));
  const monthFilterOptions = [{ value: "", label: "Todos os meses" }, ...monthOptions];
  const yearFilterOptions = Array.from({ length: 11 }, (_, i) => {
    const y = String(currentYearNum + 5 - i);
    return { value: y, label: y };
  });
  const startYearOptions = Array.from({ length: 16 }, (_, i) => {
    const y = String(currentYearNum - 5 + i);
    return { value: y, label: y };
  });
  const anosOptions = Array.from({ length: MAX_ANUAL_YEARS }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i + 1 === 1 ? "ano" : "anos"}`,
  }));

  const monthLabel = (mm) => MONTH_NAMES[parseInt(mm, 10) - 1] || "";

  // "2026-09" -> "Setembro/2026" (com o ano, porque uma meta atravessa anos).
  const competenciaLabel = (comp) => {
    if (!comp) return "—";
    const [y, m] = comp.split("-");
    return `${monthLabel(m)}/${y}`;
  };

  /**
   * Competência que o botão de aporte mira: o mês do filtro quando ele faz
   * parte da meta, senão o próximo aporte pendente dela. Assim o botão nunca
   * fica bloqueado por causa do filtro — mudar o início da meta para Setembro
   * simplesmente passa a oferecer o aporte de Setembro.
   */
  const competenciaDoAporte = (goal) => {
    const doFiltro = occurrenceCompetencia(goal, filterYear, filterMonth);
    if (doFiltro && goalCompetencias(goal).includes(doFiltro)) return doFiltro;
    return nextPendingCompetencia(goal);
  };

  // Progresso de cada meta, separando concluídas das em andamento.
  const { emAndamento, concluidas } = useMemo(() => {
    const withProgress = accounts.map((a) => ({ ...a, progresso: goalProgress(a) }));
    return {
      emAndamento: withProgress.filter((g) => !g.progresso.concluida),
      concluidas: withProgress.filter((g) => g.progresso.concluida),
    };
  }, [accounts]);

  const resetForm = () => {
    setName("");
    setValueDigits("");
    setRecorrencia(RECURRENCE.MENSAL);
    setDia("");
    setMes(currentMonth);
    setFimAno(currentYear);
    setFimMes("12");
    setAnos("1");
    setStartY(currentYear);
    setStartM(currentMonth);
  };

  const openAddModal = () => {
    resetForm();
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (goal) => {
    const d = deriveRecurrenceForm(goal);
    setName(goal.name);
    setValueDigits(reaisToDigits(goal.value));
    setRecorrencia(d.recorrencia);
    setDia(d.dia);
    setMes(d.mes);
    setFimAno(d.fimAno || d.startYear);
    setFimMes(d.fimMes);
    setAnos(d.anos);
    setStartY(d.startYear);
    setStartM(d.startMonth);
    setEditId(goal.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !hasPositiveValue(valueDigits)) {
      toast.warning("Por favor, preencha nome e valor do aporte!");
      return;
    }

    const recErr = validateRecurrence({
      recorrencia,
      dia,
      mes,
      anos,
      fimAno,
      fimMes,
      startYear: startY,
      startMonth: startM,
    });
    if (recErr) {
      toast.warning(recErr);
      return;
    }

    const recurrence = buildRecurrencePayload({
      recorrencia,
      dia,
      mes,
      anos,
      fimAno,
      fimMes,
      startYear: startY,
      startMonth: startM,
    });

    const payload = {
      de_conta: name,
      vl_conta: digitsToApiValue(valueDigits),
      tipo: TIPO_META,
      ...recurrence,
    };

    setSaving(true);
    const result = editId
      ? await updateAccount(editId, payload)
      : await addAccount(payload);
    setSaving(false);

    if (result.success) {
      toast.success(editId ? "Meta atualizada com sucesso!" : "Meta criada com sucesso!");
      closeModal();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (goal) => {
    const confirmed = await confirm({
      title: "Excluir meta",
      message: `Tem certeza que deseja excluir a meta "${goal.name}"? O progresso registrado será perdido.`,
      confirmText: "Excluir",
      danger: true,
    });
    if (!confirmed) return;

    const result = await deleteAccount(goal.id);
    if (result.success) toast.success("Meta excluída com sucesso!");
    else toast.error(result.error);
  };

  // Registra/desfaz o aporte do mês selecionado no filtro (mesma mecânica de
  // "parcela paga" das outras telas — aqui a competência é o aporte).
  const handleContribute = async (goal) => {
    const competencia = competenciaDoAporte(goal);
    if (!competencia) {
      toast.warning(`Não foi possível identificar o aporte da meta "${goal.name}".`);
      return;
    }

    const feito = (goal.pagamentos || []).includes(competencia);
    const confirmed = await confirm({
      title: feito ? "Desfazer aporte" : "Registrar aporte",
      message: feito
        ? `Desfazer o aporte de ${competenciaLabel(competencia)} da meta "${goal.name}"?`
        : `Registrar o aporte de ${formatBRL(goal.value)} em ${competenciaLabel(competencia)} para a meta "${goal.name}"?`,
      confirmText: "Confirmar",
    });
    if (!confirmed) return;

    const result = await togglePaymentStatus(goal.id, competencia, feito);
    if (result.success) {
      toast.success(feito ? "Aporte desfeito." : "Aporte registrado!");
    } else {
      toast.error(result.error);
    }
  };

  const renderCard = (goal) => {
    const p = goal.progresso;
    const alvo = competenciaDoAporte(goal);
    const aporteFeito = alvo
      ? (goal.pagamentos || []).includes(alvo)
      : goal.contaPaga === "S";

    return (
      <GoalCard key={goal.id} $concluida={p.concluida}>
        <GoalHead>
          <GoalName>{goal.name}</GoalName>
          <div>
            <IconButton
              type="button"
              onClick={() => openEditModal(goal)}
              title="Editar meta"
            >
              ✏️
            </IconButton>
            <IconButton
              type="button"
              onClick={() => handleDelete(goal)}
              title="Excluir meta"
            >
              🗑️
            </IconButton>
          </div>
        </GoalHead>

        <GoalStats>
          <strong>{formatBRL(p.guardado)}</strong> de {formatBRL(p.alvo)}
          <span className="pct">{Math.round(p.pct)}%</span>
        </GoalStats>

        <Bar
          role="progressbar"
          aria-valuenow={Math.round(p.pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso da meta ${goal.name}`}
        >
          <BarFill $pct={p.pct} $concluida={p.concluida} />
        </Bar>

        <GoalMeta>
          {formatBRL(goal.value)}/aporte · {p.aportesPagos} de {p.totalAportes} aportes
          <br />
          {p.concluida
            ? "Meta concluída 🎉"
            : `Aportes de ${formatMonthYear(goal.dataInicio)} a ${formatMonthYear(goal.dataFim)}`}
        </GoalMeta>

        <GoalFoot>
          <ContributeButton
            type="button"
            onClick={() => handleContribute(goal)}
            $feito={aporteFeito}
            disabled={!alvo}
          >
            {aporteFeito
              ? `Aporte de ${competenciaLabel(alvo)} registrado ✓`
              : `Registrar aporte de ${competenciaLabel(alvo)}`}
          </ContributeButton>
        </GoalFoot>
      </GoalCard>
    );
  };

  return (
    <div className="frame">
      <MenuNavecacao />
      <div className="containerExpenses">
        <TituloPage titulo="Metas" />
        <div className="boxExpenses">
          <div className="contentExpenses">
            <Toolbar>
              <Filters>
                <Select
                  value={filterYear}
                  onChange={setFilterYear}
                  options={yearFilterOptions}
                />
                <Select
                  value={filterMonth}
                  onChange={setFilterMonth}
                  options={monthFilterOptions}
                />
                <span className="hint">
                  mês de referência do aporte — fora da meta, o botão usa o
                  próximo aporte pendente
                </span>
              </Filters>
              <button className="button2" type="button" onClick={openAddModal}>
                Nova meta
              </button>
            </Toolbar>

            {loading ? (
              <Loading>Carregando metas…</Loading>
            ) : accounts.length === 0 ? (
              <Empty>
                <strong>Nenhuma meta ainda</strong>
                <span>
                  Metas são aportes mensais para um objetivo — uma viagem, uma
                  reserva, um carro. Crie a primeira e acompanhe o progresso aqui.
                </span>
                <button className="button2" type="button" onClick={openAddModal}>
                  Criar primeira meta
                </button>
              </Empty>
            ) : (
              <>
                {emAndamento.length > 0 && (
                  <>
                    <GroupLabel>Em andamento ({emAndamento.length})</GroupLabel>
                    <GoalGrid>{emAndamento.map(renderCard)}</GoalGrid>
                  </>
                )}
                {concluidas.length > 0 && (
                  <>
                    <GroupLabel>Concluídas ({concluidas.length})</GroupLabel>
                    <GoalGrid>{concluidas.map(renderCard)}</GoalGrid>
                  </>
                )}
              </>
            )}
          </div>

          <Link to="/Financas">
            <BotaoPadrao nomeBotao={"Voltar"} />
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>{editId ? "Editar meta" : "Nova meta"}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormBody>
                <Field $full>
                  <FieldLabel>Nome da meta</FieldLabel>
                  <RequiredField>
                    <input
                      type="text"
                      placeholder="Ex.: Viagem para o Chile"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </RequiredField>
                </Field>

                <Field>
                  <FieldLabel>Valor do aporte</FieldLabel>
                  <RequiredField>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={formatDigitsAsBRL(valueDigits)}
                      onChange={(e) =>
                        setValueDigits(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </RequiredField>
                </Field>

                <Field>
                  <FieldLabel>Frequência</FieldLabel>
                  <Select
                    value={recorrencia}
                    onChange={setRecorrencia}
                    options={RECURRENCE_OPTIONS}
                  />
                </Field>

                <Field>
                  <FieldLabel>Dia do aporte</FieldLabel>
                  <RequiredField>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="1–31"
                      value={dia}
                      onChange={(e) => setDia(e.target.value)}
                    />
                  </RequiredField>
                </Field>

                <SectionLabel>Período</SectionLabel>

                {recorrencia === RECURRENCE.UNICA && (
                  <>
                    <Field>
                      <FieldLabel>Ano</FieldLabel>
                      <Select
                        value={startY}
                        onChange={setStartY}
                        options={startYearOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Mês</FieldLabel>
                      <Select value={mes} onChange={setMes} options={monthOptions} />
                    </Field>
                  </>
                )}

                {recorrencia === RECURRENCE.MENSAL && (
                  <>
                    <Field>
                      <FieldLabel>Ano de início</FieldLabel>
                      <Select
                        value={startY}
                        onChange={setStartY}
                        options={startYearOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Mês de início</FieldLabel>
                      <Select
                        value={startM}
                        onChange={setStartM}
                        options={monthOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Ano de término</FieldLabel>
                      <Select
                        value={fimAno}
                        onChange={setFimAno}
                        options={startYearOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Mês de término</FieldLabel>
                      <Select
                        value={fimMes}
                        onChange={setFimMes}
                        options={monthOptions}
                      />
                    </Field>
                  </>
                )}

                {recorrencia === RECURRENCE.ANUAL && (
                  <>
                    <Field>
                      <FieldLabel>Ano de início</FieldLabel>
                      <Select
                        value={startY}
                        onChange={setStartY}
                        options={startYearOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Mês</FieldLabel>
                      <Select value={mes} onChange={setMes} options={monthOptions} />
                    </Field>
                    <Field>
                      <FieldLabel>Por quantos anos?</FieldLabel>
                      <Select value={anos} onChange={setAnos} options={anosOptions} />
                    </Field>
                  </>
                )}
              </FormBody>

              <ModalButtons>
                <button className="button3" type="button" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="button2" type="submit" disabled={saving}>
                  {saving ? "Salvando..." : editId ? "Salvar" : "Criar"}
                </button>
              </ModalButtons>
            </Form>
          </ModalContent>
        </div>
      )}
    </div>
  );
}

export default Metas;
