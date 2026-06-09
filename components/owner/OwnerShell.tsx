"use client";

import Link from "next/link";
import { LayoutGrid, Store, Inbox, Star, Sparkles, Tag, Settings, Info } from "lucide-react";

type Item = { k: string; l: string; href: string; Icon: any; badge?: number };

// Primary — the day-to-day "running your shop" pages
const MAIN: Item[] = [
  { k: "dashboard", l: "Dashboard", href: "/dashboard", Icon: LayoutGrid },
  { k: "profile", l: "Listing & Profile", href: "/dashboard/listing", Icon: Store },
  { k: "leads", l: "Lead Inbox", href: "/dashboard/leads", Icon: Inbox, badge: 3 },
  { k: "reviews", l: "Reviews", href: "/dashboard/reviews", Icon: Star, badge: 2 },
  { k: "promos", l: "Promotions", href: "/dashboard/deals", Icon: Sparkles },
];

// Secondary — account & support, tucked at the bottom
const SECONDARY: Item[] = [
  { k: "billing", l: "Subscription", href: "/dashboard/subscription", Icon: Tag },
  { k: "settings", l: "Settings", href: "/dashboard/settings", Icon: Settings },
  { k: "help", l: "Help & Support", href: "/dashboard/help", Icon: Info },
];

export function OwnerShell({ active, business = "Famous Kabob", children }: { active: string; business?: string; children: React.ReactNode }) {
  const NavItem = ({ it, muted }: { it: Item; muted?: boolean }) => {
    const on = active === it.k;
    return (
      <Link key={it.k} href={it.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--paper-2)]"
        style={{ fontSize: 13.5, fontWeight: on ? 600 : 500, color: on ? "var(--moss-800)" : muted ? "var(--ink-500)" : "var(--ink-700)", background: on ? "var(--moss-50)" : "transparent" }}>
        <it.Icon size={16} style={{ color: on ? "var(--moss-700)" : "var(--ink-400)" }} />
        <span className="flex-1">{it.l}</span>
        {it.badge != null && (
          <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 10.5, fontWeight: 600, background: on ? "var(--moss-700)" : "var(--paper-2)", color: on ? "var(--bone)" : "var(--ink-700)" }}>{it.badge}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ background: "var(--paper)" }}>
      <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[232px] flex-shrink-0 flex-col self-start md:flex" style={{ background: "var(--card)", borderRight: "1px solid var(--card-edge)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
          <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Business</div>
          <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)", marginTop: 2 }}>{business}</div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-auto p-3">
          {MAIN.map((it) => <NavItem key={it.k} it={it} />)}
        </nav>

        <div className="space-y-0.5 p-3" style={{ borderTop: "1px solid var(--card-edge)" }}>
          {SECONDARY.map((it) => <NavItem key={it.k} it={it} muted />)}
        </div>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/* Mini sparkline used on owner dashboards */
export function MiniLine({ data, height = 180 }: { data: number[]; height?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 92 - 4}`);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      <polyline fill="none" stroke="var(--moss-700)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" points={pts.join(" ")} vectorEffect="non-scaling-stroke" />
      <polyline fill="var(--moss-50)" stroke="none" points={`0,100 ${pts.join(" ")} 100,100`} opacity={0.6} />
    </svg>
  );
}
