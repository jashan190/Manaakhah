import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, Photo } from "@/components/man/primitives";
import { SiteFooter } from "@/components/site-footer";

const ABOUT_IMG = "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=70";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <Tag tone="moss">Our Story</Tag>
        <h1 className="t-h1" style={{ color: "var(--ink-900)", marginTop: 14, fontSize: 50, maxWidth: 720 }}>
          We started Manaakhah because finding Muslim-owned businesses you can trust shouldn&apos;t feel like detective work.
        </h1>
        <p className="t-body-lg" style={{ color: "var(--ink-500)", marginTop: 18, maxWidth: 640 }}>
          For most Muslim families, finding trustworthy Muslim-owned businesses in a new city means a chain of WhatsApp messages, phone calls, and crossed fingers. We&apos;re building the directory that makes it simple to find, support, and do business within the community.
        </p>

        <div className="mt-14 grid items-start gap-8 md:grid-cols-2">
          <Photo src={ABOUT_IMG} alt="Founders" h={320} radius={12} />
          <div>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Mission</div>
            <h2 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 8 }}>Trust, Made Visible.</h2>
            <p className="t-body" style={{ color: "var(--ink-700)", marginTop: 12 }}>
              We verify Muslim ownership, layer in community knowledge, and — for halal food businesses — cross-check certification with HFSAA, HMS and IFANCA. We give owners the tools to stand behind their own listings. Trust is a stack — not a sticker.
            </p>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginTop: 28 }}>Founded</div>
            <div className="t-body" style={{ color: "var(--ink-700)", marginTop: 4 }}>Started in Sacramento, growing city by city across California.</div>
          </div>
        </div>

        <div className="mt-14">
          <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Press</div>
          <div className="mt-3 flex flex-wrap gap-3">
            {["The Sacramento Bee", "CapRadio", "Hyphen Online", "KCRA 3", "Comstock's"].map((p) => (
              <div key={p} className="t-body" style={{ padding: "10px 16px", background: "var(--paper-2)", borderRadius: 8, fontWeight: 500, color: "var(--ink-700)" }}>{p}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal CTA — never dead-end */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }}>
        <div className="mx-auto max-w-[1100px] px-6 py-12 text-center">
          <h2 className="t-h2" style={{ color: "var(--bone)" }}>Find Businesses You Can Trust.</h2>
          <p style={{ marginTop: 10, opacity: 0.85, fontSize: 15 }}>Join the community supporting Muslim-owned businesses across Sacramento.</p>
          <div className="mt-6 flex justify-center gap-2.5">
            <Link href="/register"><Button size="lg" style={{ background: "var(--bone)", color: "var(--moss-800)" }}>Sign Up Free</Button></Link>
            <Link href="/search"><Button size="lg" variant="ghost" style={{ color: "var(--bone)", border: "1px solid rgba(255,255,255,0.25)" }}>Explore Businesses</Button></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
