import { useState, useEffect } from "react";
import api from "../../services/api";
import { Container } from "./styles";
import { Title } from "./styles";
import { Form } from "./styles";
import { Table } from "./styles";
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
  // Obter mês e ano atuais do sistema
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  const [accounts, setAccounts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newMonths, setNewMonths] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editMonths, setEditMonths] = useState("");
  const [filterYear, setFilterYear] = useState(currentYear); // Inicializa com ano atual
  const [filterMonth, setFilterMonth] = useState(currentMonth); // Inicializa com mês atual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 5;

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1).padStart(2, "0"),
  }));

  // Função para transformar dados da API para o formato do estado
  const transformAccount = (item) => ({
    id: item.id,
    name: item.de_conta,
    value: parseFloat(item.vl_conta),
    creationMonth: new Date(item.dt_create).toISOString().slice(0, 7),
    durationMonths: item.qtd_parcelas,
    tipo: item.tipo,
  });

  // Função para buscar dados de acordo com o tipo e filtros
  const fetchAccounts = async () => {
    try {
      // Define a rota de acordo com o tipo
      const endpoints = {
        1: "/financas/contas",
        2: "/financas/investimentos",
        3: "/financas/opcionais",
        4: "/financas/metas",
      };
      const endpoint = endpoints[tipo] || "/financas";

      console.log(
        `🔍 Buscando em: ${endpoint} (Ano: ${filterYear || "Todos"}, Mês: ${
          filterMonth || "Todos"
        })`
      );

      // Faz a requisição GET com os filtros
      const response = await api.get(endpoint, {
        params: {
          year: filterYear || undefined,
          month: filterMonth || undefined,
        },
      });

      // Transforma os dados recebidos
      const transformedAccounts = response.data.map(transformAccount);
      setAccounts(transformedAccounts);
      setCurrentPage(1);

      console.log("✅ Contas buscadas:", transformedAccounts);
    } catch (error) {
      console.error("❌ Erro ao buscar contas:", error);
      alert("Erro ao carregar as contas. Tente novamente.");
    }
  };

  // Buscar dados quando a página carregar ou filtros mudarem
  useEffect(() => {
    fetchAccounts();
  }, [tipo, filterYear, filterMonth]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newName && newValue && newMonths) {
      try {
        const newAccount = {
          de_conta: newName,
          vl_conta: newValue.toString(),
          qtd_parcelas: parseInt(newMonths),
          tipo: tipo,
        };

        const response = await api.post("/financas/create", newAccount);
        const createdAccount = transformAccount(response.data);

        setAccounts([...accounts, createdAccount]);
        setNewName("");
        setNewValue("");
        setNewMonths("");
        setIsModalOpen(false);
        setCurrentPage(1);

        if (tipo === 2) {
          alert("Investimento adicionado com sucesso!");
        } else {
          alert("Conta adicionada com sucesso!");
        }
        console.log("Conta adicionada com sucesso:", createdAccount);
      } catch (error) {
        console.error("Erro ao adicionar conta:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao adicionar a conta. Tente novamente.";
        alert(errorMessage);
      }
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a conta "${name}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/financas/delete/${id}`);

      const newAccounts = accounts.filter((account) => account.id !== id);
      setAccounts(newAccounts);

      const totalPages = Math.ceil(newAccounts.length / accountsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      if (tipo === 2) {
        alert("Investimento excluído com sucesso!");
      } else {
        alert("Conta excluída com sucesso!");
      }
      console.log("Conta excluída. Total de contas:", newAccounts.length);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert(
        error.response?.data?.error ||
          "Erro ao excluir a conta. Tente novamente."
      );
    }
  };

  const startEditing = (account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditValue(account.value);
    setEditMonths(account.durationMonths);
  };

  const handleSave = async (id) => {
    try {
      const updatedAccount = {
        de_conta: editName,
        vl_conta: editValue.toString(),
        qtd_parcelas: parseInt(editMonths),
        tipo: tipo,
      };
      const response = await api.put(`/financas/${id}`, updatedAccount);
      const updatedAccountData = transformAccount(response.data);
      setAccounts(
        accounts.map((account) =>
          account.id === id ? updatedAccountData : account
        )
      );
      setEditingId(null);
      console.log("Conta editada com sucesso:", updatedAccountData);
    } catch (error) {
      console.error("Erro ao editar conta:", error);
      alert("Erro ao editar a conta. Tente novamente.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

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

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const startIndex = (currentPage - 1) * accountsPerPage;
  const paginatedAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + accountsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      console.log("Mudou para a página:", page);
    }
  };

  // Função para limpar os filtros
  const handleClearFilters = () => {
    setFilterYear("");
    setFilterMonth("");
  };

  // Função para formatar a exibição de parcelas na coluna months-column
  const formatParcelas = (account) => {
    if (account.durationMonths === 1) {
      return "1";
    }
    const creationDate = new Date(account.creationMonth + "-01");
    const currentDate = new Date();
    const startYear = creationDate.getFullYear();
    const startMonth = creationDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsDiff =
      (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1;
    if (monthsDiff <= 0 || monthsDiff > account.durationMonths) {
      return `${account.durationMonths}/${account.durationMonths}`;
    }
    return `${monthsDiff}/${account.durationMonths}`;
  };

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

      <Table>
        <thead>
          <tr>
            <Th className="name-column">Nome</Th>
            <Th className="value-column">Valor</Th>
            <Th className="months-column">Parcela</Th>
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
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <button
        className="button2"
        id="btnAddExpense"
        onClick={() => setIsModalOpen(true)}
      >
        Adicionar
        {tipo === 1
          ? " Conta"
          : tipo === 2
          ? " Investimento"
          : tipo === 3
          ? " Conta"
          : " Meta"}
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
