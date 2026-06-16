"use client";

import { useState } from "react";
import Link from "next/link";
import { useMockSession } from "@/components/mock-session-provider";
import { Button } from "@/components/ui/button";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Seal, ManCard, StatCard, Avatar, Rating } from "@/components/man/primitives";
import { ExternalLink, Sparkles, Eye, MessageCircle, Star, TrendingUp, MessageSquare, Tag, ChevronRight, Calendar, Download, Search, Bookmark, MapPin } from "lucide-react";

// Overview data
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

// Analytics data
const funnel = [
  { l: "Appeared in search", v: 8420, pct: 100 },
  { l: "Viewed profile", v: 3142, pct: 37 },
  { l: "Saved", v: 612, pct: 19 },
  { l: "Contacted", v: 380, pct: 12 },
  { l: "Visited (est.)", v: 240, pct: 7.6 },
];
const sources = [
  { l: "Search results", pct: 48 },
  { l: "Map view", pct: 24 },
  { l: "Category browse", pct: 15 },
  { l: "Shared lists", pct: 8 },
  { l: "Direct link", pct: 5 },
];
const days = [62, 78, 70, 95, 88, 132, 118];

export default function DashboardPage() {
  const { data: session } = useMockSession();
  const owner = (session?.user?.name || "Yusuf").split(" ")[0];
  const [tab, setTab] = useState<"overview" | "analytics">("overview");

  return (
    <OwnerShell active="dashboard">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Today · Mon Feb 10</div>
            <h1 className="t-h3" style={{ color: "var(--ink-900)", marginTop: 4 }}>Salaam {owner} — here&apos;s your week</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/business/sac-famous-kabob"><Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-4 w-4" /> View Public Profile</Button></Link>
            <Link href="/dashboard/deals"><Button size="sm"><Sparkles className="mr-1.5 h-4 w-4" /> New Promotion</Button></Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 border-b" style={{ borderColor: "var(--card-edge)" }}>
          {([["overview", "Overview"], ["analytics", "Analytics"]] as const).map(([k, l]) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} className="man-focus rounded-[4px] px-4 py-2.5 t-label transition-colors"
                style={{ color: on ? "var(--ink-900)" : "var(--ink-500)", borderBottom: on ? "2px solid var(--moss-700)" : "2px solid transparent", marginBottom: -1 }}>
                {l}
              </button>
            );
          })}
        </div>

        {tab === "overview" ? (
          <div className="mt-5">
            {/* Verification banner */}
            <ManCard style={{ padding: 18, background: "var(--moss-50)", border: "1px solid var(--moss-200)" }} className="flex flex-wrap items-center gap-4">
              <Seal size={28} />
              <div className="flex-1">
                <div className="t-label" style={{ color: "var(--ink-900)" }}>Verified halal · HFSAA active</div>
                <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>Cert expires March 14, 2027 — we&apos;ll remind you 30 days before. Last sync: today 4:30 AM.</div>
              </div>
              <Link href="/business/sac-famous-kabob/certification"><Button variant="outline" size="sm">Manage Certification</Button></Link>
            </ManCard>

            {/* KPIs */}
            <div className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              <StatCard label="Profile views" value="3,142" delta="+24%" sub="vs last week" Icon={Eye} />
              <StatCard label="Lead enquiries" value="38" delta="+11%" sub="3 unread" Icon={MessageCircle} />
              <StatCard label="New reviews" value="6" delta="4.7 avg" sub="2 need response" Icon={Star} />
              <StatCard label="Conversion" value="12.1%" delta="-0.8%" deltaTone="err" sub="View → contact" Icon={TrendingUp} />
            </div>

            {/* Things to do + leads + reviews */}
            <div className="mt-4 grid gap-3.5 lg:grid-cols-3">
              <ManCard style={{ padding: 22 }}>
                <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>For your attention</div>
                <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 4 }}>3 Things to Do</div>
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

              <ManCard style={{ padding: 22 }}>
                <div className="flex items-baseline justify-between">
                  <div className="t-h4" style={{ color: "var(--ink-900)" }}>Recent Enquiries</div>
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
                  <div className="t-h4" style={{ color: "var(--ink-900)" }}>Latest Reviews</div>
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
        ) : (
          <div className="mt-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>How people discover and engage with your listing</p>
              <div className="flex gap-2">
                <button className="man-focus flex items-center gap-2 rounded-[12px] border bg-white px-3 py-2 t-body-sm" style={{ borderColor: "var(--card-edge)", color: "var(--ink-700)" }}><Calendar size={15} /> Last 30 days</button>
                <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
              </div>
            </div>

            {/* Analytics KPIs (Profile views lives on Overview + in the funnel) */}
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              <StatCard label="Search appearances" value="8,420" delta="+12%" Icon={Search} />
              <StatCard label="Saves" value="612" delta="+18%" Icon={Bookmark} />
              <StatCard label="Contacts" value="380" delta="+9%" Icon={MessageCircle} />
              <StatCard label="Direction clicks" value="204" delta="-3%" deltaTone="err" Icon={MapPin} />
            </div>

            <div className="mt-4 grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
              {/* Funnel */}
              <ManCard style={{ padding: 22 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)" }}>Discovery Funnel</div>
                <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>From appearing in search to a visit</p>
                <div className="mt-4 grid gap-3">
                  {funnel.map((s) => (
                    <div key={s.l}>
                      <div className="mb-1 flex justify-between t-body-sm" style={{ color: "var(--ink-700)" }}><span>{s.l}</span><span style={{ color: "var(--ink-500)" }}>{s.v.toLocaleString()} · {s.pct}%</span></div>
                      <div className="h-2.5 w-full rounded-full" style={{ background: "var(--paper-2)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${s.pct}%`, background: "var(--moss-700)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ManCard>

              {/* Sources */}
              <ManCard style={{ padding: 22 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)" }}>Where People Find You</div>
                <div className="mt-4 grid gap-3">
                  {sources.map((s) => (
                    <div key={s.l}>
                      <div className="mb-1 flex justify-between t-body-sm" style={{ color: "var(--ink-700)" }}><span>{s.l}</span><span style={{ color: "var(--ink-500)" }}>{s.pct}%</span></div>
                      <div className="h-2.5 w-full rounded-full" style={{ background: "var(--paper-2)" }}>
                        <div className="h-2.5 rounded-full" style={{ width: `${s.pct * 2}%`, maxWidth: "100%", background: "var(--clay-500)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ManCard>
            </div>

            {/* Daily traffic bars */}
            <ManCard style={{ padding: 22, marginTop: 14 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Daily Traffic</div>
              <div className="mt-4 flex items-end gap-3" style={{ height: 140 }}>
                {days.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-md" style={{ height: `${(d / 132) * 110}px`, background: "var(--moss-500)" }} />
                    <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
                  </div>
                ))}
              </div>
            </ManCard>
          </div>
        )}
      </div>
    </OwnerShell>
  );
}
