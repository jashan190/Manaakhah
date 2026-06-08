"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tag as ManTag } from "@/components/man/primitives";
import { X, SlidersHorizontal } from "lucide-react";
import { FilterRail } from "@/components/search/FilterRail";

type Filters = {
  category: string; tags: string[]; distance: string; sort: string; priceRange: string; minRating: string;
};

export function FilterSheet({
  open, onClose, filters, setFilters, clearFilters, resultCount, activeCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (p: Partial<Filters> & Record<string, unknown>) => void;
  clearFilters: () => void;
  resultCount: number;
  activeCount: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} className="fixed inset-0 z-40 transition-opacity"
        style={{ background: "rgba(20,24,22,0.45)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col shadow-2xl transition-transform duration-300"
        style={{ background: "var(--paper)", transform: open ? "translateX(0)" : "translateX(100%)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--card-edge)", background: "var(--card)" }}>
          <div className="flex items-center gap-2"><SlidersHorizontal size={18} style={{ color: "var(--moss-700)" }} /><span className="t-h4" style={{ color: "var(--ink-900)" }}>Filters</span>{activeCount > 0 && <ManTag tone="moss">{activeCount}</ManTag>}</div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-500)" }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-auto px-5">
          <FilterRail filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeCount} />
        </div>

        <div className="flex items-center gap-3 px-5 py-4" style={{ borderTop: "1px solid var(--card-edge)", background: "var(--card)" }}>
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
          <Button className="flex-1" onClick={onClose}>Show {resultCount} result{resultCount === 1 ? "" : "s"}</Button>
        </div>
      </aside>
    </>
  );
}
