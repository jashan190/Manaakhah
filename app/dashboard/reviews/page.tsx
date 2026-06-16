"use client";

import { useState } from "react";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, StatCard, Avatar, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Sparkles, ThumbsUp } from "lucide-react";

const dist = [[5, 62], [4, 24], [3, 9], [2, 3], [1, 2]] as const;
const filters = ["All", "Needs response", "Replied", "Highest", "Lowest"];

function Stars({ n }: { n: number }) {
  return <span className="inline-flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill={i <= n ? "var(--clay-500)" : "none"} stroke={i <= n ? "none" : "var(--ink-300)"} />)}</span>;
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState("Needs response");
  const [draft, setDraft] = useState("Jazakum Allah khair, Hassan! So glad the prayer space worked for you — we just expanded it. Hope to see you again soon, in shaa Allah.");

  return (
    <OwnerShell active="reviews">
      <div className="px-6 py-7 md:px-8">
        <PH title="Reviews & Responses" sub="Respond fast — replied businesses convert 2× better" />

        <div className="grid gap-3.5 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <ManCard style={{ padding: 18 }}>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Rating distribution</div>
            <div className="mt-3 grid gap-1.5">
              {dist.map(([s, p]) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="t-body-xs flex items-center gap-0.5" style={{ color: "var(--ink-500)", width: 26 }}>{s}<Star size={10} fill="var(--clay-500)" stroke="none" /></span>
                  <div className="h-2 flex-1 rounded-full" style={{ background: "var(--paper-2)" }}><div className="h-2 rounded-full" style={{ width: `${p}%`, background: "var(--clay-500)" }} /></div>
                  <span className="t-body-xs" style={{ color: "var(--ink-500)", width: 30, textAlign: "right" }}>{p}%</span>
                </div>
              ))}
            </div>
          </ManCard>
          <StatCard label="Average rating" value="4.7" sub="312 reviews" Icon={Star} />
          <StatCard label="Response rate" value="86%" delta="+4%" Icon={MessageSquare} />
          <StatCard label="Helpful votes" value="1,204" delta="+11%" Icon={ThumbsUp} />
        </div>

        <div className="my-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="man-focus t-body-sm rounded-full px-3 py-1.5"
              style={filter === f ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>{f}</button>
          ))}
        </div>

        {/* Awaiting response — AI suggested reply */}
        <ManCard style={{ padding: 22, marginBottom: 14 }}>
          <div className="flex items-start gap-3">
            <Avatar name="Hassan K" size={40} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="t-label" style={{ color: "var(--ink-900)" }}>Hassan K.</div>
                <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>2 days ago</span>
              </div>
              <div className="mt-1"><Stars n={4} /></div>
              <p className="t-body" style={{ color: "var(--ink-700)", marginTop: 8 }}>Great kabobs and the prayer space was a real plus for our family. Service was a touch slow on a busy Friday.</p>
              <div className="mt-2 flex flex-wrap gap-1.5"><Tag tone="moss">Prayer Space</Tag><Tag tone="moss">Family Seating</Tag></div>

              <div className="mt-4 rounded-[10px] p-3.5" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
                <div className="flex items-center gap-1.5 t-eyebrow" style={{ color: "var(--moss-700)" }}><Sparkles size={13} /> AI-suggested reply</div>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-2 w-full bg-transparent t-body outline-none" style={{ color: "var(--ink-900)", minHeight: 70, resize: "vertical" }} />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm">Regenerate</Button>
                  <Button size="sm">Reply Publicly</Button>
                </div>
              </div>
            </div>
          </div>
        </ManCard>

        {/* Replied */}
        <ManCard style={{ padding: 22 }}>
          <div className="flex items-start gap-3">
            <Avatar name="Mariam T" size={40} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="t-label" style={{ color: "var(--ink-900)" }}>Mariam T.</div>
                <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>4 days ago</span>
              </div>
              <div className="mt-1"><Stars n={5} /></div>
              <p className="t-body" style={{ color: "var(--ink-700)", marginTop: 8 }}>Best mixed grill in Sacramento. Certification gave me total peace of mind.</p>
              <div className="mt-3 rounded-[10px] p-3.5" style={{ background: "var(--paper-2)" }}>
                <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Your reply</div>
                <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 4 }}>Thank you so much, Mariam! It means a lot that the certification matters to you — see you next time!</p>
              </div>
            </div>
          </div>
        </ManCard>
      </div>
    </OwnerShell>
  );
}
