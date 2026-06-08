"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManCard, Seal, Tag, Photo, Avatar } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, ExternalLink, FileText, AlertTriangle, MapPin, Phone, Globe } from "lucide-react";

const CHECKS = [
  { l: "Certificate uploaded", ok: true, d: "HFSAA_cert_2026.pdf · 2.1 MB" },
  { l: "Cert number in HFSAA registry", ok: true, d: "Matched #HF-2024-09812" },
  { l: "Business name matches certificate", ok: true, d: "Famous Kabob LLC" },
  { l: "Address matches public records", ok: true, d: "1290 Fulton Ave, Sacramento" },
  { l: "Certificate not expired", ok: true, d: "Valid until Mar 14, 2027" },
  { l: "No duplicate active listing", ok: false, d: "Possible duplicate: ‘Famous Kabob #2’" },
];

export default function VerificationDetailPage() {
  const [decision, setDecision] = useState<null | "approved" | "rejected">(null);
  const passed = CHECKS.filter((c) => c.ok).length;

  return (
    <AdminShell active="queue">
      <div className="px-6 py-7 md:px-8">
        <Link href="/admin/businesses/review-queue" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back to queue</Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Photo seed="sac-famous-kabob" w={64} h={56} radius={10} />
            <div>
              <div className="flex items-center gap-2"><h1 className="t-h3" style={{ color: "var(--ink-900)" }}>Famous Kabob</h1><Tag tone="warn">Pending</Tag></div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>Restaurant · HFSAA · submitted 4h ago by Yusuf A.</div>
            </div>
          </div>
          <Link href="/business/sac-famous-kabob"><Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-4 w-4" /> Preview listing</Button></Link>
        </div>

        {decision && (
          <ManCard style={{ padding: 16, marginTop: 16, background: decision === "approved" ? "var(--moss-50)" : "var(--err-50, #fdecea)", border: `1px solid ${decision === "approved" ? "var(--moss-200)" : "var(--err-500)"}` }} className="flex items-center gap-3">
            {decision === "approved" ? <Seal size={22} /> : <X size={20} style={{ color: "var(--err-500)" }} />}
            <span className="t-label" style={{ color: "var(--ink-900)" }}>{decision === "approved" ? "Approved — Seal is now live on the listing." : "Rejected — owner notified with the reason below."}</span>
          </ManCard>
        )}

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
          {/* Checks */}
          <div className="grid gap-3.5">
            <ManCard style={{ padding: 22 }}>
              <div className="flex items-baseline justify-between"><div className="t-h4" style={{ color: "var(--ink-900)" }}>Automated checks</div><span className="t-body-sm" style={{ color: passed === CHECKS.length ? "var(--moss-700)" : "var(--clay-700)" }}>{passed}/{CHECKS.length} passed</span></div>
              <div className="mt-3.5 grid gap-2.5">
                {CHECKS.map((c) => (
                  <div key={c.l} className="flex items-start gap-3 pb-2.5" style={{ borderBottom: "1px dashed var(--card-edge)" }}>
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={c.ok ? { background: "var(--moss-700)" } : { background: "var(--clay-500)" }}>{c.ok ? <Check size={11} style={{ color: "var(--bone)" }} /> : <AlertTriangle size={11} style={{ color: "var(--bone)" }} />}</span>
                    <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>{c.l}</div><div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 1 }}>{c.d}</div></div>
                  </div>
                ))}
              </div>
            </ManCard>

            <ManCard style={{ padding: 22 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Submitted certificate</div>
              <div className="mt-3 flex items-center gap-3 rounded-[10px] p-3.5" style={{ background: "var(--paper-2)" }}>
                <FileText size={22} style={{ color: "var(--ink-700)" }} />
                <div className="flex-1"><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>HFSAA_cert_2026.pdf</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Issued by Halal Food Standards Alliance of America</div></div>
                <Button variant="outline" size="sm">Open</Button>
              </div>
            </ManCard>
          </div>

          {/* Decision + meta */}
          <div className="grid gap-3.5">
            <ManCard style={{ padding: 22 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Decision</div>
              <textarea placeholder="Add a note (sent to the owner if rejected)…" className="mt-3 w-full rounded-[10px] border bg-white px-3 py-2.5 t-body-sm outline-none" style={{ borderColor: "var(--card-edge)", color: "var(--ink-900)", minHeight: 80, resize: "vertical" }} />
              <div className="mt-3 grid gap-2">
                <Button onClick={() => setDecision("approved")}><Check className="mr-1.5 h-4 w-4" /> Approve & issue Seal</Button>
                <Button variant="outline" size="sm" onClick={() => setDecision("rejected")} style={{ color: "var(--err-500)", borderColor: "var(--err-500)" }}><X className="mr-1.5 h-4 w-4" /> Reject</Button>
                <Button variant="ghost" size="sm">Request more documents</Button>
              </div>
            </ManCard>

            <ManCard style={{ padding: 22 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Business details</div>
              <div className="mt-3 grid gap-2.5 t-body-sm" style={{ color: "var(--ink-700)" }}>
                <div className="flex items-center gap-2"><MapPin size={14} style={{ color: "var(--ink-400)" }} /> 1290 Fulton Ave, Sacramento, CA</div>
                <div className="flex items-center gap-2"><Phone size={14} style={{ color: "var(--ink-400)" }} /> (916) 483-1700</div>
                <div className="flex items-center gap-2"><Globe size={14} style={{ color: "var(--ink-400)" }} /> famouskabob.com</div>
              </div>
              <div className="mt-4 flex items-center gap-2"><Avatar name="Yusuf A" size={30} /><div><div className="t-label-sm" style={{ color: "var(--ink-900)" }}>Yusuf A.</div><div className="t-body-xs" style={{ color: "var(--ink-500)" }}>Owner · verified by phone</div></div></div>
            </ManCard>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
