import { useState } from "react";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "../../utils/tagColors";
import { useToast } from "../../context/toast";
import { useConfirm } from "../../context/confirm";
import {
  Wrapper,
  ChipRow,
  Chip,
  AddButton,
  Empty,
  CreateForm,
  Swatches,
  Swatch,
  CreateActions,
} from "./styles";

/**
 * Seletor de tags para o formulário de lançamento. Permite:
 *  - alternar (selecionar/desselecionar) tags existentes
 *  - criar uma nova tag inline (nome + cor da paleta)
 *  - excluir uma tag do usuário (× no chip, com confirmação) — remove
 *    globalmente, não só deste lançamento
 *
 * Props:
 *   tags        - todas as tags do usuário [{ id, nome, cor }]
 *   selectedIds - number[] das tags marcadas neste lançamento
 *   onToggle    - (id) => void
 *   onCreate    - async ({ nome, cor }) => { success, data?, error? }
 *   onDelete    - async (id) => { success, error? }
 */
function TagPicker({ tags, selectedIds, onToggle, onCreate, onDelete }) {
  const toast = useToast();
  const confirm = useConfirm();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_TAG_COLOR);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setNewName("");
    setNewColor(DEFAULT_TAG_COLOR);
    setCreating(true);
  };

  const cancelCreate = () => {
    setCreating(false);
    setNewName("");
  };

  const submitCreate = async () => {
    const nome = newName.trim();
    if (!nome) {
      toast.warning("Dê um nome para a tag.");
      return;
    }
    setSaving(true);
    const result = await onCreate({ nome, cor: newColor });
    setSaving(false);
    if (result.success) {
      // Já marca a tag recém-criada no lançamento atual.
      onToggle(result.data.id);
      cancelCreate();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (e, tag) => {
    e.stopPropagation(); // não alterna a seleção ao clicar no ×
    const confirmed = await confirm({
      title: "Excluir tag",
      message: `Excluir a tag "${tag.nome}"? Ela será removida de todos os lançamentos.`,
      confirmText: "Excluir",
      danger: true,
    });
    if (!confirmed) return;
    const result = await onDelete(tag.id);
    if (result.success) {
      toast.success("Tag excluída.");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Wrapper>
      <ChipRow>
        {tags.length === 0 && !creating && (
          <Empty>Nenhuma tag ainda — crie a primeira.</Empty>
        )}
        {tags.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          return (
            <Chip
              key={tag.id}
              type="button"
              $color={tag.cor}
              $selected={selected}
              onClick={() => onToggle(tag.id)}
              title={selected ? "Remover deste lançamento" : "Aplicar ao lançamento"}
            >
              <span className="dot" />
              {tag.nome}
              <span
                className="remove"
                role="button"
                aria-label={`Excluir tag ${tag.nome}`}
                title="Excluir tag"
                onClick={(e) => handleDelete(e, tag)}
              >
                ×
              </span>
            </Chip>
          );
        })}
        {!creating && (
          <AddButton type="button" onClick={startCreate}>
            + Nova tag
          </AddButton>
        )}
      </ChipRow>

      {creating && (
        <CreateForm>
          <input
            type="text"
            placeholder="Nome da tag (ex.: Mercado)"
            value={newName}
            maxLength={40}
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitCreate();
              }
            }}
          />
          <Swatches>
            {TAG_COLORS.map((color) => (
              <Swatch
                key={color}
                type="button"
                $color={color}
                $active={color === newColor}
                aria-label={`Cor ${color}`}
                onClick={() => setNewColor(color)}
              />
            ))}
          </Swatches>
          <CreateActions>
            <button className="button3" type="button" onClick={cancelCreate}>
              Cancelar
            </button>
            <button
              className="button2"
              type="button"
              onClick={submitCreate}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Criar tag"}
            </button>
          </CreateActions>
        </CreateForm>
      )}
    </Wrapper>
  );
}

export default TagPicker;
