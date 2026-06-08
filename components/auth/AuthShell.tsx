import Link from "next/link";

/**
 * AuthShell — a single, centered column with just the essentials (logo, form, footer).
 * Quote/author/role props are accepted for backwards-compatibility but no longer rendered.
 */
export function AuthShell({
  children,
}: {
  children: React.ReactNode;
  quote?: string;
  author?: string;
  role?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-8" style={{ background: "var(--paper)" }}>
      <Link href="/" className="t-h3" style={{ color: "var(--moss-700)" }}>Manaakhah</Link>
      <div className="flex w-full flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <p className="t-body-sm" style={{ color: "var(--ink-400)" }}>© 2026 Manaakhah. All rights reserved.</p>
    </div>
  );
}
