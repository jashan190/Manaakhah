import * as React from "react";
import { type LucideIcon } from "lucide-react";

/* ── EmptyState: icon + title + description + optional action ───── */
export function EmptyState({
  Icon,
  title,
  description,
  action,
}: {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--paper-2)" }}>
        <Icon size={24} style={{ color: "var(--ink-400)" }} />
      </span>
      <h3 className="t-h4" style={{ color: "var(--ink-900)", marginTop: 16 }}>{title}</h3>
      {description && (
        <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 6, maxWidth: 360 }}>{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
