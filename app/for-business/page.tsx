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

export default function ForBusinessPage() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <section className="mx-auto max-w-[820px] px-6 py-16 text-center">
        <Tag tone="clay">For Owners</Tag>
        <h1 className="t-h1" style={{ color: "var(--ink-900)", marginTop: 12, fontSize: 48 }}>Get Found, Get Verified, Grow.</h1>
        <p className="t-body-lg" style={{ color: "var(--ink-500)", margin: "12px auto 0", maxWidth: 580 }}>
          Claim your listing in 3 minutes. Verify in 7 days. Reach the Sacramento community actively searching for Muslim-owned businesses.
        </p>
        <div className="mt-6 flex justify-center gap-2.5">
          <Link href="#get-listed"><Button size="lg">Get Listed</Button></Link>
          <Link href="/help"><Button size="lg" variant="outline">Watch Demo (2 Min)</Button></Link>
        </div>
      </section>

      {/* Choose a path — primary action, moved up */}
      <section id="get-listed" className="mx-auto max-w-[1100px] px-6 pb-14" style={{ scrollMarginTop: 80 }}>
        <PH title="Two Ways to Get Listed" sub="Claim an existing listing, or add your business from scratch. Both end with verified status." />
        <div className="grid gap-4 md:grid-cols-2">
          {/* Claim */}
          <ManCard style={{ padding: 24 }}>
            <Tag tone="moss">Most Owners</Tag>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12 }}>Claim an Existing Listing</div>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 4 }}>
              We&apos;re indexing Muslim-owned businesses across Sacramento. Search yours, prove ownership, and take over the listing.
            </p>
            <div style={{ marginTop: 16, padding: 16, background: "var(--paper-2)", borderRadius: 8 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>What you&apos;ll need</div>
              <div className="mt-2 grid gap-1.5">
                {claimNeeds.map((t) => (
                  <div key={t} className="flex items-center gap-2"><Check size={13} style={{ color: "var(--moss-700)" }} /><span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{t}</span></div>
                ))}
              </div>
            </div>
            <Link href="/claim-business"><Button className="mt-4">Claim a Listing <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 8 }}>Avg. time: 4 min</div>
          </ManCard>

          {/* Add new */}
          <ManCard style={{ padding: 24 }}>
            <Tag>Not Yet Listed</Tag>
            <div className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12 }}>Add a New Business</div>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 4 }}>
              Brand new, recently moved, or just not on Minara yet? Create the listing and we&apos;ll route it through verification.
            </p>
            <div style={{ marginTop: 16, padding: 16, background: "var(--paper-2)", borderRadius: 8 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>What you&apos;ll need</div>
              <div className="mt-2 grid gap-1.5">
                {addNeeds.map((t) => (
                  <div key={t} className="flex items-center gap-2"><Check size={13} style={{ color: "var(--moss-700)" }} /><span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{t}</span></div>
                ))}
              </div>
            </div>
            <Link href="/register?role=owner&next=%2Fdashboard%2Fnew-listing"><Button variant="outline" className="mt-4">Add a New Business <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 8 }}>Avg. time: 12 min</div>
          </ManCard>
        </div>
      </section>

      {/* Why list — value props */}
      <section className="mx-auto grid max-w-[1200px] gap-3.5 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {props.map(({ Icon, t, d }) => (
          <ManCard key={t} style={{ padding: 20 }}>
            <Icon size={20} style={{ color: "var(--moss-700)" }} />
            <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 8 }}>{t}</div>
            <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>{d}</p>
          </ManCard>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
