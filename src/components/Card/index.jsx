import { StyledWrapper } from "./styles";

function Cards({ name, svgContent, variant = "" }) {
  return (
    <StyledWrapper variant={variant}>
      <div className="card">
        <div className="overlay" />
        <div className="circle">{svgContent}</div>
        <p>{name}</p>
      </div>
    </StyledWrapper>
  );
}

export default Cards;
