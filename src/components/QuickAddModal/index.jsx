import { useState } from "react";
import financeService from "../../services/financeService";
import { useTags } from "../../hooks/useTags";
import {
  formatDigitsAsBRL,
  digitsToApiValue,
  hasPositiveValue,
} from "../../utils/currency";
import {
  RECURRENCE,
  RECURRENCE_OPTIONS,
  MAX_ANUAL_YEARS,
  validateRecurrence,
  buildRecurrencePayload,
} from "../../utils/recurrence";
import Select from "../Select";
import RequiredField from "../RequiredField";
import TagPicker from "../TagPicker";
import { useToast } from "../../context/toast";
// Reaproveita os estilos do modal do ExpenseBox para consistência visual total
// (mesmo grid, mesmos labels alinhados à esquerda).
import {
  ModalContent,
  Form,
  FormBody,
  Field,
  FieldLabel,
  CheckboxField,
  SectionLabel,
  TagField,
  ModalButtons,
  ModalTitle,
} from "../ExpenseBox/styles";

// Tipos de finança criáveis (Metas/4 não é criável por aqui, igual ao ExpenseBox).
const TIPO_OPTIONS = [
  { value: "1", label: "Conta" },
  { value: "2", label: "Investimento" },
  { value: "3", label: "Opcional" },
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/**
 * Modal de criação rápida de lançamento, acionado do Dashboard (⚡) — evita ter
 * que navegar até as telas de Finanças. Cria via `financeService.createAccount`
 * e chama `onCreated(tipo)` para o Dashboard recarregar os dados daquele tipo.
 *
 * Props:
 *   onClose   - () => void
 *   onCreated - (tipo:number) => void  (após salvar com sucesso)
 */
function QuickAddModal({ onClose, onCreated }) {
  const toast = useToast();
  const { tags, addTag, removeTag } = useTags();

  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [formTipo, setFormTipo] = useState("1");
  const [naFatura, setNaFatura] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [name, setName] = useState("");
  const [valueDigits, setValueDigits] = useState("");
  const [recorrencia, setRecorrencia] = useState(RECURRENCE.MENSAL);
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState(currentMonth);
  const [fimMes, setFimMes] = useState("12");
  const [anos, setAnos] = useState("1");
  const [startY, setStartY] = useState(currentYear);
  const [startM, setStartM] = useState(currentMonth);
  const [saving, setSaving] = useState(false);

  const currentYearNum = now.getFullYear();
  const monthOptions = MONTH_NAMES.map((label, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label,
  }));
  const startYearOptions = Array.from({ length: 16 }, (_, i) => {
    const y = String(currentYearNum - 5 + i);
    return { value: y, label: y };
  });
  const anosOptions = Array.from({ length: MAX_ANUAL_YEARS }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} ${i + 1 === 1 ? "ano" : "anos"}`,
  }));

  const toggleTag = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleRemoveTag = async (id) => {
    const result = await removeTag(id);
    if (result.success) {
      setSelectedTagIds((prev) => prev.filter((t) => t !== id));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !hasPositiveValue(valueDigits)) {
      toast.warning("Por favor, preencha nome e valor!");
      return;
    }

    const recErr = validateRecurrence({
      recorrencia,
      dia,
      mes,
      anos,
      fimMes,
      startMonth: startM,
    });
    if (recErr) {
      toast.warning(recErr);
      return;
    }

    const recurrence = buildRecurrencePayload({
      recorrencia,
      dia,
      mes,
      anos,
      fimMes,
      startYear: startY,
      startMonth: startM,
    });

    const chosenTipo = parseInt(formTipo, 10);
    const payload = {
      de_conta: name,
      vl_conta: digitsToApiValue(valueDigits),
      tipo: chosenTipo,
      na_fatura: naFatura,
      tag_ids: selectedTagIds,
      ...recurrence,
    };

    setSaving(true);
    try {
      await financeService.createAccount(payload);
      const label =
        TIPO_OPTIONS.find((o) => o.value === formTipo)?.label || "Lançamento";
      toast.success(`${label} criado com sucesso!`);
      onCreated?.(chosenTipo);
      onClose();
    } catch (err) {
      console.error("Erro ao criar lançamento:", err);
      toast.error(err.response?.data?.error || "Erro ao criar o lançamento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modalOverlay">
      <ModalContent className="defaultModal">
        <ModalTitle>⚡ Novo lançamento rápido</ModalTitle>
        <Form onSubmit={handleSubmit}>
          <FormBody>
            <Field $full>
              <FieldLabel>Nome</FieldLabel>
              <RequiredField>
                <input
                  type="text"
                  placeholder="Nome da conta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </RequiredField>
            </Field>

            <Field>
              <FieldLabel>Valor</FieldLabel>
              <RequiredField>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={formatDigitsAsBRL(valueDigits)}
                  onChange={(e) =>
                    setValueDigits(e.target.value.replace(/\D/g, ""))
                  }
                />
              </RequiredField>
            </Field>

            <Field>
              <FieldLabel>Tipo de finança</FieldLabel>
              <Select
                value={formTipo}
                onChange={setFormTipo}
                options={TIPO_OPTIONS}
              />
            </Field>

            <Field>
              <FieldLabel>Recorrência</FieldLabel>
              <Select
                value={recorrencia}
                onChange={setRecorrencia}
                options={RECURRENCE_OPTIONS}
              />
            </Field>

            <Field>
              <FieldLabel>Dia do vencimento</FieldLabel>
              <RequiredField>
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="1–31"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                />
              </RequiredField>
            </Field>

            <CheckboxField>
              <input
                type="checkbox"
                checked={naFatura}
                onChange={(e) => setNaFatura(e.target.checked)}
              />
              É uma compra de cartão de crédito (marca com 💳)
            </CheckboxField>

            <SectionLabel>Tags</SectionLabel>
            <TagField>
              <TagPicker
                tags={tags}
                selectedIds={selectedTagIds}
                onToggle={toggleTag}
                onCreate={addTag}
                onDelete={handleRemoveTag}
              />
            </TagField>

            <SectionLabel>Período</SectionLabel>

            {recorrencia === RECURRENCE.UNICA && (
              <>
                <Field>
                  <FieldLabel>Ano</FieldLabel>
                  <Select
                    value={startY}
                    onChange={setStartY}
                    options={startYearOptions}
                  />
                </Field>
                <Field>
                  <FieldLabel>Mês</FieldLabel>
                  <Select value={mes} onChange={setMes} options={monthOptions} />
                </Field>
              </>
            )}

            {recorrencia === RECURRENCE.MENSAL && (
              <>
                <Field>
                  <FieldLabel>Ano de início</FieldLabel>
                  <Select
                    value={startY}
                    onChange={setStartY}
                    options={startYearOptions}
                  />
                </Field>
                <Field>
                  <FieldLabel>Mês de início</FieldLabel>
                  <Select
                    value={startM}
                    onChange={setStartM}
                    options={monthOptions}
                  />
                </Field>
                <Field>
                  <FieldLabel>Até o mês (de {startY})</FieldLabel>
                  <Select
                    value={fimMes}
                    onChange={setFimMes}
                    options={monthOptions}
                  />
                </Field>
              </>
            )}

            {recorrencia === RECURRENCE.ANUAL && (
              <>
                <Field>
                  <FieldLabel>Ano de início</FieldLabel>
                  <Select
                    value={startY}
                    onChange={setStartY}
                    options={startYearOptions}
                  />
                </Field>
                <Field>
                  <FieldLabel>Mês</FieldLabel>
                  <Select value={mes} onChange={setMes} options={monthOptions} />
                </Field>
                <Field>
                  <FieldLabel>Por quantos anos?</FieldLabel>
                  <Select value={anos} onChange={setAnos} options={anosOptions} />
                </Field>
              </>
            )}
          </FormBody>

          <ModalButtons>
            <button className="button3" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button2" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Criar"}
            </button>
          </ModalButtons>
        </Form>
      </ModalContent>
    </div>
  );
}

export default QuickAddModal;
