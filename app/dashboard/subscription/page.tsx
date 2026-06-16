"use client";

import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, Tag, Check } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";

const proFeatures = ["Featured placement", "Unlimited photos & menu", "Lead inbox + quick replies", "Promotions & events", "Analytics dashboard"];
const invoices = [
  ["May 1, 2026", "Pro · Monthly", "$29.00"],
  ["Apr 1, 2026", "Pro · Monthly", "$29.00"],
  ["Mar 1, 2026", "Pro · Monthly", "$29.00"],
];

export default function SubscriptionPage() {
  return (
    <OwnerShell active="billing">
      <div className="px-6 py-7 md:px-8">
        <PH title="Subscription & Billing" sub="Manage your plan, payment method and invoices" />

        <div className="grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
          {/* Current plan */}
          <ManCard style={{ padding: 24 }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Current plan</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="t-h2" style={{ color: "var(--ink-900)" }}>Pro</span>
                  <span className="t-body" style={{ color: "var(--ink-500)" }}>$29/month</span>
                </div>
              </div>
              <Tag tone="moss">Active</Tag>
            </div>
            <div className="mt-4 grid gap-2">
              {proFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2"><Check size={14} style={{ color: "var(--moss-700)" }} /><span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{f}</span></div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="sm">Change Plan</Button>
              <Button variant="outline" size="sm" style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}>Cancel</Button>
            </div>
          </ManCard>

          {/* Upgrade */}
          <div className="rounded-[14px] p-6" style={{ background: "var(--clay-50)", border: "1px solid var(--clay-100)" }}>
            <Tag tone="clay">Premier</Tag>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 10 }}>Go Top of Search</div>
            <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 6 }}>Featured placement, AI review replies, multi-location, and a direct line to our verification team.</p>
            <div className="mt-3 t-h2" style={{ color: "var(--ink-900)" }}>$99<span className="t-body" style={{ color: "var(--ink-500)" }}>/mo</span></div>
            <Button className="mt-3">Upgrade to Premier</Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1fr_1.4fr]">
          {/* Payment method */}
          <ManCard style={{ padding: 22 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Payment Method</div>
            <div className="mt-3 flex items-center gap-3 rounded-[10px] p-3" style={{ background: "var(--paper-2)" }}>
              <CreditCard size={22} style={{ color: "var(--ink-700)" }} />
              <div className="flex-1"><div className="t-label" style={{ color: "var(--ink-900)" }}>Visa ending 4242</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Expires 08/28</div></div>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginTop: 16 }}>Billing details</div>
            <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 4 }}>Famous Kabob LLC<br />1290 Fulton Ave, Sacramento, CA 95825</div>
          </ManCard>

          {/* Invoices */}
          <ManCard style={{ padding: 0 }}>
            <div className="px-5 py-3.5 t-h4" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--card-edge)" }}>Invoice History</div>
            {invoices.map(([d, p, a], i) => (
              <div key={d} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: i === invoices.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{d}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{p}</div></div>
                <span className="t-body-sm" style={{ color: "var(--ink-900)" }}>{a}</span>
                <Tag tone="ok">Paid</Tag>
                <button className="man-focus rounded-lg p-1.5 hover:bg-[var(--paper-2)]" style={{ color: "var(--ink-500)" }}><Download size={16} /></button>
              </div>
            ))}
          </ManCard>
        </div>
      </div>
    </OwnerShell>
  );
}
