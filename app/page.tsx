// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, PH, Tag, Photo } from "@/components/man/primitives";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategoryGroupGrid } from "@/components/home/CategoryGroupGrid";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { HomeTabs } from "@/components/home/HomeTabs";
import { SiteFooter } from "@/components/site-footer";
import { ShieldCheck, Users, Store } from "lucide-react";

const REST_IMG = "https://images.unsplash.com/photo-1600555379885-08a02224726d?auto=format&fit=crop&w=900&q=70";

const trust = [
  { Icon: ShieldCheck, t: "Owner-verified", d: "We confirm every business is genuinely Muslim-owned before it goes live — so you know who you're supporting." },
  { Icon: Users, t: "Community-reviewed", d: "Real reviews from Muslims in your area, with the details that matter to you — not just a star rating." },
  { Icon: Store, t: "Certified where it counts", d: "For halal food businesses we cross-check certification (HFSAA, HMS, IFANCA). For everyone else, we verify the essentials." },
];

export default function Home() {
  const discoverContent = (
    <>
      <CategoryGroupGrid />
      <FeaturedRow />

      {/* HOW WE BUILD TRUST — our differentiator */}
      <section style={{ background: "var(--paper-2)" }}>
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <PH title="How We Build Trust" sub="Three layers of verification, never just one badge" />
          <div className="grid gap-4 md:grid-cols-3">
            {trust.map(({ Icon, t, d }) => (
              <ManCard key={t} style={{ padding: 20 }}>
                <Icon size={22} style={{ color: "var(--moss-700)" }} />
                <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 12 }}>{t}</div>
                <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>{d}</p>
              </ManCard>
            ))}
          </div>
        </div>
      </section>

      {/* WHY MINARA */}
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <ManCard style={{ padding: 32 }} className="grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
          <Photo src={REST_IMG} alt="" h={220} radius={12} />
          <div>
            <Tag tone="clay">Why Minara</Tag>
            <p className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12, fontWeight: 500, lineHeight: 1.3 }}>
              Finding a Muslim-owned business you can trust shouldn&apos;t take a dozen WhatsApp messages. We verify ownership, surface community reviews, and cross-check halal certification — so trust is visible before you walk in.
            </p>
            <Link href="/about" className="mt-4 inline-block t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>
              Read our story →
            </Link>
          </div>
        </ManCard>
      </section>

      {/* FOR BUSINESSES — the owner flow */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }}>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center">
          <Store size={26} />
          <h2 className="t-h2" style={{ color: "var(--bone)" }}>Own a Muslim Business?</h2>
          <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 520 }}>Get found by the community — claim your listing, get verified, and grow.</p>
          <Link href="/for-business"><Button size="lg" style={{ background: "var(--bone)", color: "var(--moss-800)" }}>List Your Business</Button></Link>
        </div>
      </section>
    </>
  );

  return (
    <div style={{ background: "var(--paper)" }}>
      <HeroSearch />
      <HomeTabs discoverContent={discoverContent} />
      <SiteFooter />
    </div>
  );
}
