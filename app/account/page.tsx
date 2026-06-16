"use client";

import Link from "next/link";
import { useMockSession } from "@/components/mock-session-provider";
import { Button } from "@/components/ui/button";
import { AccountShell } from "@/components/account/AccountShell";
import { Avatar, PH, ManCard, StatCard } from "@/components/man/primitives";
import { Pencil, Bookmark, Bell, MessageCircle, ShieldCheck, ChevronRight } from "lucide-react";

const activity = [
  { Icon: Pencil, t: "You reviewed Famous Kabob", s: "★★★★ · 2 weeks ago", href: "/business/sac-famous-kabob" },
  { Icon: Bookmark, t: "Saved Sinbad Market to your Sacramento favorites", s: "1 month ago", href: "/account/lists" },
  { Icon: MessageCircle, t: "Adam's International Market replied to your message", s: "1 month ago", href: "/inbox" },
  { Icon: ShieldCheck, t: "Your saved search 'biryani in Natomas' has 3 new matches", s: "5 weeks ago", href: "/account/searches" },
  { Icon: Bell, t: "Aria Afghan added a new Friday menu", s: "6 weeks ago", href: "/business/sac-aria-afghan-restaurant" },
];

export default function AccountHome() {
  const { data: session } = useMockSession();
  const name = session?.user?.name || "Your account";

  return (
    <AccountShell active="home">
      <div className="px-6 py-8 md:px-9">
        <div className="flex items-start gap-4">
          <Avatar name={name} size={64} />
          <div className="flex-1">
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Account home</div>
            <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 4 }}>{name}</h1>
            <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>Joined 2026 · Sacramento, CA · 18 reviews · 3 saved lists</div>
          </div>
          <Link href="/account/settings"><Button variant="outline" size="sm"><Pencil className="mr-1.5 h-4 w-4" /> Edit Profile</Button></Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Reviews written" value="18" sub="Avg 4.6 rating" Icon={Pencil} />
          <StatCard label="Places saved" value="42" sub="across 3 lists" Icon={Bookmark} />
          <StatCard label="Active alerts" value="6" sub="2 saved searches" Icon={Bell} />
          <StatCard label="Messages" value="2" sub="Famous Kabob replied" Icon={MessageCircle} />
        </div>

        <div className="mt-8">
          <PH title="Recent Activity" />
          <ManCard>
            {activity.map((a, i) => (
              <Link key={i} href={a.href} className="flex items-center gap-3.5 px-5 py-3.5"
                style={{ borderBottom: i === activity.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "var(--moss-50)" }}>
                  <a.Icon size={14} style={{ color: "var(--moss-700)" }} />
                </div>
                <div className="flex-1">
                  <div className="t-body" style={{ color: "var(--ink-900)", fontWeight: 500 }}>{a.t}</div>
                  <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{a.s}</div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--ink-400)" }} />
              </Link>
            ))}
          </ManCard>
        </div>
      </div>
    </AccountShell>
  );
}
