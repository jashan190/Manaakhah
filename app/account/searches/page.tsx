"use client";

import { useState } from "react";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { PH, ManCard, Tag } from "@/components/man/primitives";
import { Pencil, Trash2 } from "lucide-react";

const initial = [
  { q: "biryani in Natomas", filters: ["Verified", "Open now"], fresh: 3, notify: true },
  { q: "halal grocers near 95833", filters: ["Grocery", "Halal meat"], fresh: 2, notify: true },
  { q: "family-friendly dinner", filters: ["Prayer space", "Kid friendly"], fresh: 0, notify: false },
  { q: "yemeni coffee Folsom", filters: ["Café"], fresh: 0, notify: false },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="man-focus relative h-5 w-9 rounded-full transition-colors" style={{ background: on ? "var(--moss-700)" : "var(--paper-3)" }}>
      <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
    </button>
  );
}

export default function SavedSearchesPage() {
  const [rows, setRows] = useState(initial);
  return (
    <AccountShell active="searches">
      <div className="px-6 py-8 md:px-9">
        <PH title="Saved Searches" sub="We'll alert you when new businesses match" />
        <ManCard>
          {rows.map((r, i) => (
            <div key={r.q} className="flex flex-wrap items-center gap-3 p-4" style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
              <div className="min-w-[200px] flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/search?search=${encodeURIComponent(r.q)}`} className="t-label" style={{ color: "var(--ink-900)" }}>{r.q}</Link>
                  {r.fresh > 0 && <Tag tone="clay">{r.fresh} new</Tag>}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">{r.filters.map((f) => <Tag key={f}>{f}</Tag>)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>Notify</span>
                <Toggle on={r.notify} onClick={() => setRows((p) => p.map((x, j) => (j === i ? { ...x, notify: !x.notify } : x)))} />
              </div>
              <div className="flex items-center gap-1">
                <button className="man-focus rounded-lg p-2 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-500)" }}><Pencil size={16} /></button>
                <button onClick={() => setRows((p) => p.filter((_, j) => j !== i))} className="man-focus rounded-lg p-2 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-500)" }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </ManCard>
      </div>
    </AccountShell>
  );
}
