/**
 * Utilitários de moeda (Real brasileiro).
 *
 * A máscara trabalha com uma STRING DE DÍGITOS representando centavos:
 *   "12345" -> 123.45 -> "R$ 123,45"
 * Isso evita ambiguidade de ponto/vírgula enquanto o usuário digita.
 *
 * O backend espera `vl_conta` como string com ponto decimal ("123.45"),
 * então `digitsToApiValue` faz essa conversão na hora de enviar.
 */

// Formata um número em reais como moeda brasileira. 1234.5 -> "R$ 1.234,50"
export const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Formata a string de dígitos (centavos) para exibição no input.
// "" -> "" (mantém o placeholder visível); "12345" -> "R$ 123,45"
export const formatDigitsAsBRL = (digits) => {
  const only = String(digits).replace(/\D/g, "");
  if (!only) return "";
  return formatBRL(parseInt(only, 10) / 100);
};

// Valor enviado ao backend (string com ponto decimal). "12345" -> "123.45"
export const digitsToApiValue = (digits) => {
  const only = String(digits).replace(/\D/g, "");
  return (only ? parseInt(only, 10) / 100 : 0).toFixed(2);
};

// Converte um número em reais para string de dígitos (centavos), usado ao editar.
// 123.45 -> "12345"
export const reaisToDigits = (value) =>
  String(Math.round(Number(value || 0) * 100));

// true se a string de dígitos representa um valor maior que zero.
export const hasPositiveValue = (digits) => {
  const only = String(digits).replace(/\D/g, "");
  return !!only && parseInt(only, 10) > 0;
};
