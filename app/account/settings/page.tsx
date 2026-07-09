"use client";

import { useEffect, useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { PH, ManCard, Avatar, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Mail, Smartphone, Copy, Check } from "lucide-react";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="man-focus relative h-5 w-9 rounded-full transition-colors" style={{ background: on ? "var(--moss-700)" : "var(--paper-3)" }} aria-pressed={on}>
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

type TwoFactorState = { twoFactorEnabled: boolean; twoFactorMethod: string | null } | null;

function TwoFactorRow() {
  const [me, setMe] = useState<TwoFactorState>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [flow, setFlow] = useState<"choose" | "confirm" | "backupCodes" | "disable" | null>(null);
  const [method, setMethod] = useState<"AUTHENTICATOR" | "EMAIL" | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const loadMe = async () => {
    setLoadingMe(true);
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setMe(res.ok ? { twoFactorEnabled: data.user.twoFactorEnabled, twoFactorMethod: data.user.twoFactorMethod } : null);
    } catch {
      setMe(null);
    }
    setLoadingMe(false);
  };

  useEffect(() => { loadMe(); }, []);

  const reset = () => {
    setFlow(null);
    setMethod(null);
    setQrCode(null);
    setSecret(null);
    setCode("");
    setError("");
    setInfo("");
    setDisablePassword("");
    setDisableCode("");
  };

  const startSetup = async (m: "AUTHENTICATOR" | "EMAIL") => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: m }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start setup");
      setMethod(m);
      if (m === "AUTHENTICATOR") {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setInfo("A verification code has been sent to your email.");
      }
      setFlow("confirm");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setBusy(false);
  };

  const resendEmailCode = async () => {
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/auth/2fa/send-code", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code");
      setInfo("A new code has been sent.");
    } catch (e: any) {
      setError(e.message || "Failed to resend code");
    }
  };

  const confirmSetup = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setBackupCodes(data.backupCodes || []);
      setFlow("backupCodes");
      await loadMe();
    } catch (e: any) {
      setError(e.message || "Invalid code");
    }
    setBusy(false);
  };

  const disable = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword, code: disableCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable");
      reset();
      await loadMe();
    } catch (e: any) {
      setError(e.message || "Failed to disable");
    }
    setBusy(false);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingMe) {
    return (
      <Row label="Two-factor authentication" desc="Add an extra layer of security" last>
        <Loader2 size={16} className="animate-spin" style={{ color: "var(--ink-400)" }} />
      </Row>
    );
  }

  if (!flow) {
    return (
      <Row
        label="Two-factor authentication"
        desc={me?.twoFactorEnabled ? `Enabled via ${me.twoFactorMethod === "EMAIL" ? "email" : "authenticator app"}` : "Add an extra layer of security"}
        last
      >
        {me?.twoFactorEnabled ? (
          <div className="flex items-center gap-2">
            <Tag tone="ok">Enabled</Tag>
            <Button variant="outline" size="sm" onClick={() => setFlow("disable")}>Disable</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setFlow("choose")}>Enable</Button>
        )}
      </Row>
    );
  }

  return (
    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--card-edge)" }}>
      {error && <div className="mb-3 rounded-[8px] p-2.5 t-body-sm" style={{ background: "#fadfdb", color: "#9b2e25" }}>{error}</div>}
      {info && !error && <div className="mb-3 rounded-[8px] p-2.5 t-body-sm" style={{ background: "var(--moss-50)", color: "var(--moss-700)" }}>{info}</div>}

      {flow === "choose" && (
        <>
          <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 10 }}>Choose a verification method</div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button disabled={busy} onClick={() => startSetup("AUTHENTICATOR")} className="man-focus flex items-center gap-3 rounded-[12px] p-3.5 text-left" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
              <Smartphone size={18} style={{ color: "var(--moss-700)" }} />
              <div>
                <div className="t-label-sm" style={{ color: "var(--ink-900)" }}>Authenticator app</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Google Authenticator, Authy, etc.</div>
              </div>
            </button>
            <button disabled={busy} onClick={() => startSetup("EMAIL")} className="man-focus flex items-center gap-3 rounded-[12px] p-3.5 text-left" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
              <Mail size={18} style={{ color: "var(--moss-700)" }} />
              <div>
                <div className="t-label-sm" style={{ color: "var(--ink-900)" }}>Email code</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>We'll send a code at each sign-in</div>
              </div>
            </button>
          </div>
          <Button variant="ghost" size="sm" className="mt-3" onClick={reset}>Cancel</Button>
        </>
      )}

      {flow === "confirm" && (
        <>
          {method === "AUTHENTICATOR" && qrCode && (
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR code" width={160} height={160} style={{ borderRadius: 8 }} />
              {secret && <div className="mt-2 t-body-xs" style={{ color: "var(--ink-500)" }}>Or enter this code manually: <span style={{ fontFamily: "monospace" }}>{secret}</span></div>}
            </div>
          )}
          <Label htmlFor="twofa-code">Enter the 6-digit code{method === "EMAIL" ? " from your email" : ""}</Label>
          <Input id="twofa-code" className="mt-1.5 max-w-[200px]" inputMode="numeric" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" disabled={busy || !code} onClick={confirmSetup}>{busy ? "Verifying..." : "Confirm"}</Button>
            {method === "EMAIL" && <Button variant="ghost" size="sm" onClick={resendEmailCode}>Resend code</Button>}
            <Button variant="ghost" size="sm" onClick={reset}>Cancel</Button>
          </div>
        </>
      )}

      {flow === "backupCodes" && (
        <>
          <div className="flex items-center gap-2 t-label" style={{ color: "var(--ink-900)", marginBottom: 4 }}>
            <ShieldCheck size={16} style={{ color: "var(--moss-700)" }} /> Two-factor authentication enabled
          </div>
          <p className="t-body-sm" style={{ color: "var(--ink-500)", marginBottom: 10 }}>
            Save these backup codes somewhere safe — each one can be used once if you lose access to your {method === "EMAIL" ? "email" : "authenticator"}.
          </p>
          <div className="grid grid-cols-2 gap-1.5 rounded-[8px] p-3" style={{ background: "var(--paper-2)", fontFamily: "monospace" }}>
            {backupCodes.map((c) => <span key={c} className="t-body-sm">{c}</span>)}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyBackupCodes}>
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />} {copied ? "Copied" : "Copy codes"}
            </Button>
            <Button size="sm" onClick={reset}>Done</Button>
          </div>
        </>
      )}

      {flow === "disable" && (
        <>
          <div className="t-label" style={{ color: "var(--ink-900)", marginBottom: 8 }}>Confirm your password to disable 2FA</div>
          <div className="grid max-w-[280px] gap-2.5">
            <Input type="password" placeholder="Password" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} />
            <Input placeholder="2FA code (optional)" value={disableCode} onChange={(e) => setDisableCode(e.target.value)} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" disabled={busy || !disablePassword} onClick={disable} style={{ background: "var(--err-500)" }}>{busy ? "Disabling..." : "Disable 2FA"}</Button>
            <Button variant="ghost" size="sm" onClick={reset}>Cancel</Button>
          </div>
        </>
      )}
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
          <TwoFactorRow />
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
