import { useState, useRef, useEffect, useCallback } from "react";
import {
  Wrapper,
  Trigger,
  Panel,
  Header,
  MonthLabel,
  NavBtn,
  Weekdays,
  Grid,
  DayCell,
  YearGrid,
  YearCell,
  Footer,
} from "./styles";

/**
 * DatePicker customizado no tema dark-glass — substitui o <input type="date">
 * nativo, cujo calendário (popup) o navegador não deixa estilizar.
 *
 * Props:
 *   value       - "YYYY-MM-DD" | "" (string)
 *   onChange    - (value) => void   (recebe "YYYY-MM-DD" ou "" ao limpar)
 *   placeholder - texto quando nada selecionado
 */
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const pad = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" -> { y, m, d } (m 1-based) | null
const parse = (v) => {
  if (!v) return null;
  const [y, m, d] = String(v).split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
};

function DatePicker({ value, onChange, placeholder = "Selecione a data" }) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  // "days" = grade de dias | "years" = grade de anos
  const [mode, setMode] = useState("days");
  const wrapRef = useRef(null);

  const today = new Date();
  const sel = parse(value);

  // Mês exibido no calendário.
  const [view, setView] = useState(() => {
    const s = parse(value);
    return s
      ? { y: s.y, m: s.m }
      : { y: today.getFullYear(), m: today.getMonth() + 1 };
  });

  // Início da página de 12 anos (grade de anos).
  const [yearBase, setYearBase] = useState(() => {
    const s = parse(value);
    const y = s ? s.y : new Date().getFullYear();
    return Math.floor(y / 12) * 12;
  });

  const close = useCallback(() => setOpen(false), []);

  const openMenu = useCallback(() => {
    // Sincroniza o mês visível com o valor atual ao abrir e volta pra visão
    // de dias.
    const s = parse(value);
    const now = new Date();
    setView(
      s ? { y: s.y, m: s.m } : { y: now.getFullYear(), m: now.getMonth() + 1 }
    );
    setMode("days");
    setOpen(true);
  }, [value]);

  // Alterna entre a grade de dias e a de anos (clique no rótulo do cabeçalho).
  const toggleYearMode = () => {
    if (mode === "years") {
      setMode("days");
    } else {
      setYearBase(Math.floor(view.y / 12) * 12);
      setMode("years");
    }
  };

  const chooseYear = (yr) => {
    setView((v) => ({ ...v, y: yr }));
    setMode("days");
  };

  // Fecha ao clicar fora / Esc.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Abre pra cima quando não há espaço suficiente embaixo.
  useEffect(() => {
    if (!open || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setUp(spaceBelow < 360 && rect.top > spaceBelow);
  }, [open]);

  const shiftMonth = (delta) => {
    setView((v) => {
      const idx = v.y * 12 + (v.m - 1) + delta;
      return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
    });
  };

  const choose = (day) => {
    onChange(`${view.y}-${pad(view.m)}-${pad(day)}`);
    close();
  };

  const goToday = () => {
    const t = new Date();
    onChange(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`);
    close();
  };

  const clear = () => {
    onChange("");
    close();
  };

  // Monta a grade do mês (com células vazias no início até o 1º dia da semana).
  const daysInMonth = new Date(view.y, view.m, 0).getDate();
  const firstWeekday = new Date(view.y, view.m - 1, 1).getDay(); // 0 = domingo
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) =>
    sel && sel.y === view.y && sel.m === view.m && sel.d === d;
  const isToday = (d) =>
    today.getFullYear() === view.y &&
    today.getMonth() + 1 === view.m &&
    today.getDate() === d;

  const display = sel ? `${pad(sel.d)}/${pad(sel.m)}/${sel.y}` : "";

  return (
    <Wrapper ref={wrapRef}>
      <Trigger
        type="button"
        $open={open}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (!open && ["Enter", " ", "ArrowDown"].includes(e.key)) {
            e.preventDefault();
            openMenu();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={display ? "" : "placeholder"}>
          {display || placeholder}
        </span>
        <span className="cal-icon" aria-hidden="true">
          📅
        </span>
      </Trigger>

      {open && (
        <Panel className={up ? "up" : ""} role="dialog" aria-label="Calendário">
          <Header>
            <NavBtn
              type="button"
              onClick={() =>
                mode === "years"
                  ? setYearBase((b) => b - 12)
                  : shiftMonth(-1)
              }
              aria-label={mode === "years" ? "Anos anteriores" : "Mês anterior"}
            >
              ‹
            </NavBtn>
            <MonthLabel
              type="button"
              onClick={toggleYearMode}
              aria-label="Selecionar ano"
            >
              {mode === "years"
                ? `${yearBase} – ${yearBase + 11}`
                : `${MONTHS[view.m - 1]} ${view.y}`}
            </MonthLabel>
            <NavBtn
              type="button"
              onClick={() =>
                mode === "years" ? setYearBase((b) => b + 12) : shiftMonth(1)
              }
              aria-label={mode === "years" ? "Próximos anos" : "Próximo mês"}
            >
              ›
            </NavBtn>
          </Header>

          {mode === "years" ? (
            <YearGrid>
              {Array.from({ length: 12 }, (_, i) => yearBase + i).map((yr) => (
                <YearCell
                  key={yr}
                  type="button"
                  $selected={yr === view.y}
                  $current={yr === today.getFullYear()}
                  aria-pressed={yr === view.y}
                  onClick={() => chooseYear(yr)}
                >
                  {yr}
                </YearCell>
              ))}
            </YearGrid>
          ) : (
            <>
              <Weekdays>
                {WEEKDAYS.map((w, i) => (
                  <span key={i}>{w}</span>
                ))}
              </Weekdays>

              <Grid>
                {cells.map((d, i) =>
                  d === null ? (
                    <DayCell
                      key={`e${i}`}
                      type="button"
                      className="empty"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  ) : (
                    <DayCell
                      key={d}
                      type="button"
                      $selected={isSelected(d)}
                      $today={isToday(d)}
                      aria-pressed={isSelected(d)}
                      onClick={() => choose(d)}
                    >
                      {d}
                    </DayCell>
                  )
                )}
              </Grid>
            </>
          )}

          <Footer>
            <button type="button" onClick={goToday}>
              Hoje
            </button>
            {value && (
              <button type="button" onClick={clear}>
                Limpar
              </button>
            )}
          </Footer>
        </Panel>
      )}
    </Wrapper>
  );
}

export default DatePicker;
