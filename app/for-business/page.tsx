import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, PH, ManCard, Check } from "@/components/man/primitives";
import { SiteFooter } from "@/components/site-footer";
import { TrendingUp, Users, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";

const claimNeeds = ["Business name & address", "Phone number on the listing", "A business license or utility bill"];
const addNeeds = ["Business name, category & address", "Proof of ownership", "3+ photos of your shop"];

const props = [
  { Icon: TrendingUp, t: "+38% inquiries", d: "Average lift after verification, vs unclaimed listings." },
  { Icon: Users, t: "Sacramento reach", d: "Active intent from people searching for Muslim-owned businesses — not idle browsing." },
  { Icon: ShieldCheck, t: "Trusted verification", d: "Ownership verified — with halal certification cross-checked for food businesses." },
  { Icon: MessageCircle, t: "Direct messaging", d: "Customers ask, you reply. No phone tag, no missed leads." },
];

const tiers = [
  { n: "Free", p: "$0", s: "/forever", featured: false, f: ["Verified business profile", "Up to 5 photos", "Basic analytics", "Reviews & responses"] },
  { n: "Pro", p: "$29", s: "/month", featured: true, f: ["Everything in Free", "Unlimited photos & menu", "Lead inbox + quick replies", "Promotions & events", "Saved-search alerts to customers"] },
  { n: "Premier", p: "$99", s: "/month", featured: false, f: ["Everything in Pro", "Featured placement", "AI-suggested review replies", "Direct line to verification team", "Multi-location dashboard"] },
];

export default function ForBusinessPage() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <section className="mx-auto max-w-[820px] px-6 py-16 text-center">
        <Tag tone="clay">For owners</Tag>
        <h1 className="t-h1" style={{ color: "var(--ink-900)", marginTop: 14, fontSize: 48 }}>Get found, get verified, grow.</h1>
        <p className="t-body-lg" style={{ color: "var(--ink-500)", margin: "14px auto 0", maxWidth: 580 }}>
          Claim your listing in 3 minutes. Verify in 7 days. Reach the Sacramento community actively searching for Muslim-owned businesses.
        </p>
        <div className="mt-6 flex justify-center gap-2.5">
          <Link href="#get-listed"><Button size="lg">Get listed</Button></Link>
          <Link href="/help"><Button size="lg" variant="outline">Watch demo (2 min)</Button></Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-3.5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {props.map(({ Icon, t, d }) => (
          <ManCard key={t} style={{ padding: 20 }}>
            <Icon size={20} style={{ color: "var(--moss-700)" }} />
            <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 10 }}>{t}</div>
            <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>{d}</p>
          </ManCard>
        ))}
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <PH title="Simple Pricing" sub="Cancel anytime. No setup fees. No long-term contracts." />
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <ManCard key={t.n} style={{ padding: 26, position: "relative", border: t.featured ? "2px solid var(--moss-700)" : "1px solid var(--card-edge)" }}>
              {t.featured && (
                <div className="t-eyebrow" style={{ position: "absolute", top: -12, left: 26, padding: "4px 10px", borderRadius: 999, background: "var(--moss-700)", color: "var(--bone)" }}>Most popular</div>
              )}
              <div className="t-h3" style={{ color: "var(--ink-900)" }}>{t.n}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="t-h1" style={{ color: "var(--ink-900)", fontSize: 40 }}>{t.p}</span>
                <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>{t.s}</span>
              </div>
              <Link href="#get-listed" className="mt-4 block"><Button className="w-full" variant={t.featured ? "default" : "outline"}>{t.n === "Free" ? "Start free" : `Choose ${t.n}`}</Button></Link>
              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--card-edge)" }}>
                {t.f.map((f) => (
                  <div key={f} className="flex items-center gap-2" style={{ padding: "5px 0" }}>
                    <Check size={14} style={{ color: "var(--moss-700)", flexShrink: 0 }} />
                    <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </ManCard>
          ))}
        </div>
      </section>

      {/* Choose a path — claim an existing listing or add a new one */}
      <section id="get-listed" className="mx-auto max-w-[1100px] px-6 py-14" style={{ scrollMarginTop: 80 }}>
        <PH title="Two Ways to Get Listed" sub="Claim an existing listing, or add your business from scratch. Both end with verified status." />
        <div className="grid gap-4 md:grid-cols-2">
          {/* Claim */}
          <ManCard style={{ padding: 26 }}>
            <Tag tone="moss">Most owners</Tag>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12 }}>Claim an existing listing</div>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 6 }}>
              We&apos;ve already indexed 110+ Sacramento businesses. Search yours, prove ownership, and take over the listing.
            </p>
            <div style={{ marginTop: 16, padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>What you&apos;ll need</div>
              <div className="mt-2 grid gap-1.5">
                {claimNeeds.map((t) => (
                  <div key={t} className="flex items-center gap-2"><Check size={13} style={{ color: "var(--moss-700)" }} /><span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{t}</span></div>
                ))}
              </div>
            </div>
            <Link href="/claim-business"><Button className="mt-4">Claim a listing <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 8 }}>Avg. time: 4 min</div>
          </ManCard>

          {/* Add new */}
          <ManCard style={{ padding: 26 }}>
            <Tag>Not yet listed</Tag>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12 }}>Add a new business</div>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 6 }}>
              Brand new, recently moved, or just not on Manaakhah yet? Create the listing and we&apos;ll route it through verification.
            </p>
            <div style={{ marginTop: 16, padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>What you&apos;ll need</div>
              <div className="mt-2 grid gap-1.5">
                {addNeeds.map((t) => (
                  <div key={t} className="flex items-center gap-2"><Check size={13} style={{ color: "var(--moss-700)" }} /><span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{t}</span></div>
                ))}
              </div>
            </div>
            <Link href="/dashboard/new-listing"><Button variant="outline" className="mt-4">Add a new business <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 8 }}>Avg. time: 12 min</div>
          </ManCard>
        </div>
      </section>

      {/* Terminal CTA — single clear action */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }}>
        <div className="mx-auto max-w-[1100px] px-6 py-12 text-center">
          <h2 className="t-h2" style={{ color: "var(--bone)" }}>Ready to get found?</h2>
          <p style={{ marginTop: 10, opacity: 0.85, fontSize: 15 }}>Claim an existing listing or add a new one — it&apos;s free to start.</p>
          <div className="mt-6 flex justify-center">
            <Link href="#get-listed"><Button size="lg" style={{ background: "var(--bone)", color: "var(--moss-800)" }}>Get listed</Button></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
