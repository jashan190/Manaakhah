"use client";

import { Button } from "@/components/ui/button";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, StatCard } from "@/components/man/primitives";
import { Calendar, Download, Eye, Search, Bookmark, MessageCircle, MapPin } from "lucide-react";

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

export default function AnalyticsPage() {
  return (
    <OwnerShell active="analytics">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PH title="Analytics" sub="How people discover and engage with your listing" />
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-[8px] border bg-white px-3 py-2 t-body-sm" style={{ borderColor: "var(--card-edge)", color: "var(--ink-700)" }}><Calendar size={15} /> Last 30 days</button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-5">
          <StatCard label="Profile views" value="3,142" delta="+24%" Icon={Eye} />
          <StatCard label="Search appearances" value="8,420" delta="+12%" Icon={Search} />
          <StatCard label="Saves" value="612" delta="+18%" Icon={Bookmark} />
          <StatCard label="Contacts" value="380" delta="+9%" Icon={MessageCircle} />
          <StatCard label="Direction clicks" value="204" delta="-3%" deltaTone="err" Icon={MapPin} />
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
          {/* Funnel */}
          <ManCard style={{ padding: 22 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Discovery funnel</div>
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
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Where people find you</div>
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
          <div className="t-h4" style={{ color: "var(--ink-900)" }}>Daily traffic</div>
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
    </OwnerShell>
  );
}
