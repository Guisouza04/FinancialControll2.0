import { StyledWrapper } from "./styles";

/**
 * Card das telas de Finanças e Configurações.
 *
 * No repouso mostra só o ícone; no hover o ícone cresce, borra e flutua ao
 * fundo enquanto o texto aparece por cima. `subtitle` e `hint` são opcionais —
 * sem eles o card mostra só o nome.
 */
function Cards({ name, subtitle, hint, svgContent }) {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="img">{svgContent}</div>
        <div className="textBox">
          <p className="text head">{name}</p>
          {subtitle && <span>{subtitle}</span>}
          {hint && <p className="text price">{hint}</p>}
        </div>
      </div>
    </StyledWrapper>
  );
}

export default Cards;
