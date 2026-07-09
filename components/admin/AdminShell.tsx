"use client";

import Link from "next/link";
import { ShieldCheck, ClipboardCheck, MessageSquareWarning, LifeBuoy, Database, Building2, Users, Activity, Settings } from "lucide-react";

type Item = { k: string; l: string; href: string; Icon: any; badge?: number };
const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "Trust & Safety",
    items: [
      { k: "queue", l: "Verification Queue", href: "/admin/businesses/review-queue", Icon: ClipboardCheck, badge: 12 },
      { k: "moderation", l: "Content Moderation", href: "/admin/reviews", Icon: MessageSquareWarning, badge: 5 },
      { k: "support", l: "Owner Support", href: "/admin/support", Icon: LifeBuoy, badge: 3 },
    ],
  },
  {
    heading: "Data",
    items: [
      { k: "sources", l: "Cert Sources", href: "/admin/cert-sources", Icon: Database },
      { k: "businesses", l: "Businesses", href: "/admin/businesses", Icon: Building2 },
      { k: "users", l: "Users", href: "/admin/users", Icon: Users },
    ],
  },
  {
    heading: "System",
    items: [
      { k: "health", l: "System Health", href: "/admin/system", Icon: Activity },
      { k: "settings", l: "Settings", href: "/admin/settings", Icon: Settings },
    ],
  },
];

export function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ background: "var(--paper)" }}>
      <aside className="hidden w-[236px] flex-shrink-0 flex-col md:flex" style={{ background: "var(--ink-900)", color: "var(--bone)" }}>
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--moss-700)" }}><ShieldCheck size={17} style={{ color: "var(--bone)" }} /></span>
          <div><div className="t-label-sm" style={{ color: "var(--bone)" }}>Admin Console</div><div className="t-body-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Minara Trust</div></div>
        </Link>
        <nav className="flex-1 overflow-auto p-3">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <div className="t-eyebrow px-2.5 pb-1.5 pt-3" style={{ color: "rgba(255,255,255,0.4)" }}>{g.heading}</div>
              {g.items.map((it) => {
                const on = active === it.k;
                return (
                  <Link key={it.k} href={it.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                    style={{ fontSize: 13, fontWeight: 500, color: on ? "var(--bone)" : "rgba(255,255,255,0.7)", background: on ? "rgba(255,255,255,0.1)" : "transparent" }}>
                    <it.Icon size={15} style={{ color: on ? "var(--moss-300, #8ab39b)" : "rgba(255,255,255,0.5)" }} />
                    <span className="flex-1">{it.l}</span>
                    {it.badge != null && <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 10.5, fontWeight: 600, background: "var(--clay-500)", color: "var(--bone)" }}>{it.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="px-5 py-4 t-body-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>Signed in as <span style={{ color: "var(--bone)" }}>Trust team</span></div>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
