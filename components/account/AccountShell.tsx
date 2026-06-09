"use client";

import Link from "next/link";
import { useMockSession } from "@/components/mock-session-provider";
import { User, Bookmark, Search, Inbox, Settings, Info } from "lucide-react";

type Item = { k: string; l: string; href: string; Icon: any; badge?: number };

// Primary — the things a member uses day to day
const MAIN: Item[] = [
  { k: "home", l: "Account Home", href: "/account", Icon: User },
  { k: "saved", l: "Saved Lists", href: "/account/lists", Icon: Bookmark, badge: 3 },
  { k: "searches", l: "Saved Searches", href: "/account/searches", Icon: Search },
  { k: "inbox", l: "Inbox", href: "/inbox", Icon: Inbox, badge: 2 },
];

// Secondary — account & support, tucked at the bottom
const SECONDARY: Item[] = [
  { k: "settings", l: "Settings", href: "/account/settings", Icon: Settings },
  { k: "help", l: "Help & Support", href: "/account/help", Icon: Info },
];

export function AccountShell({ active, children }: { active: string; children: React.ReactNode }) {
  const { data: session } = useMockSession();
  const name = session?.user?.name || "Your account";

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
          <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Account</div>
          <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)", marginTop: 2 }}>{name}</div>
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
