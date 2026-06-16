"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Seal, Tag, ManCard, PH } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download, Flag, Check, ShieldCheck } from "lucide-react";

const grid = [
  ["Certificate ID", "HFSAA-2026-04821"], ["Issued", "Jan 14, 2026"],
  ["Expires", "Jan 14, 2027"], ["Last audit", "Apr 2, 2026"],
  ["Slaughter method", "Hand-slaughtered (zabiha)"], ["Stunning", "None"],
  ["Supply chain", "Verified end-to-end"], ["Cross-contamination", "Segregated prep"],
];
const audits = ["Apr 2, 2026", "Oct 2, 2025", "Apr 5, 2025", "Oct 1, 2024"];

export default function CertificationPage() {
  const { id } = useParams();
  const [name, setName] = useState("this business");
  useEffect(() => { fetch(`/api/businesses/${id}`).then((r) => r.json()).then((d) => d?.name && setName(d.name)).catch(() => {}); }, [id]);

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[1100px]">
        <Link href={`/business/${id}`} className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={14} /> Back to {name}
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <Seal size={56} />
          <div>
            <h1 className="t-h2" style={{ color: "var(--ink-900)" }}>HFSAA Halal Certificate</h1>
            <div className="mt-1"><Tag tone="ok">Active</Tag></div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <ManCard style={{ padding: 24 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>{name}</div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Issued by Halal Food Standards Alliance of America</div>
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                {grid.map(([k, v]) => (
                  <div key={k}>
                    <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>{k}</div>
                    <div className="t-body" style={{ color: "var(--ink-900)", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </ManCard>

            <div className="mt-6">
              <PH title="Audit History" />
              <ManCard>
                {audits.map((d, i) => (
                  <div key={d} className="flex items-center justify-between p-3.5" style={{ borderBottom: i === audits.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                    <span className="t-body" style={{ color: "var(--ink-900)" }}>{d}</span>
                    <Tag tone="ok" leading={<Check size={12} />}>Pass</Tag>
                  </div>
                ))}
              </ManCard>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-4 w-4" /> View on HFSAA.org</Button>
              <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Download PDF</Button>
              <Button variant="outline" size="sm" style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}><Flag className="mr-1.5 h-4 w-4" /> Report Issue</Button>
            </div>
          </div>

          <div className="space-y-4">
            <ManCard style={{ padding: 20 }}>
              <ShieldCheck size={20} style={{ color: "var(--moss-700)" }} />
              <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 8 }}>How We Verify</div>
              <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>We sync certification data nightly from the certifying body and remove badges within 24h if a certification lapses.</p>
            </ManCard>
            <div className="rounded-[12px] p-5" style={{ background: "var(--clay-50)", border: "1px solid var(--clay-100)" }}>
              <div className="t-h4" style={{ color: "var(--clay-700)" }}>Have Concerns?</div>
              <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 4 }}>If something looks off, report it — halal disputes are reviewed within 48 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
