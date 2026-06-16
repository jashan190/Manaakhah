"use client";

import { useState } from "react";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { Avatar, Tag, ManCard } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Search, Send, Sparkles } from "lucide-react";

const LEADS = [
  { id: 1, n: "Aisha M.", tag: "Catering", time: "2h", unread: true, snippet: "Hi! Do you cater for around 40 people?",
    thread: [
      { me: false, t: "Salaam! We're planning a family event on March 12 for about 40 people. Do you offer catering, and is everything zabihah?", time: "2:14 PM" },
      { me: false, t: "Also — would you have a vegetarian option?", time: "2:15 PM" },
    ] },
  { id: 2, n: "Bilal R.", tag: "Reservation", time: "5h", unread: true, snippet: "Table for 6 this Saturday at 8pm?",
    thread: [{ me: false, t: "Assalamu alaikum, can I book a table for 6 this Saturday around 8pm?", time: "11:02 AM" }] },
  { id: 3, n: "Sara K.", tag: "Question", time: "1d", unread: false, snippet: "Where is your lamb sourced from?",
    thread: [{ me: false, t: "Where do you source your lamb from? Trying to be careful about it.", time: "Yesterday" }, { me: true, t: "It's all zabihah halal from a local HFSAA-certified supplier — happy to share the certificate!", time: "Yesterday" }] },
];
const QUICK = ["Yes, we cater!", "Send me the details", "Call me to discuss"];

export default function LeadsPage() {
  const [sel, setSel] = useState(1);
  const [draft, setDraft] = useState("");
  const active = LEADS.find((l) => l.id === sel)!;

  return (
    <OwnerShell active="leads">
      <div className="px-6 py-7 md:px-8">
        <h1 className="t-h3" style={{ color: "var(--ink-900)" }}>Lead Inbox</h1>
        <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>Messages from people who found you on Manaakhah</p>

        <ManCard style={{ padding: 0, overflow: "hidden", marginTop: 18 }} className="flex h-[calc(100vh-200px)] min-h-[480px]">
          {/* Conversation list */}
          <div className="flex w-[320px] flex-shrink-0 flex-col" style={{ borderRight: "1px solid var(--card-edge)" }}>
            <div className="flex h-[69px] items-center px-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
              <div className="man-field-wrap flex w-full items-center gap-2 rounded-[10px] border px-3 py-2" style={{ background: "#ffffff" }}>
                <Search size={15} style={{ color: "var(--ink-400)" }} /><input placeholder="Search leads" className="w-full bg-transparent t-body-sm outline-none" style={{ color: "var(--ink-900)" }} />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {LEADS.map((l) => {
                const on = l.id === sel;
                return (
                  <button key={l.id} onClick={() => setSel(l.id)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors" style={{ borderBottom: "1px solid var(--card-edge)", background: on ? "var(--moss-50)" : "transparent" }}>
                    <Avatar name={l.n} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between"><span className="t-label-sm" style={{ color: "var(--ink-900)" }}>{l.n}</span><span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{l.time}</span></div>
                      <div className="mt-0.5 flex items-center gap-1.5"><Tag tone="moss">{l.tag}</Tag></div>
                      <div className="mt-1 truncate t-body-sm" style={{ color: "var(--ink-500)" }}>{l.snippet}</div>
                    </div>
                    {l.unread && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--moss-700)" }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread */}
          <div className="flex flex-1 flex-col" style={{ background: "var(--paper)" }}>
            <div className="flex h-[69px] items-center gap-3 px-6" style={{ borderBottom: "1px solid var(--card-edge)", background: "#ffffff" }}>
              <Avatar name={active.n} size={38} />
              <div className="flex-1"><div className="t-label" style={{ color: "var(--ink-900)" }}>{active.n}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{active.tag} enquiry · via your profile</div></div>
            </div>

            <div className="flex-1 space-y-3 overflow-auto px-6 py-5">
              {active.thread.map((m, i) => (
                <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[70%] rounded-[14px] px-3.5 py-2.5" style={m.me ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "#ffffff", border: "1px solid var(--card-edge)", color: "var(--ink-900)" }}>
                    <div className="t-body">{m.t}</div>
                    <div className="t-body-xs mt-1" style={{ color: m.me ? "rgba(255,255,255,0.7)" : "var(--ink-400)" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="px-6 py-4" style={{ borderTop: "1px solid var(--card-edge)", background: "#ffffff" }}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 t-body-xs" style={{ color: "var(--moss-700)" }}><Sparkles size={12} /> Quick replies</span>
                {QUICK.map((q) => <button key={q} onClick={() => setDraft(q)} className="t-body-xs rounded-full px-2.5 py-1" style={{ background: "var(--paper-2)", color: "var(--ink-700)" }}>{q}</button>)}
              </div>
              <div className="flex items-end gap-2">
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a reply…" className="man-field flex-1 px-3.5 py-2.5 t-body-sm" style={{ color: "var(--ink-900)", minHeight: 44, resize: "none" }} />
                <Button size="sm"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </ManCard>
      </div>
    </OwnerShell>
  );
}
