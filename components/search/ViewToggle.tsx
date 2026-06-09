"use client";

import { LayoutGrid, Columns2 } from "lucide-react";

export type ViewMode = "list" | "split";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const modes = [
    { key: "list" as const, label: "List", Icon: LayoutGrid },
    { key: "split" as const, label: "Split", Icon: Columns2 },
  ];

  return (
    <div className="flex overflow-hidden rounded-lg border" style={{ borderColor: "var(--card-edge)" }}>
      {modes.map((m) => {
        const on = value === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 t-label transition-colors"
            style={on ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "#ffffff", color: "var(--ink-500)" }}
          >
            <m.Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
