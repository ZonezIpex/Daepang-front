import React, { useEffect, useMemo, useRef, useState } from "react";

export type SelectOption<V extends string = string> = { value: V; label: string };

interface Props<V extends string = string> {
  value: V;
  onChange: (v: V) => void;
  options: SelectOption<V>[];
  placeholder?: string;
  className?: string;
}

export default function CustomSelect<V extends string = string>({
  value,
  onChange,
  options,
  placeholder = "선택",
  className,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 열릴 때 현재 선택 항목으로 active 이동
  useEffect(() => {
    if (open) {
      const idx = Math.max(
        0,
        options.findIndex((o) => o.value === value)
      );
      setActiveIndex(idx);
    }
  }, [open, options, value]);

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  // 키보드 접근성
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIndex);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`cselect ${open ? "open" : ""} ${className ?? ""}`}
      tabIndex={0}
      role="combobox"
      aria-expanded={open}
      aria-controls="cselect-listbox"
      aria-haspopup="listbox"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className="cselect-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="정렬 선택"
      >
        <span className={`cselect-value ${selected ? "" : "placeholder"}`}>
          {selected?.label ?? placeholder}
        </span>
        <span className="cselect-icon" aria-hidden>▾</span>
      </button>

      {open && (
        <ul id="cselect-listbox" className="cselect-menu" role="listbox">
          {options.map((o, idx) => {
            const selected = value === o.value;
            const active = idx === activeIndex;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={selected}
                className={`cselect-option ${selected ? "selected" : ""} ${active ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()} // focus 유지
                onClick={() => commit(idx)}
              >
                <span>{o.label}</span>
                {selected && <span className="cselect-check" aria-hidden>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
