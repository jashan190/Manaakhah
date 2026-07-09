"use client";

import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Tag } from "@/components/man/primitives";
import { MiniLine } from "@/components/owner/OwnerShell";
import { ClipboardCheck, MessageSquareWarning, LifeBuoy, Database, ChevronRight, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

const QUEUES = [
  { Icon: ClipboardCheck, t: "Verification queue", s: "12 businesses awaiting review · 3 auto-flagged", href: "/admin/businesses/review-queue", badge: 12, tone: "warn" as const },
  { Icon: MessageSquareWarning, t: "Content moderation", s: "5 flagged reviews · 2 high-confidence", href: "/admin/reviews", badge: 5, tone: "err" as const },
  { Icon: LifeBuoy, t: "Owner support", s: "3 open tickets · 2 high priority", href: "/admin/support", badge: 3, tone: "warn" as const },
  { Icon: Database, t: "Cert sources", s: "5 connected · ISA scraper degraded", href: "/admin/cert-sources", badge: 1, tone: "err" as const },
];

export default function AdminHomePage() {
  return (
    <AdminShell active="home">
      <div className="px-6 py-7 md:px-8">
        <PH title="Trust & Safety Overview" sub="The verification work keeping Minara trustworthy" />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Pending verification" value="12" Icon={Clock} />
          <StatCard label="Seals issued (30d)" value="184" delta="+22%" Icon={ShieldCheck} />
          <StatCard label="Flagged content" value="5" deltaTone="err" delta="needs review" Icon={AlertTriangle} />
          <StatCard label="Avg. review time" value="6.4h" delta="-1.2h" Icon={Clock} />
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid gap-3">
            {QUEUES.map((q) => (
              <Link key={q.t} href={q.href}>
                <ManCard style={{ padding: 20 }} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--paper-2)" }}><q.Icon size={20} style={{ color: "var(--ink-700)" }} /></span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="t-label" style={{ color: "var(--ink-900)" }}>{q.t}</span><Tag tone={q.tone}>{q.badge}</Tag></div>
                    <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{q.s}</div>
                  </div>
                  <ChevronRight size={18} style={{ color: "var(--ink-400)" }} />
                </ManCard>
              </Link>
            ))}
          </div>

          <ManCard style={{ padding: 20 }}>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Seals issued</div>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 4 }}>Last 14 Days</div>
            <div className="mt-4"><MiniLine data={[6, 9, 7, 12, 10, 14, 11, 16, 13, 18, 15, 20, 17, 22]} height={180} /></div>
          </ManCard>
        </div>
      </div>
    </AdminShell>
  );
}
