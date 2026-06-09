"use client";

import { useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { PH, ManCard, Avatar } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative h-5 w-9 rounded-full transition-colors" style={{ background: on ? "var(--moss-700)" : "var(--paper-3)" }} aria-pressed={on}>
      <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ManCard style={{ padding: 0, marginBottom: 16 }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--card-edge)" }}>
        <div className="t-h4" style={{ color: "var(--ink-900)" }}>{title}</div>
      </div>
      <div>{children}</div>
    </ManCard>
  );
}

function Row({ label, desc, children, last }: { label: string; desc?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4" style={{ borderBottom: last ? "none" : "1px solid var(--card-edge)" }}>
      <div>
        <div className="t-label" style={{ color: "var(--ink-900)" }}>{label}</div>
        {desc && <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

const HALAL = [
  ["Certifier-verified only", "Hide businesses without an active certification", true],
  ["Prefer hand-slaughtered", "Surface zabiha hand-slaughtered first", true],
  ["Hide stunned meat", "Exclude listings noting pre-slaughter stunning", false],
  ["Highlight prayer / wudu space", "Flag businesses with prayer facilities", true],
  ["Hide places serving alcohol", "Exclude venues that serve alcohol", false],
] as const;

export default function SettingsPage() {
  const [halal, setHalal] = useState(HALAL.map((h) => h[2] as boolean));
  const [notif, setNotif] = useState([true, true, false]);
  const [publicReviews, setPublicReviews] = useState(true);

  return (
    <AccountShell active="settings">
      <div className="mx-auto max-w-[760px] px-6 py-8 md:px-9">
        <PH title="Settings" sub="Manage your profile, halal preferences and account" />

        <Section title="Profile">
          <div className="flex items-center gap-4 px-5 py-4">
            <Avatar name="Your account" size={56} />
            <div className="flex-1">
              <div className="t-label" style={{ color: "var(--ink-900)" }}>Display name & city</div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Shown on your reviews and lists</div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </Section>

        <Section title="Halal Preferences">
          {HALAL.map(([l, d], i) => (
            <Row key={l} label={l} desc={d} last={i === HALAL.length - 1}>
              <Toggle on={halal[i]} onClick={() => setHalal((p) => p.map((v, j) => (j === i ? !v : v)))} />
            </Row>
          ))}
        </Section>

        <Section title="Notifications">
          {[["Email", "Saved-search matches & replies"], ["Push", "Real-time alerts on your device"], ["Weekly digest", "A roundup of new businesses near you"]].map(([l, d], i) => (
            <Row key={l} label={l} desc={d} last={i === 2}>
              <Toggle on={notif[i]} onClick={() => setNotif((p) => p.map((v, j) => (j === i ? !v : v)))} />
            </Row>
          ))}
        </Section>

        <Section title="Account & Security">
          <Row label="Email" desc="you@example.com"><Button variant="outline" size="sm">Change</Button></Row>
          <Row label="Password" desc="Last changed 3 months ago"><Button variant="outline" size="sm">Update</Button></Row>
          <Row label="Two-factor authentication" desc="Add an extra layer of security" last><Button variant="outline" size="sm">Enable</Button></Row>
        </Section>

        <Section title="Data & Privacy">
          <Row label="Public reviews" desc="Show your reviews on your public profile"><Toggle on={publicReviews} onClick={() => setPublicReviews((v) => !v)} /></Row>
          <Row label="Download your data" desc="Get a copy of everything we store"><Button variant="outline" size="sm">Request</Button></Row>
          <Row label="Delete account" desc="Permanently remove your account and data" last>
            <Button variant="outline" size="sm" style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}>Delete</Button>
          </Row>
        </Section>
      </div>
    </AccountShell>
  );
}
