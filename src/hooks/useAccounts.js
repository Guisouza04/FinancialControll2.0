import { useState, useEffect } from "react";
import financeService, { transformAccount } from "../services/financeService";

/**
 * Hook customizado para gerenciar operações de contas
 * @param {number} tipo - Tipo da conta (1: contas, 2: investimentos, 3: opcionais, 4: metas)
 * @param {string} filterYear - Ano para filtrar
 * @param {string} filterMonth - Mês para filtrar
 * @returns {Object} Estado e funções para gerenciar contas
 */
export const useAccounts = (tipo, filterYear = "", filterMonth = "") => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar contas
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeService.fetchAccounts(
        tipo,
        filterYear,
        filterMonth
      );
      const transformedAccounts = data.map(transformAccount);
      setAccounts(transformedAccounts);
    } catch (err) {
      console.error("Erro ao buscar contas:", err);
      setError(err.message || "Erro ao carregar as contas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [tipo, filterYear, filterMonth]);

  // Adicionar conta
  const addAccount = async (accountData) => {
    try {
      const createdAccount = await financeService.createAccount({
        ...accountData,
        tipo,
      });
      const transformedAccount = transformAccount(createdAccount);
      setAccounts((prev) => [...prev, transformedAccount]);
      return { success: true, data: transformedAccount };
    } catch (err) {
      console.error("Erro ao adicionar conta:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao adicionar a conta",
      };
    }
  };

  // Atualizar conta
  const updateAccount = async (id, accountData) => {
    try {
      const updatedAccount = await financeService.updateAccount(id, {
        ...accountData,
        tipo,
      });
      const transformedAccount = transformAccount(updatedAccount);
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === id ? transformedAccount : account
        )
      );
      return { success: true, data: transformedAccount };
    } catch (err) {
      console.error("Erro ao atualizar conta:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao atualizar a conta",
      };
    }
  };

  // Deletar conta
  const deleteAccount = async (id) => {
    try {
      await financeService.deleteAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao deletar a conta",
      };
    }
  };

  // Atualizar status de pagamento
  const togglePaymentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "S" ? "N" : "S";
    try {
      const updatedAccount = await financeService.updatePaymentStatus(
        id,
        newStatus
      );
      const transformedAccount = transformAccount(updatedAccount);
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === id ? transformedAccount : account
        )
      );
      return { success: true, data: transformedAccount, status: newStatus };
    } catch (err) {
      console.error("Erro ao atualizar status de pagamento:", err);
      return {
        success: false,
        error:
          err.response?.data?.error || "Erro ao atualizar status de pagamento",
      };
    }
  };

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    togglePaymentStatus,
  };
};

export default useAccounts;
