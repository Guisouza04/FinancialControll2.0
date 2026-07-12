import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import { Container } from "./styles";
import { Title } from "./styles";
import { Form } from "./styles";
import { Table } from "./styles";
import { TableWrapper } from "./styles";
import { Th } from "./styles";
import { Td } from "./styles";
import { ActionButton } from "./styles";
import { FilterContainer } from "./styles";
import { MonthNavButton } from "./styles";
import { Toolbar } from "./styles";
import { ModalContent } from "./styles";
import { FormBody } from "./styles";
import { Field } from "./styles";
import { FieldLabel } from "./styles";
import { CheckboxField } from "./styles";
import { SectionLabel } from "./styles";
import { TotalBar } from "./styles";
import { FaturaTag } from "./styles";
import { ModalButtons } from "./styles";
import { ModalTitle } from "./styles";
import { PaginationContainer } from "./styles";
import { PaginationButton } from "./styles";
import {
  formatBRL,
  formatDigitsAsBRL,
  digitsToApiValue,
  reaisToDigits,
  hasPositiveValue,
} from "../../utils/currency";
import {
  RECURRENCE,
  RECURRENCE_OPTIONS,
  MAX_ANUAL_YEARS,
  validateRecurrence,
  buildRecurrencePayload,
  deriveRecurrenceForm,
  isActiveInPeriod,
  occurrenceLabel,
  occurrenceCompetencia,
  isPaidInPeriod,
} from "../../utils/recurrence";
import Select from "../Select";
import RequiredField from "../RequiredField";
import { useToast } from "../../context/toast";
import { useConfirm } from "../../context/confirm";

// Tipos de finança selecionáveis no modal (o usuário pode cadastrar em uma
// seção diferente da página atual). Metas (4) não é criável por aqui.
const TIPO_OPTIONS = [
  { value: "1", label: "Conta" },
  { value: "2", label: "Investimento" },
  { value: "3", label: "Opcional" },
];
const TIPO_SECTION_LABELS = { 1: "Contas", 2: "Investimentos", 3: "Opcionais" };

const ExpenseBox = ({ tipo }) => {
  const toast = useToast();
  const confirm = useConfirm();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  // Estados de filtros
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterStatus, setFilterStatus] = useState(""); // "" | "S" | "N"

  const {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    togglePaymentStatus,
  } = useAccounts(tipo, filterYear, filterMonth);

  // Formulário do modal (add e edição compartilham o mesmo estado)
  const [editId, setEditId] = useState(null); // null = adicionando
  const [formTipo, setFormTipo] = useState(String(tipo)); // tipo de finança escolhido
  const [naFatura, setNaFatura] = useState(false); // já incluída na fatura de um cartão
  const [name, setName] = useState("");
  const [valueDigits, setValueDigits] = useState("");
  const [recorrencia, setRecorrencia] = useState(RECURRENCE.MENSAL);
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState(currentMonth);
  const [fimMes, setFimMes] = useState("12");
  const [anos, setAnos] = useState("1");
  const [startY, setStartY] = useState(currentYear);
  const [startM, setStartM] = useState(currentMonth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Itens por página calculados dinamicamente pela altura disponível da tabela.
  const [accountsPerPage, setAccountsPerPage] = useState(8);
  const tableWrapperRef = useRef(null);

  // Mede a área da tabela e calcula quantas linhas cabem (recalcula ao
  // redimensionar). Mantém a tabela sempre "cheia" em qualquer altura.
  useLayoutEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;

    const measure = () => {
      const node = tableWrapperRef.current;
      if (!node) return;
      const head = node.querySelector("thead");
      const row = node.querySelector("tbody tr");
      const headH = head?.offsetHeight ?? 48;
      const rowH = row?.offsetHeight ?? 44;
      const available = node.clientHeight - headH;
      const fit = Math.max(1, Math.floor(available / rowH));
      setAccountsPerPage((prev) => (prev !== fit ? fit : prev));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [loading, accounts.length]);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: monthNames[i],
  }));
  const monthFilterOptions = [
    { value: "", label: "Todos os meses" },
    ...monthOptions,
  ];
  // Anos disponíveis no filtro: janela de currentYear+5 .. currentYear-5
  // (mais recentes/futuros primeiro). Select evita a busca disparada a cada
  // dígito que o input de ano causava.
  const currentYearNum = currentDate.getFullYear();
  const yearFilterOptions = Array.from({ length: 11 }, (_, i) => {
    const y = String(currentYearNum + 5 - i);
    return { value: y, label: y };
  });
  const statusOptions = [
    { value: "", label: "Todas" },
    { value: "S", label: "Pagas" },
    { value: "N", label: "Pendentes" },
  ];
  const yearOptions = Array.from({ length: MAX_ANUAL_YEARS }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i + 1 === 1 ? "ano" : "anos"}`,
  }));
  // Anos de calendário para a data de início da conta (a conta nem sempre
  // começa no mês/ano em que está sendo cadastrada): currentYear-5 .. +10.
  const startYearOptions = Array.from({ length: 16 }, (_, i) => {
    const y = String(currentYearNum - 5 + i);
    return { value: y, label: y };
  });

  const monthLabel = (mm) => monthNames[parseInt(mm, 10) - 1] || "";

  // ------- Modal (add / edição) -------
  const resetForm = () => {
    setFormTipo(String(tipo));
    setNaFatura(false);
    setName("");
    setValueDigits("");
    setRecorrencia(RECURRENCE.MENSAL);
    setDia("");
    setMes(currentMonth);
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

  const openEditModal = (account) => {
    const d = deriveRecurrenceForm(account);
    setFormTipo(String(account.tipo ?? tipo));
    setNaFatura(Boolean(account.naFatura));
    setName(account.name);
    setValueDigits(reaisToDigits(account.value));
    setRecorrencia(d.recorrencia);
    setDia(d.dia);
    setMes(d.mes);
    setFimMes(d.fimMes);
    setAnos(d.anos);
    setStartY(d.startYear);
    setStartM(d.startMonth);
    setEditId(account.id);
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
      toast.warning("Por favor, preencha nome e valor!");
      return;
    }

    const recErr = validateRecurrence({
      recorrencia,
      dia,
      mes,
      anos,
      fimMes,
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
      fimMes,
      startYear: startY,
      startMonth: startM,
    });

    const chosenTipo = parseInt(formTipo, 10);
    const payload = {
      de_conta: name,
      vl_conta: digitsToApiValue(valueDigits),
      tipo: chosenTipo,
      na_fatura: naFatura,
      ...recurrence,
    };

    const result = editId
      ? await updateAccount(editId, payload)
      : await addAccount(payload);

    if (result.success) {
      const sameSection = chosenTipo === tipo;
      // Ao adicionar na mesma seção, navega o filtro para a 1ª ocorrência
      // (garante que a conta apareça). Na edição, mantém o filtro atual.
      if (!editId && sameSection) {
        const [sy, sm] = recurrence.data_inicio.split("-");
        setFilterYear(sy);
        setFilterMonth(sm);
        setCurrentPage(1);
      }
      // Se o usuário escolheu outra seção, a conta não aparece nesta lista —
      // avisa onde ela foi parar.
      if (!sameSection) {
        toast.success(`Salvo em ${TIPO_SECTION_LABELS[chosenTipo] || "outra seção"}.`);
      }
      closeModal();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id, accountName) => {
    const confirmed = await confirm({
      title: "Excluir conta",
      message: `Tem certeza que deseja excluir a conta "${accountName}"?`,
      confirmText: "Excluir",
      danger: true,
    });
    if (!confirmed) return;

    const result = await deleteAccount(id);
    if (result.success) {
      toast.success(
        tipo === 2
          ? "Investimento excluído com sucesso!"
          : "Conta excluída com sucesso!"
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleTogglePayment = async (account) => {
    // O status agora é por parcela: precisamos da competência (mês/ano) exibida.
    const competencia = occurrenceCompetencia(account, filterYear, filterMonth);
    if (!competencia) {
      toast.warning(
        "Selecione um mês específico no filtro para marcar a parcela como paga."
      );
      return;
    }

    const isPaid = isPaidInPeriod(account, filterYear, filterMonth);
    const action = isPaid ? "não paga" : "paga";
    const [cy, cm] = competencia.split("-");
    const confirmed = await confirm({
      title: "Alterar status da parcela",
      message: `Marcar a parcela de ${monthLabel(cm)}/${cy} da conta "${account.name}" como ${action}?`,
      confirmText: "Confirmar",
    });
    if (!confirmed) return;

    const result = await togglePaymentStatus(account.id, competencia, isPaid);
    if (result.success) {
      toast.success(`Parcela marcada como ${action} com sucesso!`);
    } else {
      toast.error(result.error);
    }
  };

  const handleCurrentDate = () => {
    setFilterYear(currentYear);
    setFilterMonth(currentMonth);
  };

  // Navegação de período: avança/retrocede um mês, virando o ano quando passa
  // de dez/jan. Base no mês selecionado (ou no atual, se "Todos os meses").
  // Limitada à janela do seletor de ano (currentYear-5 .. +5).
  const minPeriodIdx = (currentYearNum - 5) * 12; // jan do ano mínimo
  const maxPeriodIdx = (currentYearNum + 5) * 12 + 11; // dez do ano máximo
  const currentPeriodIdx =
    parseInt(filterYear || currentYear, 10) * 12 +
    (parseInt(filterMonth || currentMonth, 10) - 1);
  const canGoPrev = currentPeriodIdx > minPeriodIdx;
  const canGoNext = currentPeriodIdx < maxPeriodIdx;

  const shiftPeriod = (delta) => {
    const target = currentPeriodIdx + delta;
    if (target < minPeriodIdx || target > maxPeriodIdx) return;
    setFilterYear(String(Math.floor(target / 12)));
    setFilterMonth(String((target % 12) + 1).padStart(2, "0"));
    setCurrentPage(1);
  };

  // Coluna "Parcela": rótulo da ocorrência
  const formatParcelas = (account) => {
    if (account.recorrencia) {
      return occurrenceLabel(account, filterYear, filterMonth);
    }

    // Legado: baseado em qtd_parcelas/creationMonth.
    if (account.durationMonths === 1) return "1";

    const creationDate = new Date(account.creationMonth + "-01");
    const referenceDate =
      filterYear && filterMonth
        ? new Date(parseInt(filterYear), parseInt(filterMonth) - 1)
        : new Date();
    const monthsDiff =
      (referenceDate.getFullYear() - creationDate.getFullYear()) * 12 +
      (referenceDate.getMonth() - creationDate.getMonth()) +
      1;

    if (monthsDiff <= 0 || monthsDiff > account.durationMonths) {
      return `${account.durationMonths}/${account.durationMonths}`;
    }
    return `${monthsDiff}/${account.durationMonths}`;
  };

  const getTipoLabel = () => {
    const labels = { 1: "Conta", 2: "Investimento", 3: "Conta", 4: "Meta" };
    return labels[tipo] || "Item";
  };

  // Filtrar contas
  const filteredAccounts = accounts.filter((account) => {
    // Filtro por status de pagamento — avaliado por competência (parcela).
    if (filterStatus) {
      const paid = isPaidInPeriod(account, filterYear, filterMonth) ? "S" : "N";
      if (paid !== filterStatus) return false;
    }

    // Contas com recorrência usam a regra (UNICA/MENSAL/ANUAL).
    if (account.recorrencia) {
      return isActiveInPeriod(account, filterYear, filterMonth);
    }

    // Legado: janela de meses consecutivos a partir do creationMonth.
    const [startYear, startMonth] = account.creationMonth
      .split("-")
      .map(Number);
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(startYear, startMonth - 1);
    endDate.setMonth(endDate.getMonth() + account.durationMonths);

    const filterYearNum = filterYear ? parseInt(filterYear) : null;
    const filterMonthNum = filterMonth ? parseInt(filterMonth) : null;
    const filterDate =
      filterYearNum && filterMonthNum
        ? new Date(filterYearNum, filterMonthNum - 1)
        : null;

    if (filterYearNum && filterMonthNum && filterDate) {
      return filterDate >= startDate && filterDate < endDate;
    } else if (filterYearNum) {
      return (
        startYear <= filterYearNum && endDate.getFullYear() >= filterYearNum
      );
    } else if (filterMonthNum) {
      const accountMonths = Array.from(
        { length: account.durationMonths },
        (_, i) => {
          const date = new Date(startYear, startMonth - 1 + i);
          return date.getMonth() + 1;
        }
      );
      return accountMonths.includes(filterMonthNum);
    }
    return true;
  });

  // Total do período: soma o valor das ocorrências visíveis, EXCLUINDO as que
  // já estão numa fatura de cartão (senão contariam em dobro com a linha da
  // fatura). O que está em fatura é somado à parte, só como informação.
  const totalPayable = filteredAccounts
    .filter((a) => !a.naFatura)
    .reduce((sum, a) => sum + a.value, 0);
  const totalInFatura = filteredAccounts
    .filter((a) => a.naFatura)
    .reduce((sum, a) => sum + a.value, 0);
  const totalLabel = tipo === 2 ? "Total investido" : "Total a pagar";
  const periodLabel = filterMonth
    ? `${monthLabel(filterMonth)}/${filterYear}`
    : filterYear;

  // Paginação
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const startIndex = (currentPage - 1) * accountsPerPage;
  const paginatedAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + accountsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <Container>
        <Title>Carregando...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Toolbar>
        <FilterContainer>
          <Select
            value={filterYear}
            onChange={setFilterYear}
            options={yearFilterOptions}
            placeholder="Ano"
          />
          <Select
            value={filterMonth}
            onChange={setFilterMonth}
            options={monthFilterOptions}
            placeholder="Todos os meses"
          />
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
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={statusOptions}
            placeholder="Todas"
          />
          <button className="button2" onClick={handleCurrentDate}>
            {filterYear !== currentYear ? "Data Atual" : "Mês Atual"}
          </button>
        </FilterContainer>
        <button className="button2" onClick={openAddModal}>
          Adicionar {getTipoLabel()}
        </button>
      </Toolbar>

      <TableWrapper ref={tableWrapperRef}>
        <Table>
          <thead>
            <tr>
              <Th className="name-column">Nome</Th>
              <Th className="value-column">Valor</Th>
              <Th className="months-column">Parcela</Th>
              <Th className="status-column">Status</Th>
              <Th className="actions-column">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.map((account) => {
              const paid = isPaidInPeriod(account, filterYear, filterMonth);
              return (
                <tr key={account.id}>
                  <Td className="name-column">
                    {account.name}
                    {account.naFatura && (
                      <FaturaTag title="Já está na fatura de um cartão — não soma no total a pagar">
                        💳 na fatura
                      </FaturaTag>
                    )}
                  </Td>
                  <Td className="value-column">{formatBRL(account.value)}</Td>
                  <Td className="months-column">{formatParcelas(account)}</Td>
                  <Td className="status-column">
                    <span
                      style={{
                        color: paid ? "#4CAF50" : "#f44336",
                        fontWeight: "bold",
                      }}
                    >
                      {paid ? "Paga" : "Pendente"}
                    </span>
                  </Td>
                  <Td className="actions-column">
                    <ActionButton
                      title="Editar"
                      onClick={() => openEditModal(account)}
                    >
                      ✏️
                    </ActionButton>
                    <ActionButton
                      title="Excluir"
                      onClick={() => handleDelete(account.id, account.name)}
                    >
                      🗑️
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleTogglePayment(account)}
                      title={
                        paid ? "Marcar como não paga" : "Marcar como paga"
                      }
                    >
                      {paid ? "💰" : "✅"}
                    </ActionButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      <TotalBar>
        <span className="total-label">
          {totalLabel} ({periodLabel}):
        </span>
        <span className="total-value">{formatBRL(totalPayable)}</span>
        {totalInFatura > 0 && (
          <span className="total-hint">
            + {formatBRL(totalInFatura)} em faturas de cartão (já contabilizados
            na linha da fatura)
          </span>
        )}
      </TotalBar>

      {isModalOpen && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>{editId ? "Editar Conta" : "Nova Conta"}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormBody>
                <Field $full>
                  <FieldLabel>Nome</FieldLabel>
                  <RequiredField>
                    <input
                      type="text"
                      placeholder="Nome da conta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </RequiredField>
                </Field>

                <Field>
                  <FieldLabel>Valor</FieldLabel>
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
                  <FieldLabel>Tipo de finança</FieldLabel>
                  <Select
                    value={formTipo}
                    onChange={setFormTipo}
                    options={TIPO_OPTIONS}
                  />
                </Field>

                <Field>
                  <FieldLabel>Recorrência</FieldLabel>
                  <Select
                    value={recorrencia}
                    onChange={setRecorrencia}
                    options={RECURRENCE_OPTIONS}
                  />
                </Field>

                <Field>
                  <FieldLabel>Dia do vencimento</FieldLabel>
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

                <CheckboxField>
                  <input
                    type="checkbox"
                    checked={naFatura}
                    onChange={(e) => setNaFatura(e.target.checked)}
                  />
                  Esta conta já está dentro da fatura de um cartão (não soma no
                  total a pagar)
                </CheckboxField>

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
                      <Select
                        value={mes}
                        onChange={setMes}
                        options={monthOptions}
                      />
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
                      <FieldLabel>Até o mês (de {startY})</FieldLabel>
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
                      <Select
                        value={mes}
                        onChange={setMes}
                        options={monthOptions}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Por quantos anos?</FieldLabel>
                      <Select
                        value={anos}
                        onChange={setAnos}
                        options={yearOptions}
                      />
                    </Field>
                  </>
                )}
              </FormBody>

              <ModalButtons>
                <button className="button3" type="button" onClick={closeModal}>
                  Cancelar
                </button>
                <button className="button2" type="submit">
                  Salvar
                </button>
              </ModalButtons>
            </Form>
          </ModalContent>
        </div>
      )}

      {filteredAccounts.length > 0 && (
        <PaginationContainer>
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="button2"
          >
            Anterior
          </PaginationButton>
          <span style={{ fontSize: "1.2rem", fontWeight: "500" }}>
            Página {currentPage} de {totalPages}
          </span>
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="button2"
          >
            Próxima
          </PaginationButton>
        </PaginationContainer>
      )}
    </Container>
  );
};

export default ExpenseBox;
