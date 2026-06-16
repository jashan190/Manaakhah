"use client";

import { useState } from "react";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, Avatar, Tag } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";

const fieldCls = "man-field w-full px-3.5 py-2.5 t-body";
const fs = { color: "var(--ink-900)" } as const;
const TEAM = [
  { n: "Yusuf A.", email: "yusuf@famouskabob.com", role: "Owner" },
  { n: "Mariam A.", email: "mariam@famouskabob.com", role: "Manager" },
  { n: "Front desk", email: "hello@famouskabob.com", role: "Staff" },
];

function Toggle({ on, set, label, sub }: { on: boolean; set: (v: boolean) => void; label: string; sub: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="pr-4"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{label}</div><div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 1 }}>{sub}</div></div>
      <button onClick={() => set(!on)} className="man-focus relative h-6 w-11 flex-shrink-0 rounded-full transition-colors" style={{ background: on ? "var(--moss-700)" : "var(--card-edge)" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: on ? 22 : 2 }} />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 5 }}>{label}</div>{children}</div>;
}

export default function BusinessSettingsPage() {
  const [listed, setListed] = useState(true);
  const [leads, setLeads] = useState(true);
  const [autoReply, setAutoReply] = useState(false);

  return (
    <OwnerShell active="settings">
      <div className="px-6 py-7 md:px-8">
        <PH title="Business Settings" sub="Account and listing controls for Famous Kabob" />

        <div className="grid gap-3.5">
          {/* Listing controls */}
          <ManCard style={{ padding: 24 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Listing</div>
            <div className="mt-2 divide-y" style={{ borderColor: "var(--card-edge)" }}>
              <Toggle on={listed} set={setListed} label="Show listing publicly" sub="When off, your profile is hidden from search and maps" />
              <Toggle on={leads} set={setLeads} label="Accept new leads & enquiries" sub="Turn off if you can't respond for a while" />
              <Toggle on={autoReply} set={setAutoReply} label="Auto-reply to new enquiries" sub="Send an instant acknowledgement to every lead" />
            </div>
          </ManCard>

          {/* Business details */}
          <ManCard style={{ padding: 24 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 14 }}>Business Account</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Legal business name"><input className={fieldCls} style={fs} defaultValue="Famous Kabob LLC" /></Field>
              <Field label="EIN / tax ID"><input className={fieldCls} style={fs} defaultValue="••-•••4821" /></Field>
              <Field label="Billing contact"><input className={fieldCls} style={fs} defaultValue="yusuf@famouskabob.com" /></Field>
              <Field label="Default timezone"><Select defaultValue="Pacific (PT)" options={["Pacific (PT)", "Mountain (MT)", "Central (CT)", "Eastern (ET)"].map((s) => ({ value: s, label: s }))} /></Field>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t pt-4" style={{ borderColor: "var(--card-edge)" }}>
              <Button variant="ghost" size="sm">Discard</Button>
              <Button size="sm">Save Changes</Button>
            </div>
          </ManCard>

          {/* Team & access */}
          <ManCard style={{ padding: 24 }}>
            <div className="flex items-center justify-between"><div className="t-h4" style={{ color: "var(--ink-900)" }}>Team & Access</div><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Invite</Button></div>
            <div className="mt-3.5 grid gap-2">
              {TEAM.map((m) => (
                <div key={m.email} className="flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5" style={{ borderColor: "var(--card-edge)" }}>
                  <Avatar name={m.n} size={34} />
                  <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{m.n}</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{m.email}</div></div>
                  <Tag tone={m.role === "Owner" ? "moss" : "default"}>{m.role}</Tag>
                  {m.role !== "Owner" && <button className="man-focus rounded-[6px] t-body-sm" style={{ color: "var(--ink-500)" }}>Remove</button>}
                </div>
              ))}
            </div>
          </ManCard>

          {/* Danger zone */}
          <ManCard style={{ padding: 24, border: "1px solid var(--err-500)" }}>
            <div className="flex items-center gap-2"><AlertTriangle size={18} style={{ color: "var(--err-500)" }} /><div className="t-h4" style={{ color: "var(--ink-900)" }}>Danger Zone</div></div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>Deactivate listing</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Temporarily remove Famous Kabob from Manaakhah. You can restore it anytime.</div></div>
              <Button variant="outline" size="sm" style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}>Deactivate</Button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 pt-3" style={{ borderTop: "1px dashed var(--card-edge)" }}>
              <div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>Delete business</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Permanently remove this business and all its data. This cannot be undone.</div></div>
              <Button variant="outline" size="sm" style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}>Delete</Button>
            </div>
          </ManCard>
        </div>
      </div>
    </OwnerShell>
  );
}
