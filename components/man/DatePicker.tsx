"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const WD = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MO = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function fmt(v: string) {
  if (!v) return "";
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${MO[m - 1].slice(0, 3)} ${d}, ${y}`;
}
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Minara-designed date picker — replaces the native OS date input + calendar popup. */
export function DatePicker({
  value, defaultValue, onChange, placeholder = "Select a date", className = "", disabled,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const cur = isControlled ? value! : internal;

  const today = new Date();
  const initParts = cur ? cur.split("-").map(Number) : [today.getFullYear(), today.getMonth() + 1, today.getDate()];
  const [view, setView] = useState({ y: initParts[0], m: initParts[1] - 1 });

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  const set = (v: string) => { if (!isControlled) setInternal(v); onChange?.(v); setOpen(false); };
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const prev = () => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  const next = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-[8px] border bg-white px-3.5 py-2.5 t-body outline-none disabled:opacity-50"
        style={{ borderColor: open ? "var(--moss-700)" : "var(--card-edge)", boxShadow: open ? "0 0 0 3px var(--moss-100)" : "none", color: cur ? "var(--ink-900)" : "var(--ink-400)" }}
      >
        <span>{cur ? fmt(cur) : placeholder}</span>
        <Calendar size={16} style={{ color: "var(--ink-400)", flexShrink: 0 }} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 rounded-[12px] border p-3" style={{ background: "#ffffff", borderColor: "var(--card-edge)", boxShadow: "var(--shadow-lift)", width: 280 }}>
          <div className="flex items-center justify-between px-1 pb-2">
            <button type="button" onClick={prev} aria-label="Previous month" className="rounded-lg p-1.5 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-700)" }}><ChevronLeft size={16} /></button>
            <div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{MO[view.m]} {view.y}</div>
            <button type="button" onClick={next} aria-label="Next month" className="rounded-lg p-1.5 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-700)" }}><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {WD.map((w) => <div key={w} className="t-body-xs py-1 text-center" style={{ color: "var(--ink-400)" }}>{w}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const v = iso(view.y, view.m, d);
              const isSel = v === cur;
              const isToday = view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => set(v)}
                  className="flex aspect-square items-center justify-center rounded-lg t-body-sm"
                  style={isSel
                    ? { background: "var(--moss-700)", color: "var(--bone)", fontWeight: 600 }
                    : { color: "var(--ink-700)", fontWeight: isToday ? 700 : 400, background: isToday ? "var(--paper-2)" : "transparent" }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
