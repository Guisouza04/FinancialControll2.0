import { StandardButton } from "./styles";

const BotaoPadrao = ({ nomeBotao, variant }) => {
  return (
    <StandardButton variant={variant}>
      <button>
        <span className="text">{nomeBotao}</span>
      </button>
    </StandardButton>
  );
};

export default BotaoPadrao;
