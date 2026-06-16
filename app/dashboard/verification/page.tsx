"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, PH, Seal, Tag, Photo } from "@/components/man/primitives";
import { ArrowLeft, Phone, Mail, FileText, Check } from "lucide-react";

const METHODS = [
  { k: "phone", Icon: Phone, title: "Phone call", desc: "We call the number on your public listing and read a 6-digit code.", detail: "(916) 483-1700" },
  { k: "email", Icon: Mail, title: "Business email", desc: "We email a verification link to an address at your business domain.", detail: "owner@famouskabob.com" },
  { k: "docs", Icon: FileText, title: "Upload a document", desc: "Send a business license or recent utility bill in your name.", detail: "PDF, JPG or PNG" },
];

export default function VerificationPage() {
  const [method, setMethod] = useState("phone");
  const [sent, setSent] = useState(false);

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[760px]">
        <Link href="/claim-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back to claim</Link>
        <PH title="Verify Ownership" sub="One quick check confirms you represent this business" />

        {/* Business being claimed */}
        <ManCard style={{ padding: 14, marginBottom: 18 }} className="flex items-center gap-4">
          <Photo seed="sac-famous-kabob" w={72} h={56} radius={8} />
          <div className="flex-1">
            <div className="flex items-center gap-2"><Seal size={16} /><div className="t-label" style={{ color: "var(--ink-900)" }}>Famous Kabob</div></div>
            <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>1290 Fulton Ave, Sacramento, CA 95825</div>
          </div>
          <Tag tone="warn">Unclaimed</Tag>
        </ManCard>

        {!sent ? (
          <>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 10 }}>Choose how to verify</div>
            <div className="grid gap-3">
              {METHODS.map((m) => {
                const on = method === m.k;
                return (
                  <button key={m.k} onClick={() => setMethod(m.k)} className="man-focus flex items-start gap-3.5 rounded-[12px] p-4 text-left transition-colors" style={{ background: "#ffffff", border: on ? "1.5px solid var(--moss-700)" : "1px solid var(--card-edge)" }}>
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" style={{ background: on ? "var(--moss-50)" : "var(--paper-2)" }}><m.Icon size={18} style={{ color: on ? "var(--moss-700)" : "var(--ink-500)" }} /></span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="t-label" style={{ color: "var(--ink-900)" }}>{m.title}</div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full" style={on ? { background: "var(--moss-700)" } : { border: "1.5px solid var(--card-edge)" }}>{on && <Check size={11} style={{ color: "var(--bone)" }} />}</span>
                      </div>
                      <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{m.desc}</div>
                      {on && <div className="mt-2.5 inline-flex rounded-[8px] px-2.5 py-1.5 t-body-sm" style={{ background: "var(--paper-2)", color: "var(--ink-900)" }}>{m.detail}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <Link href="/claim-business"><Button variant="ghost" size="sm">Cancel</Button></Link>
              <Button size="sm" onClick={() => setSent(true)}>Send Verification</Button>
            </div>
          </>
        ) : (
          <ManCard style={{ padding: 28 }}>
            <div className="flex items-start gap-3 rounded-[8px] p-3.5" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
              <Seal size={24} />
              <div><div className="t-label" style={{ color: "var(--ink-900)" }}>Verification on its way</div><div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>{method === "phone" ? "We're calling (916) 483-1700 now — enter the 6-digit code you hear." : method === "email" ? "Check owner@famouskabob.com for a verification link." : "Our team will review your document within 1 business day."}</div></div>
            </div>
            {method === "phone" && (
              <div className="mt-5">
                <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>Enter code</div>
                <div className="flex gap-2">{[0, 1, 2, 3, 4, 5].map((i) => <input key={i} maxLength={1} className="man-field h-12 w-12 text-center t-h4" style={{ color: "var(--ink-900)" }} />)}</div>
              </div>
            )}
            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSent(false)}>Try Another Method</Button>
              <Link href="/dashboard/onboarding"><Button size="sm">Confirm & Continue</Button></Link>
            </div>
          </ManCard>
        )}
      </div>
    </div>
  );
}
