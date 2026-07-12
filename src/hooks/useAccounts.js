import { useState, useEffect, useCallback, useRef } from "react";
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

  // Evita setState após o componente ser desmontado.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Buscar contas
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeService.fetchAccounts(
        tipo,
        filterYear,
        filterMonth
      );
      if (!isMountedRef.current) return;
      setAccounts(data.map(transformAccount));
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Erro ao buscar contas:", err);
      setError(err.message || "Erro ao carregar as contas");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [tipo, filterYear, filterMonth]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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

  // Atualizar status de pagamento de UMA parcela (competência "YYYY-MM").
  // Atualiza a lista `pagamentos` localmente em vez de confiar no formato da
  // resposta — o backend pode devolver a conta inteira ou só o registro.
  const togglePaymentStatus = async (id, competencia, currentPaid) => {
    const newStatus = currentPaid ? "N" : "S";
    try {
      await financeService.updatePaymentStatus(id, competencia, newStatus);
      setAccounts((prev) =>
        prev.map((account) => {
          if (account.id !== id) return account;
          const current = Array.isArray(account.pagamentos)
            ? account.pagamentos
            : [];
          const pagamentos =
            newStatus === "S"
              ? Array.from(new Set([...current, competencia]))
              : current.filter((c) => c !== competencia);
          return { ...account, pagamentos, contaPaga: newStatus };
        })
      );
      return { success: true, status: newStatus };
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
