import { Wrapper, Mark } from "./styles";

/**
 * Envolve um campo de formulário (input/Input) e exibe um asterisco
 * discreto no canto direito, sinalizando que o preenchimento é obrigatório.
 *
 * Uso:
 *   <RequiredField>
 *     <input ... />
 *   </RequiredField>
 */
export default function RequiredField({ children, className }) {
  return (
    <Wrapper className={className}>
      {children}
      <Mark aria-hidden="true" title="Campo obrigatório">
        *
      </Mark>
    </Wrapper>
  );
}
