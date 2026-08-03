/**
 * Busca textual das listagens (ExpenseBox, Metas, Importação de extrato).
 *
 * A busca é sempre o ÚLTIMO elo da cadeia de filtros: roda sobre o que os
 * filtros de período/status/tag já deixaram passar, nunca sobre a lista crua.
 * Assim digitar "mercado" com Julho selecionado não traz lançamentos de Agosto.
 *
 * Em português, buscar por "educacao" tem que achar "Educação" — o usuário
 * digita rápido e sem acento. Por isso normalizamos os dois lados antes de
 * comparar.
 */

// Marcas de acento que o NFD solta do caractere base (U+0300..U+036F).
const DIACRITICS = /[̀-ͯ]/g;

// "Educação" -> "educacao" (minúsculas, sem acento, sem espaço nas pontas).
export const normalizeText = (str) =>
  String(str ?? "")
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim();

/**
 * true se TODOS os termos digitados aparecem em ALGUM dos campos.
 *
 * Vários termos ("luz casa") funcionam como E, em qualquer ordem — digitar duas
 * palavras estreita a busca em vez de zerá-la quando elas estão em campos
 * diferentes (ex.: nome do lançamento + nome da tag).
 *
 * Termo vazio devolve true: busca em branco não filtra nada.
 */
export const matchesSearch = (term, ...fields) => {
  const words = normalizeText(term).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const haystack = fields.map(normalizeText).join(" ");
  return words.every((w) => haystack.includes(w));
};
