"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = { value: string; label: string };

/** Manaakhah-designed dropdown — replaces the native <select> OS control. */
export function Select({
  value, defaultValue, onChange, options, placeholder = "Select…", className = "", disabled,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const set = (v: string) => { if (!isControlled) setInternal(v); onChange?.(v); };
  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-[10px] border bg-white px-3.5 py-2.5 t-body outline-none transition-colors disabled:opacity-50"
        style={{ borderColor: open ? "var(--moss-700)" : "var(--card-edge)", color: selected ? "var(--ink-900)" : "var(--ink-400)" }}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} style={{ color: "var(--ink-400)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-[10px] border py-1"
          style={{ background: "#ffffff", borderColor: "var(--card-edge)", boxShadow: "var(--shadow-lift)", maxHeight: 248, overflowY: "auto" }}
          role="listbox"
        >
          {options.map((o) => {
            const on = o.value === current;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => { set(o.value); setOpen(false); }}
                className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left t-body-sm"
                style={{ background: on ? "var(--moss-50)" : "transparent", color: on ? "var(--moss-800)" : "var(--ink-700)" }}
              >
                <span className="truncate">{o.label}</span>
                {on && <Check size={15} style={{ color: "var(--moss-700)", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
