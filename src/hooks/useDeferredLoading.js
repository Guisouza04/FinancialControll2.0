import { useEffect, useRef, useState } from "react";

/* Carência: quanto um carregamento pode durar sem merecer um loader na tela.
   Trocar de aba nas telas de finança costuma resolver dentro disso. */
const DEFAULT_DELAY = 500;

/* Permanência mínima: se o loader chegou a aparecer, ele fica pelo menos isto
   na tela. Sem essa trava, um carregamento pouco acima da carência mostrava o
   loader por dois ou três frames — a espera some, mas o lampejo continua. */
const DEFAULT_MIN_DURATION = 600;

/**
 * Decide se o indicador de carregamento deve aparecer.
 *
 * Duas travas contra o pisca:
 * 1. **Carência** — nada aparece antes de `delay` ms carregando.
 * 2. **Permanência mínima** — tendo aparecido, o loader só sai depois de
 *    `minDuration` ms, mesmo que os dados já tenham chegado.
 *
 * O resultado é binário na percepção: ou o loader não aparece, ou ele fica
 * tempo suficiente para ser lido como intencional. O que ele nunca faz é
 * piscar.
 */
export function useDeferredLoading(
  loading,
  { delay = DEFAULT_DELAY, minDuration = DEFAULT_MIN_DURATION } = {}
) {
  const [visible, setVisible] = useState(false);
  // Quando o loader entrou na tela — base da permanência mínima.
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (loading) {
      // Já visível: nada a agendar. Reagendar aqui reescreveria `shownAtRef` e
      // esticaria a permanência mínima a cada render.
      if (visible) return;

      const id = setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, delay);
      return () => clearTimeout(id);
    }

    // Terminou de carregar sem nunca ter mostrado o loader: o caso comum.
    if (!visible) return;

    const remaining = minDuration - (Date.now() - shownAtRef.current);
    if (remaining <= 0) {
      setVisible(false);
      return;
    }
    const id = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(id);
  }, [loading, visible, delay, minDuration]);

  return visible;
}
