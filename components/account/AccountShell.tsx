"use client";

import Link from "next/link";
import { useMockSession } from "@/components/mock-session-provider";
import { Avatar } from "@/components/man/primitives";
import { User, Bookmark, Search, Inbox, Bell, Settings, Info } from "lucide-react";

type Item = { k: string; l: string; href: string; Icon: any; badge?: number };
const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "Account",
    items: [
      { k: "home", l: "Account Home", href: "/account", Icon: User },
      { k: "saved", l: "Saved Lists", href: "/account/lists", Icon: Bookmark, badge: 3 },
      { k: "searches", l: "Saved Searches", href: "/account/searches", Icon: Search },
      { k: "inbox", l: "Inbox", href: "/inbox", Icon: Inbox, badge: 2 },
      { k: "notifs", l: "Notifications", href: "/notifications", Icon: Bell, badge: 5 },
    ],
  },
  {
    heading: "You",
    items: [
      { k: "settings", l: "Settings", href: "/account/settings", Icon: Settings },
      { k: "help", l: "Help & Support", href: "/account/help", Icon: Info },
    ],
  },
];

export function AccountShell({ active, children }: { active: string; children: React.ReactNode }) {
  const { data: session } = useMockSession();
  const name = session?.user?.name || "Your account";
  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ background: "var(--paper)" }}>
      {/* Sidebar */}
      <aside className="hidden w-[232px] flex-shrink-0 flex-col md:flex" style={{ background: "var(--card)", borderRight: "1px solid var(--card-edge)" }}>
        <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
          <Avatar name={name} size={32} />
          <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{name}</div>
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
