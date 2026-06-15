"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Avatar, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { MessageSquareWarning, Flag, Trash2, Check, Star, Bot } from "lucide-react";

const FILTERS = ["All flagged", "Spam", "Hate / abuse", "Fake review", "Off-topic"];
const REPORTS = [
  { id: 1, n: "Anon User", biz: "Famous Kabob", reason: "Spam", flags: 4, ai: 0.92, stars: 1, text: "CHEAP RX MEDS visit my site bit.ly/xyz — best prices guaranteed!!!", time: "1h" },
  { id: 2, n: "Kareem B.", biz: "Sinbad Market", reason: "Hate / abuse", flags: 7, ai: 0.88, stars: 1, text: "Owner was extremely rude and used a slur. Will not return.", time: "3h" },
  { id: 3, n: "Mystery Diner", biz: "Aria Afghan", reason: "Fake review", flags: 2, ai: 0.74, stars: 5, text: "Amazing amazing amazing best food ever 10/10 would recommend to everyone always!", time: "6h" },
  { id: 4, n: "Sam P.", biz: "Shalimar", reason: "Off-topic", flags: 1, ai: 0.41, stars: 2, text: "The parking lot next door is always full, terrible city planning honestly.", time: "1d" },
];

export default function ContentModerationPage() {
  const [filter, setFilter] = useState("All flagged");
  const [resolved, setResolved] = useState<Record<number, string>>({});
  const rows = (filter === "All flagged" ? REPORTS : REPORTS.filter((r) => r.reason === filter)).filter((r) => !resolved[r.id]);

  return (
    <AdminShell active="moderation">
      <div className="px-6 py-7 md:px-8">
        <PH title="Content Moderation" sub="Keep reviews trustworthy — AI pre-scores every flag" />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Flagged reviews" value="5" Icon={Flag} />
          <StatCard label="AI high-confidence" value="2" delta="≥0.85 score" deltaTone="err" Icon={Bot} />
          <StatCard label="Removed this week" value="23" Icon={Trash2} />
          <StatCard label="False-flag rate" value="11%" delta="-2%" Icon={MessageSquareWarning} />
        </div>

        <div className="my-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="t-body-sm rounded-full px-3 py-1.5"
              style={filter === f ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>{f}</button>
          ))}
        </div>

        <div className="grid gap-3.5">
          {rows.map((r) => (
            <ManCard key={r.id} style={{ padding: 20 }}>
              <div className="flex items-start gap-3">
                <Avatar name={r.n} size={40} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="t-label-sm" style={{ color: "var(--ink-900)" }}>{r.n}</span>
                    <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>on {r.biz} · {r.time} ago</span>
                    <span className="inline-flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill={i <= r.stars ? "var(--clay-500)" : "none"} stroke={i <= r.stars ? "none" : "var(--ink-300)"} />)}</span>
                  </div>
                  <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 8 }}>{r.text}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Tag tone="err">{r.reason}</Tag>
                    <Tag tone="warn">{r.flags} user flags</Tag>
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 t-body-xs" style={{ background: r.ai >= 0.85 ? "var(--err-50, #fdecea)" : "var(--paper-2)", color: r.ai >= 0.85 ? "var(--err-500)" : "var(--ink-700)" }}><Bot size={12} /> AI score {r.ai.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => setResolved((p) => ({ ...p, [r.id]: "removed" }))} style={{ background: "var(--err-500)" }}><Trash2 className="mr-1.5 h-4 w-4" /> Remove</Button>
                  <Button variant="outline" size="sm" onClick={() => setResolved((p) => ({ ...p, [r.id]: "kept" }))}><Check className="mr-1.5 h-4 w-4" /> Keep</Button>
                </div>
              </div>
            </ManCard>
          ))}
          {rows.length === 0 && (
            <ManCard style={{ padding: 40 }} className="text-center">
              <Check size={28} style={{ color: "var(--moss-700)", margin: "0 auto" }} />
              <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 10 }}>Queue Clear</div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>No flagged reviews match this filter.</div>
            </ManCard>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
