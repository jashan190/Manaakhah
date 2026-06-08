import * as React from "react";
import { Star, Check } from "lucide-react";

/* ── Seal: the verified-halal wax stamp (clay) ─────────────────── */
export function Seal({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="32" cy="32" r="30" fill="var(--clay-100)" stroke="var(--clay-700)" strokeWidth="2" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="var(--clay-700)" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M21 33 L28.5 40.5 L43 24" fill="none" stroke="var(--clay-700)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Tag: small metadata pill ──────────────────────────────────── */
const TAG_TONES: Record<string, { bg: string; fg: string }> = {
  default: { bg: "var(--paper-2)", fg: "var(--ink-700)" },
  moss: { bg: "var(--moss-50)", fg: "var(--moss-700)" },
  clay: { bg: "var(--clay-50)", fg: "var(--clay-700)" },
  ok: { bg: "#dcefe4", fg: "#1f6f47" },
  warn: { bg: "#fbedd0", fg: "#7a5818" },
  err: { bg: "#fadfdb", fg: "#9b2e25" },
};
export function Tag({ tone = "default", leading, children }: { tone?: keyof typeof TAG_TONES; leading?: React.ReactNode; children: React.ReactNode }) {
  const t = TAG_TONES[tone];
  return (
    <span className="t-body-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: t.bg, color: t.fg, fontWeight: 500 }}>
      {leading}{children}
    </span>
  );
}

/* ── Rating: stars + value + count ─────────────────────────────── */
export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
      <Star size={14} fill="var(--clay-500)" stroke="none" />
      <strong style={{ fontWeight: 600 }}>{value.toFixed(1)}</strong>
      {count != null && <span style={{ color: "var(--ink-500)" }}>· {count} reviews</span>}
    </span>
  );
}

/* ── PH: section header ────────────────────────────────────────── */
export function PH({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="t-h3" style={{ color: "var(--ink-900)" }}>{title}</h2>
        {sub && <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────── */
export function ManCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "var(--card)", border: "1px solid var(--card-edge)", borderRadius: 14, boxShadow: "var(--shadow-soft)", ...style }}>
      {children}
    </div>
  );
}

/* ── Avatar: initials on warm tone ─────────────────────────────── */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="t-label inline-flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: "var(--moss-100)", color: "var(--moss-700)", flexShrink: 0 }}>
      {initials}
    </span>
  );
}

/* ── Photo: real image, or deterministic warm gradient placeholder ─ */
export function Photo({ src, alt = "", seed = "x", h = 220, w, radius = 12, label }: { src?: string; alt?: string; seed?: string; h?: number; w?: number; radius?: number; label?: string }) {
  let hash = 0; for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 40 + 20; // warm range
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" style={{ width: w ?? "100%", height: h, objectFit: "cover", borderRadius: radius, display: "block" }} />;
  }
  return (
    <div style={{ width: w ?? "100%", height: h, borderRadius: radius, background: `linear-gradient(135deg, hsl(${hue} 30% 88%), hsl(${hue + 15} 25% 78%))`, display: "flex", alignItems: "flex-end", padding: 12 }}>
      {label && <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{label}</span>}
    </div>
  );
}

/* ── StatCard: KPI tile ────────────────────────────────────────── */
export function StatCard({ label, value, sub, delta, deltaTone = "ok", Icon }: { label: string; value: string; sub?: string; delta?: string; deltaTone?: "ok" | "err"; Icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }) {
  return (
    <ManCard style={{ padding: 18 }}>
      <div className="flex items-start justify-between">
        <span className="t-eyebrow" style={{ color: "var(--ink-500)" }}>{label}</span>
        {Icon && <Icon size={16} style={{ color: "var(--ink-400)" }} />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="t-h2" style={{ color: "var(--ink-900)" }}>{value}</span>
        {delta && <span className="t-body-sm" style={{ fontWeight: 600, color: deltaTone === "err" ? "var(--err-500)" : "var(--ok-500)" }}>{delta}</span>}
      </div>
      {sub && <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{sub}</div>}
    </ManCard>
  );
}

export function Divider({ style }: { style?: React.CSSProperties }) {
  return <div style={{ borderTop: "1px solid var(--hairline)", ...style }} />;
}

export { Check };
