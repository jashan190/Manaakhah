"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, PH, Seal, Tag, Photo } from "@/components/man/primitives";
import { ArrowLeft, Phone, Mail, FileText, Check, Loader2 } from "lucide-react";

const METHODS = [
  { k: "phone", Icon: Phone, title: "Phone call", desc: "We'll call the number on the public listing to confirm you represent this business." },
  { k: "email", Icon: Mail, title: "Business email", desc: "We'll reach out to an address at your business domain." },
  { k: "docs", Icon: FileText, title: "Upload a document", desc: "Send a business license or recent utility bill in your name.", detail: "PDF, JPG or PNG" },
];

type Business = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string | null;
  coverImage: string | null;
  claimStatus: string;
};

function VerificationContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  const [business, setBusiness] = useState<Business | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [method, setMethod] = useState("phone");
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) {
      setLoadingBusiness(false);
      return;
    }
    fetch(`/api/businesses/${businessId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setBusiness(d?.id ? d : null))
      .catch(() => setBusiness(null))
      .finally(() => setLoadingBusiness(false));
  }, [businessId]);

  const submit = async () => {
    if (!businessId) return;
    setSubmitting(true);
    setError("");
    try {
      let documentUrl: string | undefined;

      if (method === "docs") {
        if (!file) {
          setError("Choose a file to upload first.");
          setSubmitting(false);
          return;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl, type: "business", entityId: businessId }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        documentUrl = uploadData.url || uploadData.secure_url;
      }

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, verificationMethod: method, documentUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit verification");
      setSent(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (!businessId) {
    return (
      <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
        <div className="mx-auto max-w-[760px]">
          <Link href="/claim-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back to claim</Link>
          <PH title="Verify Ownership" sub="We couldn't find a business to verify" />
          <ManCard style={{ padding: 28 }} className="text-center">
            <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Start from the claim page so we know which business you're verifying.</div>
            <Link href="/claim-business"><Button size="sm" className="mt-4">Find Your Business</Button></Link>
          </ManCard>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[760px]">
        <Link href="/claim-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back to claim</Link>
        <PH title="Verify Ownership" sub="One quick check confirms you represent this business" />

        {/* Business being claimed */}
        {loadingBusiness ? (
          <ManCard style={{ padding: 16, marginBottom: 16 }} className="flex items-center gap-4">
            <Loader2 size={18} className="animate-spin" style={{ color: "var(--ink-400)" }} />
            <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Loading business…</div>
          </ManCard>
        ) : business ? (
          <ManCard style={{ padding: 16, marginBottom: 16 }} className="flex items-center gap-4">
            <Photo src={business.coverImage || undefined} seed={business.id} w={72} h={56} radius={8} />
            <div className="flex-1">
              <div className="flex items-center gap-2"><Seal size={16} /><div className="t-label" style={{ color: "var(--ink-900)" }}>{business.name}</div></div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{business.address}, {business.city}, {business.state}</div>
            </div>
            <Tag tone={business.claimStatus === "CLAIMED" ? "ok" : "warn"}>{business.claimStatus === "CLAIMED" ? "Claimed" : "Unclaimed"}</Tag>
          </ManCard>
        ) : (
          <ManCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="t-body-sm" style={{ color: "var(--err-500)" }}>We couldn't load this business. It may no longer exist.</div>
          </ManCard>
        )}

        {!sent ? (
          <>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>Choose how to verify</div>
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
                      {on && m.k === "phone" && business?.phone && <div className="mt-2.5 inline-flex rounded-[8px] px-2.5 py-1.5 t-body-sm" style={{ background: "var(--paper-2)", color: "var(--ink-900)" }}>{business.phone}</div>}
                      {on && m.k === "email" && business?.email && <div className="mt-2.5 inline-flex rounded-[8px] px-2.5 py-1.5 t-body-sm" style={{ background: "var(--paper-2)", color: "var(--ink-900)" }}>{business.email}</div>}
                      {on && m.k === "docs" && (
                        <div className="mt-2.5">
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="t-body-sm" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {error && <div className="mt-3 t-body-sm" style={{ color: "var(--err-500)" }}>{error}</div>}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/claim-business"><Button variant="ghost" size="sm">Cancel</Button></Link>
              <Button size="sm" onClick={submit} disabled={submitting || !business}>
                {submitting ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : null}
                Send Verification
              </Button>
            </div>
          </>
        ) : (
          <ManCard style={{ padding: 28 }}>
            <div className="flex items-start gap-3 rounded-[8px] p-3.5" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
              <Seal size={24} />
              <div>
                <div className="t-label" style={{ color: "var(--ink-900)" }}>Verification submitted</div>
                <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>
                  {method === "phone" ? "Our team will call the listed number to confirm ownership." : method === "email" ? "Our team will follow up at the business email on file." : "Our team will review your document."} You'll hear back within 1 business day.
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSent(false)}>Try Another Method</Button>
              <Link href="/dashboard"><Button size="sm">Go to Dashboard</Button></Link>
            </div>
          </ManCard>
        )}
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense>
      <VerificationContent />
    </Suspense>
  );
}
