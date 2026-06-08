"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Tag } from "@/components/man/primitives";
import { MiniLine } from "@/components/owner/OwnerShell";
import { Activity, Server, Database, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

const SERVICES = [
  { n: "Web app (Next.js)", status: "Operational", uptime: "99.98%", ok: true },
  { n: "API / database (Neon)", status: "Operational", uptime: "99.95%", ok: true },
  { n: "Search index", status: "Operational", uptime: "99.99%", ok: true },
  { n: "Cert sync workers", status: "Degraded", uptime: "97.2%", ok: false },
  { n: "Image CDN", status: "Operational", uptime: "100%", ok: true },
  { n: "Email / notifications", status: "Operational", uptime: "99.9%", ok: true },
];
const INCIDENTS = [
  { t: "ISA scraper timing out", sev: "Minor", when: "Today 09:12", state: "Investigating" },
  { t: "Elevated API latency (resolved)", sev: "Minor", when: "Jun 3, 14:20", state: "Resolved" },
  { t: "Scheduled DB maintenance", sev: "Maintenance", when: "May 28, 02:00", state: "Completed" },
];

export default function SystemHealthPage() {
  return (
    <AdminShell active="health">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PH title="System Health" sub="Platform status, performance and incidents" />
          <Tag tone="warn">1 service degraded</Tag>
        </div>

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Overall uptime (30d)" value="99.9%" Icon={Activity} />
          <StatCard label="Avg. response time" value="142ms" delta="-12ms" Icon={Zap} />
          <StatCard label="Requests / min" value="3,420" delta="+8%" Icon={Server} />
          <StatCard label="Error rate" value="0.04%" delta="+0.01%" deltaTone="err" Icon={AlertTriangle} />
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1fr_1.4fr]">
          {/* Services */}
          <ManCard style={{ padding: 0 }}>
            <div className="px-5 py-3.5 t-h4" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--card-edge)" }}>Services</div>
            {SERVICES.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: i === SERVICES.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.ok ? "var(--moss-700)" : "var(--clay-500)" }} />
                <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{s.n}</div></div>
                <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{s.uptime}</span>
                <Tag tone={s.ok ? "ok" : "warn"}>{s.status}</Tag>
              </div>
            ))}
          </ManCard>

          {/* Traffic chart */}
          <ManCard style={{ padding: 22 }}>
            <div className="flex items-baseline justify-between">
              <div><div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Requests / min</div><div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 4 }}>Last 24 hours</div></div>
              <span className="inline-flex items-center gap-1 t-body-sm" style={{ color: "var(--moss-700)" }}><CheckCircle2 size={14} /> Healthy</span>
            </div>
            <div className="mt-4"><MiniLine data={[1200, 1800, 1600, 2100, 2600, 2400, 3100, 2900, 3400, 3200, 3600, 3420]} height={180} /></div>
          </ManCard>
        </div>

        {/* Incidents */}
        <ManCard style={{ padding: 0, marginTop: 14 }}>
          <div className="px-5 py-3.5 t-h4" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--card-edge)" }}>Recent incidents</div>
          {INCIDENTS.map((inc, i) => (
            <div key={inc.t} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: i === INCIDENTS.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: inc.state === "Investigating" ? "var(--clay-50)" : "var(--paper-2)" }}>{inc.state === "Investigating" ? <AlertTriangle size={14} style={{ color: "var(--clay-700)" }} /> : <Database size={14} style={{ color: "var(--ink-500)" }} />}</span>
              <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{inc.t}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{inc.when}</div></div>
              <Tag tone={inc.sev === "Maintenance" ? "moss" : "warn"}>{inc.sev}</Tag>
              <Tag tone={inc.state === "Investigating" ? "warn" : "ok"}>{inc.state}</Tag>
            </div>
          ))}
        </ManCard>
      </div>
    </AdminShell>
  );
}
