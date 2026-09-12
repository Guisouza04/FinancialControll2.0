import { Wrapper, Dots, Label } from "./styles";

const CIRCLES = [0, 1, 2, 3];

/**
 * Indicador de carregamento — quatro bolas que pulsam em onda.
 *
 * `label` é opcional: com ele, o texto aparece abaixo das bolas e é o que o
 * leitor de tela anuncia; sem ele, o wrapper carrega um "Carregando" próprio.
 * Passar os dois duplicaria o anúncio.
 */
const Loader = ({ label }) => (
  <Wrapper
    role="status"
    aria-live="polite"
    aria-label={label ? undefined : "Carregando"}
  >
    {/* As bolas são decoração pura: quem tem o significado é o `label`/aria. */}
    <Dots aria-hidden="true">
      {CIRCLES.map((i) => (
        <div className="circle" key={i}>
          <div className="dot" />
          <div className="outline" />
        </div>
      ))}
    </Dots>
    {label && <Label>{label}</Label>}
  </Wrapper>
);

export default Loader;
