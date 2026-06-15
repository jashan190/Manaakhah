"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Plus, Globe } from "lucide-react";

const SOURCES = [
  { n: "HFSAA", full: "Halal Food Standards Alliance of America", type: "API", status: "Healthy", certs: "1,842", last: "12 min ago", ok: true },
  { n: "HMS", full: "Halal Monitoring Services", type: "API", status: "Healthy", certs: "640", last: "18 min ago", ok: true },
  { n: "IFANCA", full: "Islamic Food & Nutrition Council", type: "Scraper", status: "Healthy", certs: "1,204", last: "1h ago", ok: true },
  { n: "ISA", full: "Islamic Services of America", type: "Scraper", status: "Degraded", certs: "388", last: "9h ago", ok: false },
  { n: "Self-certified", full: "Owner-declared, manual review", type: "Manual", status: "Manual", certs: "212", last: "—", ok: true },
];

export default function CertSourcesPage() {
  return (
    <AdminShell active="sources">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PH title="Certification Sources" sub="Registries we cross-check against during verification" />
          <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Source</Button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Connected sources" value="5" Icon={Database} />
          <StatCard label="Certs indexed" value="4,286" delta="+128 this week" Icon={CheckCircle2} />
          <StatCard label="Sources degraded" value="1" delta="ISA scraper" deltaTone="err" Icon={AlertTriangle} />
          <StatCard label="Last full sync" value="1h" Icon={RefreshCw} />
        </div>

        <ManCard style={{ padding: 0, marginTop: 20 }}>
          <div className="hidden grid-cols-[2.2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 t-eyebrow md:grid" style={{ color: "var(--ink-500)", borderBottom: "1px solid var(--card-edge)" }}>
            <span>Source</span><span>Type</span><span>Status</span><span>Certs</span><span>Last sync</span>
          </div>
          {SOURCES.map((s, i) => (
            <div key={s.n} className="block px-5 py-3.5 md:grid md:grid-cols-[2.2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4" style={{ borderBottom: i === SOURCES.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--paper-2)" }}><Globe size={16} style={{ color: "var(--ink-700)" }} /></span>
                <div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{s.n}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{s.full}</div></div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 md:contents">
                <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{s.type}</span>
                <span><Tag tone={s.ok ? (s.status === "Manual" ? "moss" : "ok") : "err"}>{s.status}</Tag></span>
                <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{s.certs}</span>
                <div className="flex items-center gap-2 md:ml-0 ml-auto">
                  <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>{s.last}</span>
                  <button className="rounded-lg p-1.5 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-500)" }}><RefreshCw size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </ManCard>
      </div>
    </AdminShell>
  );
}
