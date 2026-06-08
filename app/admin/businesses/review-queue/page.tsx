"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Photo, Tag, Seal } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle2, FileWarning, Search, ChevronRight } from "lucide-react";

const FILTERS = ["All", "New", "Needs docs", "Auto-flagged", "Re-verification"];
const QUEUE = [
  { id: "sac-famous-kabob", n: "Famous Kabob", city: "Sacramento, CA", cat: "Restaurant", body: "HFSAA", state: "New", risk: "low", waited: "4h", note: "Owner-submitted · certificate attached" },
  { id: "sac-sinbad-market", n: "Sinbad Mediterranean Market", city: "Sacramento, CA", cat: "Grocery", body: "HMS", state: "Needs docs", risk: "med", waited: "1d", note: "Certificate image unreadable" },
  { id: "sac-aria-afghan", n: "Aria Afghan Cuisine", city: "West Sacramento, CA", cat: "Restaurant", body: "HFSAA", state: "Auto-flagged", risk: "high", waited: "2d", note: "Cert number not found in HFSAA registry" },
  { id: "sac-shalimar", n: "Shalimar Restaurant", city: "Sacramento, CA", cat: "Restaurant", body: "Self-certified", state: "New", risk: "med", waited: "6h", note: "Self-certified — needs manual review" },
  { id: "sac-qamaria", n: "Qamaria Yemeni Coffee", city: "Sacramento, CA", cat: "Café", body: "HFSAA", state: "Re-verification", risk: "low", waited: "3d", note: "Annual renewal due" },
];
const riskTone = { low: "ok", med: "warn", high: "err" } as const;

export default function VerificationQueuePage() {
  const [filter, setFilter] = useState("All");
  const rows = filter === "All" ? QUEUE : QUEUE.filter((r) => r.state === filter);

  return (
    <AdminShell active="queue">
      <div className="px-6 py-7 md:px-8">
        <PH title="Verification Queue" sub="Review halal certification before the Seal goes live" />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Awaiting review" value="12" Icon={Clock} />
          <StatCard label="Auto-flagged" value="3" delta="needs attention" deltaTone="err" Icon={AlertTriangle} />
          <StatCard label="Approved today" value="18" delta="+5" Icon={CheckCircle2} />
          <StatCard label="Avg. review time" value="6.4h" delta="-1.2h" Icon={FileWarning} />
        </div>

        <div className="my-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="t-body-sm rounded-full px-3 py-1.5"
              style={filter === f ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>{f}</button>
          ))}
          <div className="ml-auto flex items-center gap-2 rounded-[10px] border bg-white px-3 py-1.5" style={{ borderColor: "var(--card-edge)" }}>
            <Search size={15} style={{ color: "var(--ink-400)" }} /><input placeholder="Search business" className="w-40 bg-transparent t-body-sm outline-none" style={{ color: "var(--ink-900)" }} />
          </div>
        </div>

        <ManCard style={{ padding: 0 }}>
          <div className="hidden grid-cols-[2.4fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 t-eyebrow md:grid" style={{ color: "var(--ink-500)", borderBottom: "1px solid var(--card-edge)" }}>
            <span>Business</span><span>Cert body</span><span>Status</span><span>Risk</span><span>Waiting</span>
          </div>
          {rows.map((r, i) => (
            <Link key={r.id} href={`/admin/businesses/${r.id}`} className="block px-5 py-3.5 hover:bg-[var(--paper-2)] md:grid md:grid-cols-[2.4fr_1fr_1fr_1fr_auto] md:items-center md:gap-4" style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
              <div className="flex items-center gap-3">
                <Photo seed={r.id} w={48} h={40} radius={8} />
                <div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{r.n}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{r.city} · {r.cat} · {r.note}</div></div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 md:contents">
                <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{r.body}</span>
                <span><Tag tone={r.state === "Auto-flagged" ? "err" : r.state === "Needs docs" ? "warn" : "moss"}>{r.state}</Tag></span>
                <span><Tag tone={riskTone[r.risk as keyof typeof riskTone]}>{r.risk} risk</Tag></span>
                <span className="flex items-center gap-2 t-body-sm md:ml-0 ml-auto" style={{ color: "var(--ink-500)" }}>{r.waited} <ChevronRight size={15} /></span>
              </div>
            </Link>
          ))}
        </ManCard>
      </div>
    </AdminShell>
  );
}
