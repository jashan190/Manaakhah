"use client";

import { useState } from "react";
import Link from "next/link";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, BadgeCheck, CreditCard, Sparkles, TrendingUp, Check } from "lucide-react";

const FILTERS = ["All", "Leads", "Reviews", "Verification", "Billing"];
const NOTIFS = [
  { Icon: MessageCircle, cat: "Leads", t: "New catering enquiry from Aisha M.", s: "~40 people on March 12", time: "20m", unread: true, tone: "moss", href: "/dashboard/leads" },
  { Icon: Star, cat: "Reviews", t: "New 4★ review from Hassan K.", s: "Awaiting your response", time: "2h", unread: true, tone: "clay", href: "/dashboard/reviews" },
  { Icon: BadgeCheck, cat: "Verification", t: "HFSAA certificate expires in 32 days", s: "Renew to keep your verified Seal", time: "1d", unread: true, tone: "warn", href: "/business/sac-famous-kabob/certification" },
  { Icon: TrendingUp, cat: "Reviews", t: "Profile views up 24% this week", s: "3,142 views · 612 saves", time: "2d", unread: false, tone: "moss", href: "/dashboard/analytics" },
  { Icon: Sparkles, cat: "Leads", t: "Your ‘Friday iftar special’ ended", s: "2,140 reached · 186 clicks", time: "3d", unread: false, tone: "clay", href: "/dashboard/deals" },
  { Icon: CreditCard, cat: "Billing", t: "Pro plan renewed — $29.00", s: "Visa ending 4242 · receipt available", time: "5d", unread: false, tone: "default", href: "/dashboard/subscription" },
];
const toneBg = { moss: "var(--moss-50)", clay: "var(--clay-50)", warn: "#fbedd0", default: "var(--paper-2)" } as const;
const toneFg = { moss: "var(--moss-700)", clay: "var(--clay-700)", warn: "#7a5818", default: "var(--ink-500)" } as const;

export default function OwnerNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [read, setRead] = useState<Record<number, boolean>>({});
  const rows = NOTIFS.filter((n) => filter === "All" || n.cat === filter);

  return (
    <OwnerShell active="notifs">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PH title="Notifications" sub="Leads, reviews, verification and billing activity" />
          <Button variant="outline" size="sm" onClick={() => setRead(Object.fromEntries(NOTIFS.map((_, i) => [i, true])))}><Check className="mr-1.5 h-4 w-4" /> Mark All Read</Button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="t-body-sm rounded-full px-3 py-1.5"
              style={filter === f ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>{f}</button>
          ))}
        </div>

        <ManCard style={{ padding: 0, maxWidth: 760 }}>
          {rows.map((n, i) => {
            const idx = NOTIFS.indexOf(n);
            const unread = n.unread && !read[idx];
            return (
              <Link key={n.t} href={n.href} onClick={() => setRead((p) => ({ ...p, [idx]: true }))}
                className="flex items-start gap-3.5 px-5 py-4 hover:bg-[var(--paper-2)]"
                style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid var(--card-edge)", background: unread ? "var(--moss-50)" : "transparent" }}>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: toneBg[n.tone as keyof typeof toneBg] }}>
                  <n.Icon size={18} style={{ color: toneFg[n.tone as keyof typeof toneFg] }} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="t-label-sm" style={{ color: "var(--ink-900)" }}>{n.t}</span><Tag tone="default">{n.cat}</Tag></div>
                  <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{n.s}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{n.time}</span>
                  {unread && <span className="h-2 w-2 rounded-full" style={{ background: "var(--moss-700)" }} />}
                </div>
              </Link>
            );
          })}
        </ManCard>

        <Link href="/dashboard/settings" className="mt-3 inline-block t-body-sm" style={{ color: "var(--moss-700)" }}>Manage notification preferences →</Link>
      </div>
    </OwnerShell>
  );
}
