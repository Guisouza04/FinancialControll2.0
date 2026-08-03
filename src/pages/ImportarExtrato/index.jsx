import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import TituloPage from "../../components/Title";
import Select from "../../components/Select";
import BotaoPadrao from "../../components/Button";
import DatePicker from "../../components/DatePicker";
import Loader from "../../components/Loader";
import financeService from "../../services/financeService";
import { formatBRL } from "../../utils/currency";
import { matchesSearch } from "../../utils/search";
import { useToast } from "../../context/toast";
// Mesmo campo de busca das tabelas de finanças.
import { SearchInput } from "../../components/ExpenseBox/styles";
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
  const [search, setSearch] = useState(""); // busca por descrição da transação

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

  // Linhas que a busca deixa passar. Ações em massa e o checkbox do cabeçalho
  // agem sobre ELAS, não sobre `rows`: marcar "todas" com a busca ativa não pode
  // mexer no que o usuário não está vendo.
  const visibleRows = useMemo(
    () => rows.filter((r) => matchesSearch(search, r.descricao)),
    [rows, search]
  );
  const visibleKeys = useMemo(
    () => new Set(visibleRows.map((r) => r._key)),
    [visibleRows]
  );

  const applyTipoToSelected = (tipo) =>
    setRows((prev) =>
      prev.map((r) => (r.include && visibleKeys.has(r._key) ? { ...r, tipo } : r))
    );

  const toggleAll = (include) =>
    setRows((prev) =>
      prev.map((r) => (visibleKeys.has(r._key) ? { ...r, include } : r))
    );

  const selected = useMemo(() => rows.filter((r) => r.include), [rows]);
  const totalSelected = selected.reduce((s, r) => s + r.valor, 0);
  // Selecionadas escondidas pela busca — o commit envia essas também, então o
  // rodapé avisa em vez de deixar a conta "não bater" com a tela.
  const hiddenSelected = selected.filter((r) => !visibleKeys.has(r._key)).length;
  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((r) => r.include);

  const clearFile = () => {
    setRows([]);
    setFileName("");
    setDueDate("");
    setSearch("");
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
              {/* Aqui o Loader mantém o rótulo: a zona continua parecendo
                  clicável, e só as bolinhas não diriam que o arquivo está
                  sendo lido — nem que não adianta clicar de novo. */}
              {loading ? (
                <Loader label="Lendo arquivo…" />
              ) : (
                <>
                  <strong>📄 Selecionar arquivo OFX</strong>
                  <span>
                    Clique para escolher um arquivo .ofx exportado do seu banco
                  </span>
                </>
              )}
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
                <SearchInput
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar pela descrição…"
                  aria-label="Buscar transação"
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
                        checked={allVisibleSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                        title={
                          search.trim()
                            ? "Selecionar as transações da busca"
                            : "Selecionar todas"
                        }
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
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        Nenhuma transação com “{search.trim()}”.
                      </td>
                    </tr>
                  )}
                  {visibleRows.map((r) => (
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
                {hiddenSelected > 0 && (
                  <> · {hiddenSelected} fora da busca</>
                )}
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
