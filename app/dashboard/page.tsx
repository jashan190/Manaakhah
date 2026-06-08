"use client";

import Link from "next/link";
import { useMockSession } from "@/components/mock-session-provider";
import { Button } from "@/components/ui/button";
import { OwnerShell, MiniLine } from "@/components/owner/OwnerShell";
import { Seal, ManCard, StatCard, Avatar, Rating } from "@/components/man/primitives";
import { ExternalLink, Sparkles, Eye, MessageCircle, Star, TrendingUp, MessageSquare, Tag, ChevronRight } from "lucide-react";

const tasks = [
  { Icon: MessageSquare, t: "Reply to Aisha M.", s: "Catering enquiry · 2h waiting" },
  { Icon: Star, t: "Respond to 4★ review by Hassan K.", s: "Posted 2 days ago" },
  { Icon: Tag, t: "Renew HFSAA certification", s: "32 days remaining" },
];
const leads = [
  { n: "Aisha M.", t: "Catering for ~40 on March 12", time: "2h" },
  { n: "Bilal R.", t: "Reservation for 6, Sat 8pm", time: "5h" },
  { n: "Sara K.", t: "Question about lamb sourcing", time: "1d" },
];
const reviews = [
  { n: "Hassan K.", r: 4, t: "Great kabobs, prayer space was a plus.", time: "2d" },
  { n: "Mariam T.", r: 5, t: "Best mixed grill in Sacramento.", time: "4d" },
];

export default function DashboardPage() {
  const { data: session } = useMockSession();
  const owner = (session?.user?.name || "Yusuf").split(" ")[0];

  return (
    <OwnerShell active="dashboard">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Today · Mon Feb 10</div>
            <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 4 }}>Salaam {owner} — here&apos;s your week</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/business/sac-famous-kabob"><Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-4 w-4" /> View public profile</Button></Link>
            <Link href="/dashboard/deals"><Button size="sm"><Sparkles className="mr-1.5 h-4 w-4" /> New promotion</Button></Link>
          </div>
        </div>

        {/* Verification banner */}
        <ManCard style={{ marginTop: 18, padding: 18, background: "var(--moss-50)", border: "1px solid var(--moss-200)" }} className="flex flex-wrap items-center gap-4">
          <Seal size={28} />
          <div className="flex-1">
            <div className="t-label" style={{ color: "var(--ink-900)" }}>Verified halal · HFSAA active</div>
            <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>Cert expires March 14, 2027 — we&apos;ll remind you 30 days before. Last sync: today 4:30 AM.</div>
          </div>
          <Link href="/business/sac-famous-kabob/certification"><Button variant="outline" size="sm">Manage certification</Button></Link>
        </ManCard>

        {/* KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Profile views" value="3,142" delta="+24%" sub="vs last week" Icon={Eye} />
          <StatCard label="Lead enquiries" value="38" delta="+11%" sub="3 unread" Icon={MessageCircle} />
          <StatCard label="New reviews" value="6" delta="4.7 avg" sub="2 need response" Icon={Star} />
          <StatCard label="Conversion" value="12.1%" delta="-0.8%" deltaTone="err" sub="View → contact" Icon={TrendingUp} />
        </div>

        {/* traffic + tasks */}
        <div className="mt-4 grid gap-3.5 lg:grid-cols-[2fr_1fr]">
          <ManCard style={{ padding: 22 }}>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Profile traffic</div>
                <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 4 }}>Last 14 days</div>
              </div>
              <div className="flex gap-1.5">
                {["Views", "Clicks", "Calls", "Saves"].map((c, i) => (
                  <span key={c} className="t-body-sm rounded-full px-2.5 py-1" style={i === 0 ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--paper-2)", color: "var(--ink-700)" }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="mt-4"><MiniLine data={[40, 55, 48, 70, 62, 88, 78, 92, 85, 110, 102, 130, 118, 142]} height={170} /></div>
          </ManCard>
          <ManCard style={{ padding: 22 }}>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>For your attention</div>
            <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 4 }}>3 things to do</div>
            <div className="mt-3.5 grid gap-3">
              {tasks.map((t) => (
                <div key={t.t} className="flex items-start gap-2.5 pb-3" style={{ borderBottom: "1px dashed var(--card-edge)" }}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--clay-50)" }}><t.Icon size={13} style={{ color: "var(--clay-700)" }} /></div>
                  <div className="flex-1">
                    <div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{t.t}</div>
                    <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{t.s}</div>
                  </div>
                  <ChevronRight size={13} style={{ color: "var(--ink-400)" }} />
                </div>
              ))}
            </div>
          </ManCard>
        </div>

        {/* leads + reviews */}
        <div className="mt-4 grid gap-3.5 lg:grid-cols-2">
          <ManCard style={{ padding: 22 }}>
            <div className="flex items-baseline justify-between">
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Recent enquiries</div>
              <Link href="/dashboard/leads" className="t-body-sm" style={{ color: "var(--moss-700)" }}>View inbox →</Link>
            </div>
            <div className="mt-3.5 grid gap-3">
              {leads.map((l) => (
                <div key={l.n} className="flex items-start gap-2.5">
                  <Avatar name={l.n} size={32} />
                  <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{l.n}</div><div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{l.t}</div></div>
                  <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{l.time}</span>
                </div>
              ))}
            </div>
          </ManCard>
          <ManCard style={{ padding: 22 }}>
            <div className="flex items-baseline justify-between">
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Latest reviews</div>
              <Link href="/dashboard/reviews" className="t-body-sm" style={{ color: "var(--moss-700)" }}>Respond →</Link>
            </div>
            <div className="mt-3.5 grid gap-3.5">
              {reviews.map((rv) => (
                <div key={rv.n} className="pb-3" style={{ borderBottom: "1px dashed var(--card-edge)" }}>
                  <div className="flex items-center justify-between"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{rv.n}</div><Rating value={rv.r} /></div>
                  <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>{rv.t}</div>
                </div>
              ))}
            </div>
          </ManCard>
        </div>
      </div>
    </OwnerShell>
  );
}
