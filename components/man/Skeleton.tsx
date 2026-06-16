import * as React from "react";

/* ── Skeleton: pulsing placeholder block ───────────────────────── */
export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: "var(--paper-2)", borderRadius: 8, ...style }}
    />
  );
}

/* ── BusinessCardSkeleton: mirrors BusinessCard layout per variant ─ */
export function BusinessCardSkeleton({ variant = "grid" }: { variant?: "grid" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="flex gap-3 rounded-[12px] p-2.5" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
        <Skeleton style={{ width: 84, height: 84, borderRadius: 8, flexShrink: 0 }} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
          <Skeleton style={{ height: 14, width: "70%" }} />
          <Skeleton style={{ height: 11, width: "45%" }} />
          <Skeleton style={{ height: 11, width: "85%", marginTop: "auto" }} />
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[12px]" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
      <Skeleton style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 0 }} />
      <div className="flex flex-col gap-2.5" style={{ padding: 16 }}>
        <Skeleton style={{ height: 15, width: "65%" }} />
        <Skeleton style={{ height: 12, width: "40%" }} />
        <Skeleton style={{ height: 12, width: "100%" }} />
        <Skeleton style={{ height: 12, width: "80%" }} />
        <div className="mt-1 flex gap-1.5">
          <Skeleton style={{ height: 18, width: 60, borderRadius: 999 }} />
          <Skeleton style={{ height: 18, width: 72, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}
