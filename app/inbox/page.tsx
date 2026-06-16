"use client";

import { useState } from "react";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { Seal, ManCard } from "@/components/man/primitives";
import { Send, Paperclip, Search } from "lucide-react";

type Thread = { biz: string; slug: string; owner: string; preview: string; time: string; unread?: number; msgs: { me?: boolean; text: string; time: string }[] };
const threads: Thread[] = [
  {
    biz: "Famous Kabob", slug: "sac-famous-kabob", owner: "Yusuf K.", preview: "Yes, we have a prayer space upstairs…", time: "5h", unread: 1,
    msgs: [
      { text: "Salaam! Do you have a prayer space and family seating?", time: "Tue 6:12 PM", me: true },
      { text: "Wa alaykum salaam! Yes — prayer space upstairs and a family section.", time: "Tue 6:40 PM" },
      { text: "We have a wudu area too. See you Friday in shaa Allah!", time: "Tue 6:41 PM" },
    ],
  },
  {
    biz: "Sinbad Market & Bakery", slug: "sac-sinbad-market-and-bakery", owner: "Layla H.", preview: "The fresh lamb comes in Thursdays.", time: "1d",
    msgs: [
      { text: "When does fresh halal lamb come in?", time: "Mon 11:02 AM", me: true },
      { text: "Thursdays — call ahead and we'll set some aside.", time: "Mon 12:15 PM" },
    ],
  },
  {
    biz: "Adam's International Market", slug: "sac-adam-s-international-market", owner: "Omar I.", preview: "We cater for events — how many guests?", time: "3d",
    msgs: [{ text: "Do you cater for events?", time: "Sat 4:20 PM", me: true }, { text: "We do! How many guests?", time: "Sat 5:01 PM" }],
  },
];
const QUICK = ["Thanks!", "What are your hours?", "Do you deliver?"];

export default function InboxPage() {
  const [sel, setSel] = useState(0);
  const [draft, setDraft] = useState("");
  const t = threads[sel];

  return (
    <AccountShell active="inbox">
      <div className="px-6 py-7 md:px-8">
        <h1 className="t-h3" style={{ color: "var(--ink-900)" }}>Inbox</h1>
        <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>Your conversations with Muslim-owned businesses</p>

        <ManCard style={{ padding: 0, overflow: "hidden", marginTop: 18 }} className="flex h-[calc(100vh-200px)] min-h-[480px]">
          {/* Thread list */}
          <div className="flex w-[340px] flex-shrink-0 flex-col" style={{ borderRight: "1px solid var(--card-edge)" }}>
            <div className="flex h-[69px] items-center px-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
              <div className="man-field-wrap flex w-full items-center gap-2 rounded-[10px] border px-3 py-2" style={{ background: "#ffffff" }}>
                <Search size={15} style={{ color: "var(--ink-400)" }} /><input placeholder="Search messages" className="w-full bg-transparent t-body-sm outline-none" style={{ color: "var(--ink-900)" }} />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {threads.map((th, i) => (
                <button key={th.biz} onClick={() => setSel(i)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ borderBottom: "1px solid var(--card-edge)", background: i === sel ? "var(--moss-50)" : "transparent" }}>
                  <Seal size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="t-label-sm line-clamp-1" style={{ color: "var(--ink-900)" }}>{th.biz}</div>
                      <span className="t-body-xs flex-shrink-0" style={{ color: "var(--ink-400)" }}>{th.time}</span>
                    </div>
                    <div className="t-body-sm line-clamp-1" style={{ color: th.unread ? "var(--ink-900)" : "var(--ink-500)", fontWeight: th.unread ? 500 : 400, marginTop: 2 }}>{th.preview}</div>
                  </div>
                  {th.unread && <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5" style={{ fontSize: 11, fontWeight: 600, background: "var(--moss-700)", color: "var(--bone)" }}>{th.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-1 flex-col" style={{ background: "var(--paper)" }}>
            <div className="flex h-[69px] items-center gap-3 px-6" style={{ borderBottom: "1px solid var(--card-edge)", background: "#ffffff" }}>
              <Seal size={32} />
              <div className="flex-1">
                <div className="t-label" style={{ color: "var(--ink-900)" }}>{t.biz}</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{t.owner} · Replies in ~2h</div>
              </div>
              <Link href={`/business/${t.slug}`} className="t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 500 }}>View profile</Link>
            </div>

            <div className="flex-1 overflow-auto px-6 py-5">
              <div className="mb-4 text-center t-body-xs" style={{ color: "var(--ink-400)" }}>Conversation started</div>
              {t.msgs.map((m, i) => (
                <div key={i} className={`mb-3 flex ${m.me ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[70%] rounded-[14px] px-3.5 py-2.5"
                    style={m.me ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "#ffffff", border: "1px solid var(--card-edge)", color: "var(--ink-900)" }}>
                    <div className="t-body">{m.text}</div>
                    <div className="t-body-xs mt-1" style={{ color: m.me ? "rgba(255,255,255,0.7)" : "var(--ink-400)" }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4" style={{ borderTop: "1px solid var(--card-edge)", background: "#ffffff" }}>
              <div className="mb-2 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => setDraft(q)} className="t-body-xs rounded-full px-2.5 py-1" style={{ background: "var(--paper-2)", color: "var(--ink-700)" }}>{q}</button>
                ))}
              </div>
              <div className="man-field-wrap flex items-center gap-2 rounded-[10px] border bg-white px-3">
                <Paperclip size={18} style={{ color: "var(--ink-400)" }} />
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="w-full bg-transparent py-2.5 t-body-sm outline-none" style={{ color: "var(--ink-900)" }} />
                <button className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "var(--moss-700)" }}><Send size={15} style={{ color: "var(--bone)" }} /></button>
              </div>
            </div>
          </div>
        </ManCard>
      </div>
    </AccountShell>
  );
}
