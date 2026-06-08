// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, PH, Tag, Avatar, Photo } from "@/components/man/primitives";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategoryGroupGrid } from "@/components/home/CategoryGroupGrid";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { SiteFooter } from "@/components/site-footer";
import { ShieldCheck, Users, Store } from "lucide-react";

const REST_IMG = "https://images.unsplash.com/photo-1600555379885-08a02224726d?auto=format&fit=crop&w=900&q=70";

// Our trust narrative — the thing Taawun doesn't have. This is Manaakhah's identity.
const trust = [
  { Icon: ShieldCheck, t: "Owner-verified", d: "We confirm every business is genuinely Muslim-owned before it goes live — so you know who you're supporting." },
  { Icon: Users, t: "Community-reviewed", d: "Real reviews from Muslims in your area, with the details that matter to you — not just a star rating." },
  { Icon: Store, t: "Certified where it counts", d: "For halal food businesses we cross-check certification (HFSAA, HMS, IFANCA). For everyone else, we verify the essentials." },
];

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <HeroSearch />
      <CategoryGroupGrid />
      <FeaturedRow />

      {/* HOW WE BUILD TRUST — our differentiator */}
      <section style={{ background: "var(--paper-2)" }}>
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <PH title="How We Build Trust" sub="Three layers of verification, never just one badge" />
          <div className="grid gap-4 md:grid-cols-3">
            {trust.map(({ Icon, t, d }) => (
              <ManCard key={t} style={{ padding: 22 }}>
                <Icon size={22} style={{ color: "var(--moss-700)" }} />
                <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 12 }}>{t}</div>
                <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 6 }}>{d}</p>
              </ManCard>
            ))}
          </div>
        </div>
      </section>

      {/* OWNER STORY */}
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <ManCard style={{ padding: 32 }} className="grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
          <Photo src={REST_IMG} alt="Owner story" h={220} radius={12} />
          <div>
            <Tag tone="clay">Owner story</Tag>
            <p className="t-h3" style={{ color: "var(--ink-900)", marginTop: 12, fontWeight: 500, fontStyle: "italic", lineHeight: 1.3 }}>
              &ldquo;We were getting one or two calls a week. After verifying with Manaakhah, we filled our Friday evenings — people walk in already trusting us.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <Avatar name="Yusuf Khan" />
              <div>
                <div className="t-label" style={{ color: "var(--ink-900)" }}>Yusuf Khan</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Owner · Famous Kabob, Sacramento</div>
              </div>
            </div>
          </div>
        </ManCard>
      </section>

      {/* FOR BUSINESSES — the owner flow */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }}>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center">
          <Store size={26} />
          <h2 className="t-h2" style={{ color: "var(--bone)" }}>Own a Muslim business?</h2>
          <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 520 }}>Get found by the community — claim your listing, get verified, and grow.</p>
          <Link href="/for-business"><Button size="lg" style={{ background: "var(--bone)", color: "var(--moss-800)" }}>List your business</Button></Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
