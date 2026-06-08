import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag, ManCard, Check } from "@/components/man/primitives";
import { ShieldCheck, Tag as TagIcon, Info, ArrowRight } from "lucide-react";

const claimNeeds = ["Business name & address", "Phone number on the listing", "A business license or utility bill"];
const addNeeds = ["Business name, category & address", "Proof of ownership", "3+ photos of your shop"];
const help = [
  { Icon: ShieldCheck, t: "How verification works", d: "We confirm Muslim ownership, and cross-check halal certification (HFSAA, HMS, IFANCA) for food businesses." },
  { Icon: TagIcon, t: "Pricing & plans", d: "Free forever for basic listings. Pro from $29/mo." },
  { Icon: Info, t: "Watch a 2-min demo", d: "See the dashboard, lead inbox, and review tools." },
];

export default function OwnerHome() {
  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-10 md:px-14">
      <div className="mx-auto max-w-[1100px]">
        <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Welcome to Manaakhah for business</div>
        <h1 className="t-h1" style={{ color: "var(--ink-900)", marginTop: 8, fontSize: 42, maxWidth: 600 }}>Two paths to get listed.</h1>
        <p className="t-body-lg" style={{ color: "var(--ink-500)", marginTop: 8, maxWidth: 560 }}>
          Claim your existing listing on Manaakhah, or add your business from scratch. Both end with verified status.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
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

        <div className="mt-8 grid gap-3.5 md:grid-cols-3">
          {help.map(({ Icon, t, d }) => (
            <ManCard key={t} style={{ padding: 18 }}>
              <Icon size={18} style={{ color: "var(--moss-700)" }} />
              <div className="t-label" style={{ color: "var(--ink-900)", marginTop: 10 }}>{t}</div>
              <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>{d}</p>
            </ManCard>
          ))}
        </div>
      </div>
    </div>
  );
}
