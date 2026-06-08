"use client";

import Link from "next/link";
import { BarChart3, Store, TrendingUp, Inbox, Star, Sparkles, Tag, Bell, Settings, Info } from "lucide-react";

type Item = { k: string; l: string; href: string; Icon: any; badge?: number };
const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "Run Your Shop",
    items: [
      { k: "dashboard", l: "Dashboard", href: "/dashboard", Icon: BarChart3 },
      { k: "profile", l: "Listing & Profile", href: "/dashboard/listing", Icon: Store },
      { k: "analytics", l: "Analytics", href: "/dashboard/analytics", Icon: TrendingUp },
      { k: "leads", l: "Lead Inbox", href: "/dashboard/leads", Icon: Inbox, badge: 3 },
      { k: "reviews", l: "Reviews", href: "/dashboard/reviews", Icon: Star, badge: 2 },
      { k: "promos", l: "Promotions & Events", href: "/dashboard/deals", Icon: Sparkles },
    ],
  },
  {
    heading: "Account",
    items: [
      { k: "billing", l: "Subscription", href: "/dashboard/subscription", Icon: Tag },
      { k: "notifs", l: "Notifications", href: "/dashboard/notifications", Icon: Bell },
      { k: "settings", l: "Settings", href: "/dashboard/settings", Icon: Settings },
      { k: "help", l: "Help & Support", href: "/dashboard/help", Icon: Info },
    ],
  },
];

export function OwnerShell({ active, business = "Famous Kabob", children }: { active: string; business?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ background: "var(--paper)" }}>
      <aside className="hidden w-[232px] flex-shrink-0 flex-col md:flex" style={{ background: "var(--card)", borderRight: "1px solid var(--card-edge)" }}>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
          <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Business</div>
          <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)", marginTop: 2 }}>{business}</div>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <div className="t-eyebrow px-2.5 pb-1.5 pt-3" style={{ color: "var(--ink-500)" }}>{g.heading}</div>
              {g.items.map((it) => {
                const on = active === it.k;
                return (
                  <Link key={it.k} href={it.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                    style={{ fontSize: 13, fontWeight: 500, color: on ? "var(--moss-800)" : "var(--ink-700)", background: on ? "var(--moss-50)" : "transparent" }}>
                    <it.Icon size={15} style={{ color: on ? "var(--moss-700)" : "var(--ink-500)" }} />
                    <span className="flex-1">{it.l}</span>
                    {it.badge != null && (
                      <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 10.5, fontWeight: 600, background: on ? "var(--moss-700)" : "var(--paper-2)", color: on ? "var(--bone)" : "var(--ink-700)" }}>{it.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
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
