"use client";

import { ManCard, PH, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mail, Phone, BadgeCheck, Inbox, Sparkles, CreditCard, Store, TrendingUp, Bookmark, Star, Shield, Bell, Compass } from "lucide-react";

const TOPICS = {
  consumer: [
    { Icon: Compass, t: "Finding businesses", s: "Search, filters, map and distance" },
    { Icon: Bookmark, t: "Saved lists & searches", s: "Bookmark places and get alerts" },
    { Icon: Star, t: "Writing reviews", s: "Guidelines and editing your reviews" },
    { Icon: Shield, t: "Account & privacy", s: "Your data, visibility and security" },
    { Icon: Bell, t: "Notifications", s: "Choose what you hear about" },
    { Icon: MessageCircle, t: "Reporting a problem", s: "Flag listings or reviews" },
  ],
  owner: [
    { Icon: BadgeCheck, t: "Verification & your Seal", s: "Get verified and keep it active" },
    { Icon: Inbox, t: "Managing leads", s: "Reply fast and book enquiries" },
    { Icon: Store, t: "Editing your listing", s: "Photos, hours, menu and amenities" },
    { Icon: Sparkles, t: "Promotions & events", s: "Reach people who saved you" },
    { Icon: TrendingUp, t: "Analytics", s: "Understand your profile traffic" },
    { Icon: CreditCard, t: "Billing & plans", s: "Subscriptions, invoices, payment" },
  ],
} as const;

const TICKETS = {
  consumer: [
    { id: "#4821", t: "Review didn't post", status: "Open" },
    { id: "#4790", t: "Wrong hours on a listing", status: "Resolved" },
  ],
  owner: [
    { id: "#5120", t: "My Seal disappeared after renewal", status: "Open" },
    { id: "#5088", t: "Duplicate listing for my business", status: "In progress" },
  ],
} as const;

export function AuthedHelp({ role }: { role: "consumer" | "owner" }) {
  const topics = TOPICS[role];
  const tickets = TICKETS[role];
  const sub = role === "owner" ? "Get help running and growing your business on Minara" : "Answers and support for your Minara account";

  return (
    <div className="px-6 py-7 md:px-8">
      <PH title="Help & Support" sub={sub} />

      <div className="grid gap-3.5 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-3.5">
          {/* Search */}
          <ManCard style={{ padding: 20 }}>
            <div className="man-field-wrap flex items-center gap-2 rounded-[8px] border bg-white px-3.5 py-2.5">
              <Search size={18} style={{ color: "var(--ink-400)" }} />
              <input placeholder="Search help articles…" className="w-full bg-transparent t-body outline-none" style={{ color: "var(--ink-900)" }} />
            </div>
          </ManCard>

          {/* Topics */}
          <div>
            <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>Browse Topics</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map((t) => (
                <ManCard key={t.t} style={{ padding: 16 }} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--paper-2)" }}><t.Icon size={17} style={{ color: "var(--moss-700)" }} /></span>
                  <div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{t.t}</div><div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{t.s}</div></div>
                </ManCard>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets + contact */}
        <div className="grid gap-3.5">
          <ManCard style={{ padding: 0 }}>
            <div className="px-5 py-3.5 t-h4" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--card-edge)" }}>Your Support Tickets</div>
            {tickets.map((tk, i) => (
              <div key={tk.id} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: i === tickets.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{tk.t}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{tk.id}</div></div>
                <Tag tone={tk.status === "Resolved" ? "ok" : tk.status === "Open" ? "warn" : "moss"}>{tk.status}</Tag>
              </div>
            ))}
          </ManCard>

          <ManCard style={{ padding: 20 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Contact Support</div>
            <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>Typical reply within {role === "owner" ? "2 hours" : "1 business day"}.</div>
            <div className="mt-3.5 grid gap-2">
              <Button><MessageCircle className="mr-1.5 h-4 w-4" /> Start a Chat</Button>
              <Button variant="outline" size="sm"><Mail className="mr-1.5 h-4 w-4" /> Email Us</Button>
              {role === "owner" && <Button variant="outline" size="sm"><Phone className="mr-1.5 h-4 w-4" /> Request a Callback</Button>}
            </div>
          </ManCard>
        </div>
      </div>
    </div>
  );
}
