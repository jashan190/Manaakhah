import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, PH, ManCard } from "@/components/man/primitives";
import { SiteFooter } from "@/components/site-footer";
import { Search, Info, ShieldCheck, Store, Tag as TagIcon, ChevronRight } from "lucide-react";

const cats = [
  { Icon: Info, t: "General", n: 24 },
  { Icon: ShieldCheck, t: "Halal verification", n: 18 },
  { Icon: Store, t: "Business owners", n: 32 },
  { Icon: TagIcon, t: "Billing", n: 12 },
];

const faqs: [string, string][] = [
  ["How is a business verified halal on Manaakhah?", "We cross-reference active certifications from HFSAA, HMS, IFANCA, and Zabihah. Owners can also upload supplementary documentation reviewed by our team."],
  ["What's the difference between 'Verified' and 'Claimed'?", "Claimed means an owner has verified they run the business. Verified means we've also confirmed an active halal certification with a recognised body."],
  ["How do I report a listing that's no longer halal?", "Open the business profile, tap the certification block, then 'Report issue'. Halal disputes are prioritised and reviewed within 48 hours."],
  ["Is Manaakhah free for users?", "Yes, completely. Businesses can list for free; paid tiers add owner tools like analytics, lead inbox, and promotions."],
  ["Which areas do you cover?", "We started in the Sacramento area and are expanding city by city across California."],
  ["Can I save businesses to share with family?", "Yes — sign in, save businesses to a list, and share the list with a public link."],
];

const chips = ["Halal verification", "Claiming a listing", "Pricing", "Reviews", "Account & settings"];

export default function HelpPage() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <section style={{ background: "var(--paper-2)" }} className="px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <Tag>Help Center</Tag>
          <h1 className="t-h1" style={{ color: "var(--ink-900)", marginTop: 12, fontSize: 44 }}>How Can We Help?</h1>
          <div className="man-field-wrap mt-5 flex max-w-[600px] items-center gap-2 rounded-full border bg-white px-4 py-3">
            <Search size={18} style={{ color: "var(--ink-400)" }} />
            <input placeholder="Search articles, e.g. 'how to claim my listing'" className="w-full bg-transparent t-body outline-none" style={{ color: "var(--ink-900)" }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="t-body-sm rounded-full border bg-white px-3 py-1.5" style={{ borderColor: "var(--card-edge)", color: "var(--ink-700)" }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-8 px-6 py-12 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 10 }}>Categories</div>
          {cats.map(({ Icon, t, n }) => (
            <ManCard key={t} style={{ padding: 14, marginBottom: 8 }} className="flex items-center gap-3">
              <Icon size={18} style={{ color: "var(--moss-700)" }} />
              <div className="flex-1">
                <div className="t-label" style={{ color: "var(--ink-900)" }}>{t}</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{n} articles</div>
              </div>
              <ChevronRight size={14} style={{ color: "var(--ink-400)" }} />
            </ManCard>
          ))}
        </div>

        <div>
          <PH title="Frequently Asked" sub="Updated weekly · most-asked first" />
          {faqs.map(([q, a], i) => (
            <ManCard key={q} style={{ marginBottom: 10 }}>
              <details open={i === 0} className="group p-[18px]">
                <summary className="t-h4 flex cursor-pointer list-none items-center justify-between gap-4" style={{ color: "var(--ink-900)", fontSize: 15.5 }}>
                  {q}
                  <span className="t-h4" style={{ color: "var(--ink-500)" }}>+</span>
                </summary>
                <p className="t-body" style={{ color: "var(--ink-700)", marginTop: 10 }}>{a}</p>
              </details>
            </ManCard>
          ))}
          <div className="mt-4 rounded-[14px] p-[22px]" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Still Need Help?</div>
            <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 6 }}>Our team replies within one business day.</p>
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <a href="mailto:support@manaakhah.com"><Button size="sm">Contact Support</Button></a>
              <Link href="/register" className="t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>New to Manaakhah? Create a free account →</Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
