import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import Select from "../../components/Select";
import BotaoPadrao from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import financeService from "../../services/financeService";
import { formatBRL } from "../../utils/currency";
import { useToast } from "../../context/toast";
import {
  Container,
  Panel,
  Intro,
  DropZone,
  Toolbar,
  FileTag,
  BulkBar,
  Required,
  TableWrapper,
  Table,
  MovBadge,
  DupTag,
  Footer,
  Empty,
} from "./styles";

const TIPO_OPTIONS = [
  { value: "1", label: "Conta" },
  { value: "2", label: "Investimento" },
  { value: "3", label: "Opcional" },
  { value: "4", label: "Meta" },
];

// Lê o arquivo OFX respeitando o charset declarado no cabeçalho. OFX 1.x
// costuma vir em Windows-1252/Latin-1 (acentos), enquanto 2.x é UTF-8 — ler
// tudo como UTF-8 corromperia "APLICAÇÃO", etc.
async function readOfxText(file) {
  const buf = await file.arrayBuffer();
  const head = new TextDecoder("iso-8859-1").decode(
    new Uint8Array(buf, 0, Math.min(buf.byteLength, 2048))
  );
  const enc = /ENCODING:\s*(\S+)/i.exec(head)?.[1]?.toUpperCase();
  const charset = /CHARSET:\s*(\S+)/i.exec(head)?.[1]?.toUpperCase();

  let label = "windows-1252"; // padrão seguro para OFX 1.x de bancos BR
  if (enc === "UTF-8" || head.includes("<?xml")) label = "utf-8";
  else if (charset && charset.includes("8859")) label = "iso-8859-1";

  return new TextDecoder(label).decode(buf);
}

// Formata "YYYY-MM-DD" -> "DD/MM/YYYY" (sem criar Date, evitando fuso).
const formatDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function ImportarExtrato() {
  const toast = useToast();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]); // transações + { include, tipo }
  const [fileName, setFileName] = useState("");
  const [dueDate, setDueDate] = useState(""); // vencimento da fatura ("YYYY-MM-DD")
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite reenviar o mesmo arquivo
    if (!file) return;

    setLoading(true);
    try {
      const content = await readOfxText(file);
      const { transacoes } = await financeService.importPreview(content);
      if (!transacoes?.length) {
        toast.warning("Nenhuma transação encontrada no arquivo.");
        setRows([]);
        setFileName("");
        return;
      }
      // Débitos (gastos) já vêm marcados; créditos (pagamentos/estornos) e as
      // já importadas (mesmo FITID) vêm desmarcadas. Tipo padrão: Conta.
      setRows(
        transacoes.map((t, i) => ({
          ...t,
          _key: t.fitid || `${t.data}-${i}`,
          include: t.tipo_mov === "DEBITO" && !t.ja_importada,
          tipo: "1",
        }))
      );
      setFileName(file.name);
    } catch (err) {
      console.error("Erro ao importar extrato:", err);
      toast.error(
        err.response?.data?.error ||
        "Não foi possível ler o arquivo. Verifique se é um OFX válido."
      );
    } finally {
      setLoading(false);
    }
  };

  const setRow = (key, patch) =>
    setRows((prev) =>
      prev.map((r) => (r._key === key ? { ...r, ...patch } : r))
    );

  const applyTipoToSelected = (tipo) =>
    setRows((prev) =>
      prev.map((r) => (r.include ? { ...r, tipo } : r))
    );

  const toggleAll = (include) =>
    setRows((prev) => prev.map((r) => ({ ...r, include })));

  const selected = useMemo(() => rows.filter((r) => r.include), [rows]);
  const totalSelected = selected.reduce((s, r) => s + r.valor, 0);

  const clearFile = () => {
    setRows([]);
    setFileName("");
    setDueDate("");
  };

  const handleCommit = async () => {
    if (!selected.length) {
      toast.warning("Selecione ao menos uma transação.");
      return;
    }
    if (!dueDate) {
      toast.warning("Informe o vencimento da fatura (mês do orçamento).");
      return;
    }
    setCommitting(true);
    try {
      const items = selected.map((r) => ({
        de_conta: r.descricao || "Transação importada",
        vl_conta: r.valor.toFixed(2),
        tipo: Number(r.tipo),
        data_compra: r.data, // data original da compra (do OFX)
        data_vencimento: dueDate, // vencimento da fatura → mês no orçamento
        fitid: r.fitid, // dedup no backend
      }));
      const res = await financeService.importCommit(items);
      toast.success(
        `${res.created} lançamento(s) importado(s)` +
        (res.skipped
          ? ` · ${res.skipped} já existia(m) e foi(ram) ignorada(s)`
          : "") +
        "!"
      );
      clearFile();
      navigate("/Financas");
    } catch (err) {
      console.error("Erro ao gravar importação:", err);
      toast.error(
        err.response?.data?.error || "Erro ao importar. Tente novamente."
      );
    } finally {
      setCommitting(false);
    }
  };

  const intro = (
    <Intro>
      Exporte a fatura/extrato do seu cartão no formato <strong>OFX</strong> e
      envie aqui. As transações aparecem numa lista para você revisar, escolher
      o tipo de cada uma (Conta, Investimento, Opcional ou Meta) e confirmar.
      Cada compra é marcada com 💳 e entra no orçamento do{" "}
      <strong>mês do vencimento da fatura</strong> — a data original da compra
      fica guardada como informação.
    </Intro>
  );

  return (
    <div className="frame">
      <MenuNavecacao />
      <Container $centered={rows.length === 0}>
        {rows.length === 0 ? (
          <Panel>
            <TituloPage titulo="Importar Extrato" />
            {intro}
            <DropZone>
              <strong>
                {loading ? "Lendo arquivo…" : "📄 Selecionar arquivo OFX"}
              </strong>
              <span>
                Clique para escolher um arquivo .ofx exportado do seu banco
              </span>
              <input
                type="file"
                accept=".ofx,application/x-ofx,text/plain"
                onChange={handleFile}
                disabled={loading}
              />
            </DropZone>
            {!loading && (
              <Empty>
                O arquivo é lido no seu navegador e só é gravado quando você
                confirmar.
              </Empty>
            )}
          </Panel>
        ) : (
          <>
            <TituloPage titulo="Importar Extrato" />
            {intro}
            <Toolbar>
              <FileTag>
                📄 <strong>{fileName}</strong> · {rows.length} transações
                <button onClick={clearFile}>trocar arquivo</button>
              </FileTag>
              <BulkBar>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
                  title="Mês em que a fatura é paga — as compras entram nesse mês do orçamento"
                >
                  Vencimento da fatura<Required>*</Required>:
                  <span style={{ width: "16rem" }}>
                    <DatePicker
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="dd/mm/aaaa"
                    />
                  </span>
                </span>
                <span>·</span>
                Aplicar tipo às selecionadas:
                <Select
                  value=""
                  onChange={applyTipoToSelected}
                  options={TIPO_OPTIONS}
                  placeholder="Escolher…"
                />
              </BulkBar>
            </Toolbar>

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th className="col-check">
                      <input
                        type="checkbox"
                        checked={selected.length === rows.length}
                        onChange={(e) => toggleAll(e.target.checked)}
                        title="Selecionar todas"
                      />
                    </th>
                    <th>Data da compra</th>
                    <th>Descrição</th>
                    <th>Mov.</th>
                    <th className="col-valor">Valor</th>
                    <th className="col-tipo">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._key} className={r.include ? "" : "excluded"}>
                      <td className="col-check">
                        <input
                          type="checkbox"
                          checked={r.include}
                          onChange={(e) =>
                            setRow(r._key, { include: e.target.checked })
                          }
                        />
                      </td>
                      <td>{formatDate(r.data)}</td>
                      <td className="desc" title={r.descricao}>
                        {r.descricao || "—"}
                        {r.ja_importada && <DupTag>já importada</DupTag>}
                      </td>
                      <td>
                        <MovBadge $credito={r.tipo_mov === "CREDITO"}>
                          {r.tipo_mov === "CREDITO" ? "Crédito" : "Débito"}
                        </MovBadge>
                      </td>
                      <td className="col-valor">{formatBRL(r.valor)}</td>
                      <td className="col-tipo">
                        <Select
                          value={r.tipo}
                          onChange={(v) => setRow(r._key, { tipo: v })}
                          options={TIPO_OPTIONS}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>

            <Footer>
              <div className="summary">
                <strong>{selected.length}</strong> selecionada(s) ·{" "}
                <strong>{formatBRL(totalSelected)}</strong>
              </div>
              <button
                className="button2"
                onClick={handleCommit}
                disabled={committing}
              >
                {committing ? "Importando…" : "Importar selecionadas"}
              </button>
            </Footer>
          </>
        )}
        <Link to="/Financas">
          <BotaoPadrao nomeBotao={"Voltar"} />
        </Link>
      </Container>
    </div>
  );
}

export default ImportarExtrato;
