import { useId } from "react";
import { Wrapper, Dots, Counter } from "./styles";

/* Máximo de bolinhas na tela. Ímpar de propósito: assim a página atual fica no
   meio da janela. Acima disso vira uma janela deslizante — 40 bolinhas ninguém
   conta de olho, e elas estourariam a largura da tabela. */
const MAX_DOTS = 7;

/* Fatia de páginas visível: todas, se couberem; senão, uma janela centrada na
   atual, presa nas pontas (nunca passa de 1 nem do total). */
function windowOfPages(totalPages, currentPage) {
  if (totalPages <= MAX_DOTS) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const half = Math.floor(MAX_DOTS / 2);
  const start = Math.min(
    Math.max(currentPage - half, 1),
    totalPages - MAX_DOTS + 1
  );
  return Array.from({ length: MAX_DOTS }, (_, i) => start + i);
}

/**
 * Indicador de páginas em bolinhas — substitui o "Página X de Y".
 *
 * São `<input type="radio">` de verdade, não divs: um grupo de radio já vem com
 * navegação por ← → no teclado e leitura correta em leitor de tela, de graça.
 */
const PageDots = ({ totalPages, currentPage, onChange }) => {
  /* Precisa ser único: dois grupos com o mesmo `name` na página se tornariam um
     grupo só, e selecionar num apagaria a seleção do outro. */
  const groupName = useId();

  if (!totalPages || totalPages < 1) return null;

  const pages = windowOfPages(totalPages, currentPage);
  const truncated = totalPages > MAX_DOTS;
  const first = pages[0];
  const last = pages[pages.length - 1];

  /* Ponta da janela que não é ponta de verdade → dot menor, sinalizando que a
     lista continua para aquele lado. */
  const isEdge = (page) =>
    truncated && ((page === first && page !== 1) || (page === last && page !== totalPages));

  return (
    <Wrapper>
      <Dots role="radiogroup" aria-label="Selecionar página">
        {pages.map((page) => (
          <input
            key={page}
            type="radio"
            name={groupName}
            checked={page === currentPage}
            onChange={() => onChange(page)}
            aria-label={`Página ${page} de ${totalPages}`}
            title={`Página ${page}`}
            data-edge={isEdge(page) ? "true" : undefined}
          />
        ))}
      </Dots>
      {truncated && (
        <Counter>
          {currentPage} / {totalPages}
        </Counter>
      )}
    </Wrapper>
  );
};

export default PageDots;
