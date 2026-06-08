// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard } from "@/components/man/primitives";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategoryGroupGrid } from "@/components/home/CategoryGroupGrid";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { SiteFooter } from "@/components/site-footer";
import { Sparkles, Store } from "lucide-react";

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <HeroSearch />
      <CategoryGroupGrid />
      <FeaturedRow />

      {/* Engagement teaser — reserves the slot for Cycle 2 (static, no logic) */}
      <section className="mx-auto max-w-[1200px] px-6 pb-4">
        <ManCard style={{ padding: 24, background: "var(--clay-50)", border: "1px solid var(--clay-100)" }} className="flex flex-wrap items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--clay-100)" }}>
            <Sparkles size={20} style={{ color: "var(--clay-700)" }} />
          </span>
          <div className="flex-1">
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Earn points for supporting Muslim businesses</div>
            <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>Challenges, visit rewards and community perks — coming soon.</div>
          </div>
          <Tagish />
        </ManCard>
      </section>

      {/* For businesses */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }} className="mt-8">
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

function Tagish() {
  return <span className="rounded-full px-3 py-1 t-body-xs" style={{ background: "var(--clay-100)", color: "var(--clay-700)", fontWeight: 600 }}>Coming soon</span>;
}
