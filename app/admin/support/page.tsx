"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, PH, StatCard, Avatar, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Clock, CheckCircle2, Send } from "lucide-react";

const TICKETS = [
  { id: 1, n: "Yusuf A.", biz: "Famous Kabob", subj: "My Seal disappeared after renewal", prio: "High", status: "Open", time: "20m", unread: true,
    thread: [{ me: false, t: "Salaam, I renewed my HFSAA cert last week but the verified Seal is gone from my profile. Can you help?", time: "10:40 AM" }] },
  { id: 2, n: "Layla H.", biz: "Sinbad Market", subj: "Can't upload certificate (file too large)", prio: "Medium", status: "Open", time: "2h", unread: true,
    thread: [{ me: false, t: "The upload keeps failing — my cert PDF is 14 MB. What's the limit?", time: "8:55 AM" }] },
  { id: 3, n: "Omar D.", biz: "Aria Afghan", subj: "Dispute: someone else claimed my listing", prio: "High", status: "Open", time: "5h", unread: false,
    thread: [{ me: false, t: "Another account claimed Aria Afghan but I'm the owner. How do I dispute this?", time: "Yesterday" }] },
  { id: 4, n: "Sana K.", biz: "Qamaria Coffee", subj: "Billing — charged twice for Pro", prio: "Low", status: "Resolved", time: "1d", unread: false,
    thread: [{ me: false, t: "I think I was billed twice this month.", time: "Mon" }, { me: true, t: "Refunded the duplicate charge — you'll see it in 3–5 days. Sorry about that!", time: "Mon" }] },
];

export default function OwnerSupportPage() {
  const [sel, setSel] = useState(1);
  const [draft, setDraft] = useState("");
  const active = TICKETS.find((t) => t.id === sel)!;
  const prioTone = (p: string) => (p === "High" ? "err" : p === "Medium" ? "warn" : "moss");

  return (
    <AdminShell active="support">
      <div className="px-6 py-7 md:px-8">
        <PH title="Owner Support" sub="Help business owners get verified and stay live" />

        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Open tickets" value="3" Icon={LifeBuoy} />
          <StatCard label="High priority" value="2" deltaTone="err" delta="needs reply" Icon={Clock} />
          <StatCard label="Resolved today" value="14" delta="+3" Icon={CheckCircle2} />
          <StatCard label="Avg. first reply" value="42m" delta="-8m" Icon={Clock} />
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1fr_1.5fr]">
          {/* Ticket list */}
          <ManCard style={{ padding: 0 }}>
            <div className="px-5 py-3.5 t-h4" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--card-edge)" }}>Tickets</div>
            {TICKETS.map((t, i) => {
              const on = t.id === sel;
              return (
                <button key={t.id} onClick={() => setSel(t.id)} className="flex w-full items-start gap-3 px-5 py-3.5 text-left" style={{ borderBottom: i === TICKETS.length - 1 ? "none" : "1px solid var(--card-edge)", background: on ? "var(--moss-50)" : "transparent" }}>
                  <Avatar name={t.n} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2"><span className="t-label-sm" style={{ color: "var(--ink-900)" }}>{t.n}</span><span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{t.time}</span></div>
                    <div className="truncate t-body-sm" style={{ color: "var(--ink-700)", marginTop: 1 }}>{t.subj}</div>
                    <div className="mt-1.5 flex items-center gap-1.5"><Tag tone={prioTone(t.prio)}>{t.prio}</Tag><Tag tone={t.status === "Resolved" ? "ok" : "moss"}>{t.status}</Tag></div>
                  </div>
                  {t.unread && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--clay-500)" }} />}
                </button>
              );
            })}
          </ManCard>

          {/* Thread */}
          <ManCard style={{ padding: 0 }} className="flex flex-col">
            <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: "1px solid var(--card-edge)" }}>
              <Avatar name={active.n} size={36} />
              <div className="flex-1"><div className="t-label" style={{ color: "var(--ink-900)" }}>{active.subj}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{active.n} · {active.biz}</div></div>
              <Tag tone={prioTone(active.prio)}>{active.prio}</Tag>
            </div>
            <div className="flex-1 space-y-3 p-5" style={{ minHeight: 220 }}>
              {active.thread.map((m, i) => (
                <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%] rounded-[14px] px-3.5 py-2.5" style={m.me ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "var(--paper-2)", color: "var(--ink-900)" }}>
                    <div className="t-body-sm">{m.t}</div>
                    <div className="t-body-xs mt-1" style={{ color: m.me ? "rgba(255,255,255,0.7)" : "var(--ink-400)" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-2 p-4" style={{ borderTop: "1px solid var(--card-edge)" }}>
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Reply to owner…" className="flex-1 rounded-[12px] border bg-white px-3.5 py-2.5 t-body-sm outline-none" style={{ borderColor: "var(--card-edge)", color: "var(--ink-900)", minHeight: 44, resize: "none" }} />
              <Button size="sm"><Send className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm">Resolve</Button>
            </div>
          </ManCard>
        </div>
      </div>
    </AdminShell>
  );
}
