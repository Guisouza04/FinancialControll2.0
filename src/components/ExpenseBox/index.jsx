import { useState, useEffect } from "react";
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
import { ModalContent } from "./styles";
import { ModalButtons } from "./styles";
import { ModalTitle } from "./styles";
import { PaginationContainer } from "./styles";
import { PaginationButton } from "./styles";

const ExpenseBox = ({ tipo }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  // Estados de filtros
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);

  // Hook customizado para gerenciar contas
  const {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    togglePaymentStatus,
  } = useAccounts(tipo, filterYear, filterMonth);

  // Estados do formulário
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newMonths, setNewMonths] = useState("");

  // Estados de edição
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editMonths, setEditMonths] = useState("");

  // Estados da UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const accountsPerPage = 5;
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1).padStart(2, "0"),
  }));

  // Handlers
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newValue || !newMonths) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const result = await addAccount({
      de_conta: newName,
      vl_conta: newValue.toString(),
      qtd_parcelas: parseInt(newMonths),
    });

    if (result.success) {
      setNewName("");
      setNewValue("");
      setNewMonths("");
      setIsModalOpen(false);
      setCurrentPage(1);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Tem certeza que deseja excluir a conta "${name}"?`))
      return;

    const result = await deleteAccount(id);
    if (result.success) {
      // O ajuste de página é feito centralmente pelo useEffect de clamp,
      // que se baseia em filteredAccounts (lista realmente paginada).
      alert(
        tipo === 2
          ? "Investimento excluído com sucesso!"
          : "Conta excluída com sucesso!"
      );
    } else {
      alert(result.error);
    }
  };

  const handleTogglePayment = async (id, name, currentStatus) => {
    const action = currentStatus === "S" ? "não paga" : "paga";
    if (
      !window.confirm(
        `Tem certeza que deseja marcar a conta "${name}" como ${action}?`
      )
    )
      return;

    const result = await togglePaymentStatus(id, currentStatus);
    if (result.success) {
      alert(`Conta marcada como ${action} com sucesso!`);
    } else {
      alert(result.error);
    }
  };

  const startEditing = (account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditValue(account.value);
    setEditMonths(account.durationMonths);
  };

  const handleSave = async (id) => {
    if (
      !String(editName).trim() ||
      String(editValue).trim() === "" ||
      String(editMonths).trim() === ""
    ) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const result = await updateAccount(id, {
      de_conta: editName,
      vl_conta: editValue.toString(),
      qtd_parcelas: parseInt(editMonths),
    });

    if (result.success) {
      setEditingId(null);
    } else {
      alert(result.error);
    }
  };

  const handleCancel = () => setEditingId(null);

  const handleClearFilters = () => {
    setFilterYear("");
    setFilterMonth("");
  };

  // Funções utilitárias
  const formatParcelas = (account) => {
    if (account.durationMonths === 1) return "1";

    const creationDate = new Date(account.creationMonth + "-01");
    // Usa o período filtrado como referência (quando ano e mês estão definidos);
    // caso contrário, usa a data atual.
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

  // Mantém currentPage dentro do intervalo válido sempre que a lista filtrada
  // mudar (troca de filtro, limpar filtros ou exclusão de itens). Evita ficar
  // preso numa página vazia quando o total de páginas diminui.
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
      <Title>Filtros</Title>
      <FilterContainer>
        <input
          type="text"
          placeholder="Ano (YYYY)"
          value={filterYear}
          onChange={(e) => {
            if (e.target.value.length <= 4 && /^\d*$/.test(e.target.value)) {
              setFilterYear(e.target.value);
            }
          }}
          maxLength={4}
        />
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">Todos os meses</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="button2" onClick={handleClearFilters}>
          Limpar Filtros
        </button>
      </FilterContainer>

      <TableWrapper>
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
          {paginatedAccounts.map((account) => (
            <tr key={account.id}>
              <Td className="name-column">
                {editingId === account.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  account.name
                )}
              </Td>
              <Td className="value-column">
                {editingId === account.id ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  `R$ ${account.value.toFixed(2)}`
                )}
              </Td>
              <Td className="months-column">
                {editingId === account.id ? (
                  <input
                    type="number"
                    value={editMonths}
                    onChange={(e) => setEditMonths(e.target.value)}
                    min="1"
                  />
                ) : (
                  formatParcelas(account)
                )}
              </Td>
              <Td className="status-column">
                <span
                  style={{
                    color: account.contaPaga === "S" ? "#4CAF50" : "#f44336",
                    fontWeight: "bold",
                  }}
                >
                  {account.contaPaga === "S" ? "Paga" : "Pendente"}
                </span>
              </Td>
              <Td className="actions-column">
                {editingId === account.id ? (
                  <>
                    <ActionButton onClick={() => handleSave(account.id)}>
                      ✅
                    </ActionButton>
                    <ActionButton onClick={handleCancel}>❌</ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton onClick={() => startEditing(account)}>
                      ✏️
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDelete(account.id, account.name)}
                    >
                      🗑️
                    </ActionButton>
                    <ActionButton
                      onClick={() =>
                        handleTogglePayment(
                          account.id,
                          account.name,
                          account.contaPaga
                        )
                      }
                      title={
                        account.contaPaga === "S"
                          ? "Marcar como não paga"
                          : "Marcar como paga"
                      }
                    >
                      {account.contaPaga === "S" ? "💰" : "✅"}
                    </ActionButton>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
        </Table>
      </TableWrapper>

      <button
        className="button2"
        id="btnAddExpense"
        onClick={() => setIsModalOpen(true)}
      >
        Adicionar {getTipoLabel()}
      </button>

      {isModalOpen && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>Nova Conta</ModalTitle>
            <Form onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Nome da conta"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Valor"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Meses de duração"
                value={newMonths}
                onChange={(e) => setNewMonths(e.target.value)}
                required
                min="1"
              />
              <ModalButtons>
                <button
                  className="button3"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
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
