"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Seal, Tag } from "@/components/man/primitives";
import { Check, Store, Image as ImageIcon, Clock, BadgeCheck, Sparkles, Star, ChevronRight } from "lucide-react";

const STEPS = [
  { Icon: Store, t: "Complete your profile", s: "Name, category, about & contact", done: true, href: "/dashboard/listing" },
  { Icon: ImageIcon, t: "Add photos", s: "A cover photo + 5 gallery shots", done: false, href: "/dashboard/listing" },
  { Icon: Clock, t: "Set your opening hours", s: "So people know when to visit", done: false, href: "/dashboard/listing" },
  { Icon: BadgeCheck, t: "Upload your halal certificate", s: "We verify it and your Seal goes live", done: false, href: "/dashboard/listing" },
  { Icon: Sparkles, t: "Create your first promotion", s: "Reach people who saved you", done: false, href: "/dashboard/deals" },
  { Icon: Star, t: "Invite a few reviews", s: "Listings with 5+ reviews rank higher", done: false, href: "/dashboard/reviews" },
];

export default function OnboardingPage() {
  const done = STEPS.filter((s) => s.done).length;
  const pct = Math.round((done / STEPS.length) * 100);

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-10 md:px-14">
      <div className="mx-auto max-w-[720px]">
        <div className="flex items-center gap-2"><Seal size={22} /><Tag tone="moss">Ownership Verified</Tag></div>
        <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 12 }}>Welcome to Manaakhah, Famous Kabob</h1>
        <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 6 }}>Finish these steps to get the most out of your listing. You can always come back later.</p>

        <ManCard style={{ padding: 22, marginTop: 22 }}>
          <div className="flex items-baseline justify-between">
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Setup Progress</div>
            <span className="t-h3" style={{ color: "var(--moss-700)" }}>{done}/{STEPS.length}</span>
          </div>
          <div className="mt-3 h-2.5 w-full rounded-full" style={{ background: "var(--paper-2)" }}><div className="h-2.5 rounded-full" style={{ width: `${pct}%`, background: "var(--moss-700)" }} /></div>

          <div className="mt-4 grid gap-2">
            {STEPS.map((s) => (
              <Link key={s.t} href={s.href} className="flex items-center gap-3.5 rounded-[12px] p-3.5" style={{ border: "1px solid var(--card-edge)", background: s.done ? "var(--paper-2)" : "#ffffff" }}>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={s.done ? { background: "var(--moss-700)" } : { background: "var(--clay-50)" }}>
                  {s.done ? <Check size={16} style={{ color: "var(--bone)" }} /> : <s.Icon size={16} style={{ color: "var(--clay-700)" }} />}
                </span>
                <div className="flex-1">
                  <div className="t-label-sm" style={{ color: "var(--ink-900)", textDecoration: s.done ? "line-through" : "none" }}>{s.t}</div>
                  <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{s.s}</div>
                </div>
                {s.done ? <Tag tone="ok">Done</Tag> : <span className="flex items-center gap-1 t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>Start <ChevronRight size={14} /></span>}
              </Link>
            ))}
          </div>
        </ManCard>

        <div className="mt-5 flex items-center justify-between">
          <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>You can finish setup anytime from your dashboard.</span>
          <Link href="/dashboard"><Button size="sm">Go to dashboard <ChevronRight className="ml-1 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </div>
  );
}
