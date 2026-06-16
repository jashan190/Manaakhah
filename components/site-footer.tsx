import Link from "next/link";

const cols: [string, [string, string][]][] = [
  ["Discover", [["Search businesses", "/search"], ["Categories", "/search"], ["Cities", "/search"], ["Curated lists", "/search"]]],
  ["For owners", [["Claim your listing", "/claim-business"], ["Pricing", "/for-business"], ["For businesses", "/for-business"], ["Help center", "/help"]]],
  ["Manaakhah", [["About", "/about"], ["Press", "/about"], ["Careers", "/about"], ["Contact", "/help"]]],
  ["Legal", [["Privacy", "/help"], ["Terms", "/help"], ["Cookies", "/help"], ["Halal verification policy", "/help"]]],
];

export function SiteFooter() {
  return (
    <div style={{ borderTop: "1px solid var(--card-edge)", background: "var(--paper-2)", padding: "32px 56px 28px" }}>
      <div className="flex flex-wrap justify-between gap-10" style={{ marginBottom: 24 }}>
        <div style={{ maxWidth: 320 }}>
          <div className="t-h4" style={{ color: "var(--moss-700)" }}>Manaakhah</div>
          <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 12, lineHeight: 1.5 }}>
            The trusted directory for halal &amp; Muslim-owned businesses. Verified by communities, certifiers, and the businesses themselves.
          </p>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>{h}</div>
            {items.map(([label, href]) => (
              <div key={label} className="t-body-sm" style={{ color: "var(--ink-700)", padding: "4px 0" }}>
                <Link href={href} className="hover:underline">{label}</Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between" style={{ paddingTop: 20, borderTop: "1px solid var(--card-edge)" }}>
        <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>© 2026 Manaakhah · Sacramento, CA</span>
        <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>English (US) · USD</span>
      </div>
    </div>
  );
}
