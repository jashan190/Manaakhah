"use client";

import { useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { PH, ManCard } from "@/components/man/primitives";
import { Sparkles, MessageCircle, ShieldCheck, ThumbsUp, Star, Bell } from "lucide-react";

const filters = ["All", "Unread", "Saved searches", "Messages", "Reviews"];

type N = { Icon: any; tone: string; title: string; sub: string; time: string; unread?: boolean };
const groups: { label: string; items: N[] }[] = [
  {
    label: "Today",
    items: [
      { Icon: Sparkles, tone: "clay", title: "3 new matches for ‘biryani in Natomas’", sub: "Shalimar, Tandoori Nights and 1 more match your saved search", time: "2h ago", unread: true },
      { Icon: MessageCircle, tone: "moss", title: "Famous Kabob replied to your message", sub: "“Yes, we have a prayer space upstairs — see you Friday!”", time: "5h ago", unread: true },
    ],
  },
  {
    label: "Earlier",
    items: [
      { Icon: ShieldCheck, tone: "moss", title: "Adam's International Market renewed its halal certification", sub: "HFSAA · valid through 2027", time: "3d ago" },
      { Icon: ThumbsUp, tone: "moss", title: "12 people found your review of Aria Afghan helpful", sub: "Your review is now featured on their profile", time: "5d ago" },
      { Icon: Star, tone: "clay", title: "Sinbad Market & Bakery added new photos", sub: "From a list you saved", time: "1w ago" },
    ],
  },
];

const TONE: Record<string, { bg: string; fg: string }> = {
  moss: { bg: "var(--moss-50)", fg: "var(--moss-700)" },
  clay: { bg: "var(--clay-50)", fg: "var(--clay-700)" },
};

export default function NotificationsPage() {
  const [active, setActive] = useState("All");
  return (
    <AccountShell active="notifs">
      <div className="px-6 py-8 md:px-9">
        <PH title="Notifications" sub="Updates from your saved searches, messages and the businesses you follow" />
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setActive(f)} className="man-focus t-body-sm rounded-full px-3 py-1.5"
              style={active === f ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "#ffffff", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>{f}</button>
          ))}
        </div>

        {groups.map((g) => (
          <div key={g.label} className="mb-6">
            <div className="t-eyebrow mb-2" style={{ color: "var(--ink-500)" }}>{g.label}</div>
            <ManCard>
              {g.items.map((n, i) => (
                <div key={i} className="flex items-start gap-3.5 px-[18px] py-4"
                  style={{ borderBottom: i === g.items.length - 1 ? "none" : "1px solid var(--card-edge)", background: n.unread ? "var(--moss-50)" : "transparent" }}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: TONE[n.tone].bg }}>
                    <n.Icon size={16} style={{ color: TONE[n.tone].fg }} />
                  </div>
                  <div className="flex-1">
                    <div className="t-label" style={{ color: "var(--ink-900)" }}>{n.title}</div>
                    <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{n.sub}</div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="t-body-xs" style={{ color: "var(--ink-400)" }}>{n.time}</span>
                    {n.unread && <span className="h-2 w-2 rounded-full" style={{ background: "var(--clay-500)" }} />}
                  </div>
                </div>
              ))}
            </ManCard>
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
