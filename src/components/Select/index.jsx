import { useState, useRef, useEffect, useCallback } from "react";
import { Wrapper, Trigger, Chevron, Panel, OptionItem } from "./styles";

/**
 * Select customizado no tema dark-glass (substitui o <select> nativo, cuja
 * lista aberta não é estilizável).
 *
 * Props:
 *   value      - valor atual (comparado como string)
 *   onChange   - (value) => void   (recebe o valor direto, não um evento)
 *   options    - [{ value, label }]
 *   placeholder- texto quando nada selecionado
 */
function Select({ value, onChange, options = [], placeholder = "Selecione" }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);

  const selectedIndex = options.findIndex(
    (o) => String(o.value) === String(value)
  );
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const close = useCallback(() => setOpen(false), []);

  const openMenu = useCallback(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  const choose = useCallback(
    (val) => {
      onChange(val);
      setOpen(false);
    },
    [onChange]
  );

  // Fecha ao clicar fora / Esc
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, close]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[activeIndex]) choose(options[activeIndex].value);
    }
  };

  return (
    <Wrapper ref={wrapRef}>
      <Trigger
        type="button"
        $open={open}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron $open={open} aria-hidden="true">
          ▾
        </Chevron>
      </Trigger>

      {open && (
        <Panel role="listbox">
          {options.map((o, i) => (
            <OptionItem
              key={String(o.value)}
              role="option"
              aria-selected={String(o.value) === String(value)}
              $selected={String(o.value) === String(value)}
              $active={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(o.value)}
            >
              {o.label}
            </OptionItem>
          ))}
        </Panel>
      )}
    </Wrapper>
  );
}

export default Select;
