import api from "./api";

/**
 * Serviço para gerenciar operações financeiras
 */
const financeService = {
  /**
   * Busca contas/investimentos/opcionais/metas de acordo com o tipo e filtros
   * @param {number} tipo - 1: contas, 2: investimentos, 3: opcionais, 4: metas
   * @param {string} year - Ano para filtrar (opcional)
   * @param {string} month - Mês para filtrar (opcional)
   * @returns {Promise<Array>} Lista de contas
   */
  async fetchAccounts(tipo, year = null, month = null) {
    const endpoints = {
      1: "/financas/contas",
      2: "/financas/investimentos",
      3: "/financas/opcionais",
      4: "/financas/metas",
    };

    const endpoint = endpoints[tipo] || "/financas";

    const response = await api.get(endpoint, {
      params: {
        year: year || undefined,
        month: month || undefined,
      },
    });

    return response.data;
  },

  /**
   * Cria uma nova conta
   * @param {Object} accountData - Dados da conta
   * @param {string} accountData.de_conta - Nome da conta
   * @param {string} accountData.vl_conta - Valor da conta
   * @param {number} accountData.qtd_parcelas - Quantidade de parcelas
   * @param {number} accountData.tipo - Tipo da conta
   * @returns {Promise<Object>} Conta criada
   */
  async createAccount(accountData) {
    const response = await api.post("/financas/create", accountData);
    return response.data;
  },

  /**
   * Atualiza uma conta existente
   * @param {number} id - ID da conta
   * @param {Object} accountData - Dados atualizados da conta
   * @returns {Promise<Object>} Conta atualizada
   */
  async updateAccount(id, accountData) {
    const response = await api.put(`/financas/update/${id}`, accountData);
    return response.data;
  },

  /**
   * Deleta uma conta
   * @param {number} id - ID da conta
   * @returns {Promise<void>}
   */
  async deleteAccount(id) {
    await api.delete(`/financas/delete/${id}`);
  },

  /**
   * Atualiza o status de pagamento de UMA parcela (competência) da conta.
   *
   * Contrato (modelo A — tabela `pagamentos`): o backend faz upsert em
   * `pagamentos(conta_id, competencia, pago)`. Marcar como paga (`"S"`) insere/
   * ativa a linha da competência; `"N"` remove/desativa. O status deixa de ser
   * um único campo na conta e passa a ser por mês/ano.
   *
   * @param {number} id - ID da conta
   * @param {string} competencia - Competência da parcela ("YYYY-MM")
   * @param {string} status - Status de pagamento ('S' ou 'N')
   * @returns {Promise<Object>} Conta atualizada
   */
  async updatePaymentStatus(id, competencia, status) {
    const response = await api.put(`/financas/payment-status/${id}`, {
      competencia,
      conta_paga: status,
    });
    // Alguns endpoints aninham o objeto em `data`, outros retornam direto.
    // Tolera ambos os formatos para manter consistência com create/update.
    return response.data?.data ?? response.data;
  },
};

/**
 * Transforma dados da API para o formato usado no frontend
 * @param {Object} item - Item da API
 * @returns {Object} Item transformado
 */
export const transformAccount = (item) => ({
  id: item.id,
  name: item.de_conta,
  value: parseFloat(item.vl_conta),
  creationMonth: new Date(item.dt_create).toISOString().slice(0, 7),
  durationMonths: item.qtd_parcelas,
  tipo: item.tipo,
  contaPaga: item.conta_paga || "N",
  // Competências pagas ("YYYY-MM") — status por parcela (modelo A). Quando o
  // backend ainda não envia, fica null e a UI cai no `contaPaga` legado.
  pagamentos: Array.isArray(item.pagamentos) ? item.pagamentos : null,
  // Campos de recorrência (backend em alinhamento). Ausentes em registros legados.
  recorrencia: item.recorrencia || null,
  diaVencimento: item.dia_vencimento ?? null,
  dataInicio: item.data_inicio || null,
  dataFim: item.data_fim || null,
});

export default financeService;
