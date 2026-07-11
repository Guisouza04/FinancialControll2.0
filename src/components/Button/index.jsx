import { StandardButton } from "./styles";

const BotaoPadrao = ({ nomeBotao, variant, type = "button", onClick }) => {
  return (
    <StandardButton variant={variant}>
      <button type={type} onClick={onClick}>
        <span className="text">{nomeBotao}</span>
      </button>
    </StandardButton>
  );
};

export default BotaoPadrao;
