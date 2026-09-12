import { createPortal } from "react-dom";

/* Renderiza um modal DIRETO no <body>, fora da árvore de quem o abriu.
 *
 * Motivo: superfícies de vidro (`backdrop-filter`) criam um **stacking context**
 * e viram o containing block de `position: fixed`. Um overlay renderizado dentro
 * de uma delas fica preso ali — o `z-index: 1000` do `.modalOverlay` passa a
 * valer só dentro daquela caixa, e qualquer irmão da caixa que ganhe um
 * `transform` (o hover do botão "Voltar", por exemplo) é pintado POR CIMA do
 * modal. O portal tira o overlay de dentro da caixa e o devolve ao contexto raiz.
 */
const ModalPortal = ({ children }) => createPortal(children, document.body);

export default ModalPortal;
