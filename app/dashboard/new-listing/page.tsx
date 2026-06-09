"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, PH, Seal, Tag } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Checkbox } from "@/components/man/Choice";
import { DatePicker } from "@/components/man/DatePicker";

const opts = (...l: string[]) => l.map((s) => ({ value: s, label: s }));
import { ArrowLeft, ArrowRight, Check, Plus, MapPin, Clock, Image as ImageIcon, BadgeCheck } from "lucide-react";

const STEPS = ["Basics", "Address & hours", "Halal details", "Photos", "Review"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fieldCls = "w-full rounded-[10px] border bg-white px-3.5 py-2.5 t-body outline-none";
const fs = { borderColor: "var(--card-edge)", color: "var(--ink-900)" } as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

export default function NewListingPage() {
  const [step, setStep] = useState(0);
  const last = STEPS.length - 1;

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[820px]">
        <Link href="/for-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back to owner home</Link>
        <PH title="Add Your Business" sub="A few quick steps, then our team verifies you" />

        {/* Stepper */}
        <div className="mb-6 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1.5">
              <button onClick={() => setStep(i)} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full t-body-xs" style={i < step ? { background: "var(--moss-700)", color: "var(--bone)" } : i === step ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--paper-2)", color: "var(--ink-400)", border: "1px solid var(--card-edge)" }}>
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                <span className="t-body-sm hidden sm:inline" style={{ color: i === step ? "var(--ink-900)" : "var(--ink-500)" }}>{s}</span>
              </button>
              {i < last && <div className="h-px flex-1" style={{ background: i < step ? "var(--moss-700)" : "var(--card-edge)" }} />}
            </div>
          ))}
        </div>

        <ManCard style={{ padding: 28 }}>
          {step === 0 && (
            <div className="grid gap-4">
              <Field label="Business name"><input className={fieldCls} style={fs} placeholder="e.g. Famous Kabob" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category"><Select defaultValue="Restaurant" options={opts("Restaurant", "Grocery & market", "Café & bakery", "Salon & barber", "Jewelry", "Modest fashion", "Professional services", "Home services")} /></Field>
                <Field label="Price range"><Select defaultValue="$$ — Moderate" options={opts("$ — Budget", "$$ — Moderate", "$$$ — Upscale")} /></Field>
              </div>
              <Field label="Short description"><textarea className={fieldCls} style={{ ...fs, minHeight: 96, resize: "vertical" }} placeholder="One or two sentences about what makes your business special." /></Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4">
              <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)" }}><MapPin size={18} style={{ color: "var(--moss-700)" }} /> Location</div>
              <Field label="Street address"><input className={fieldCls} style={fs} defaultValue="1290 Fulton Ave" /></Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City"><input className={fieldCls} style={fs} defaultValue="Sacramento" /></Field>
                <Field label="State"><input className={fieldCls} style={fs} defaultValue="CA" /></Field>
                <Field label="ZIP"><input className={fieldCls} style={fs} defaultValue="95825" /></Field>
              </div>
              <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)", marginTop: 8 }}><Clock size={18} style={{ color: "var(--moss-700)" }} /> Opening hours</div>
              <div className="grid gap-2">
                {DAYS.map((d, i) => (
                  <div key={d} className="flex items-center gap-3">
                    <span className="t-body-sm" style={{ color: "var(--ink-700)", width: 96 }}>{d}</span>
                    <input className="rounded-[8px] border bg-white px-2.5 py-1.5 t-body-sm outline-none" style={fs} defaultValue="11:00" disabled={i === 6} />
                    <span className="t-body-sm" style={{ color: "var(--ink-400)" }}>–</span>
                    <input className="rounded-[8px] border bg-white px-2.5 py-1.5 t-body-sm outline-none" style={fs} defaultValue="22:00" disabled={i === 6} />
                    <Checkbox className="ml-auto" defaultChecked={i === 6} label="Closed" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)" }}><BadgeCheck size={18} style={{ color: "var(--moss-700)" }} /> Halal details</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Certifying body"><Select defaultValue="HFSAA" options={opts("HFSAA", "HMS", "IFANCA", "Self-certified", "Not applicable")} /></Field>
                <Field label="Certificate expiry"><DatePicker placeholder="Select expiry date" /></Field>
              </div>
              <Field label="What&apos;s halal here?">
                <div className="grid gap-2 sm:grid-cols-2">
                  {["All meat is zabihah", "Separate halal kitchen", "No alcohol served", "Vegetarian options"].map((o) => (
                    <div key={o} className="flex items-center rounded-[10px] border px-3 py-2.5" style={{ borderColor: "var(--card-edge)" }}><Checkbox defaultChecked label={o} /></div>
                  ))}
                </div>
              </Field>
              <div className="flex items-start gap-3 rounded-[10px] p-3.5" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
                <Seal size={22} />
                <p className="t-body-sm" style={{ color: "var(--ink-700)" }}>Upload your certificate on the next step. Our verification team cross-checks it with the issuing body before your Seal goes live.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)" }}><ImageIcon size={18} style={{ color: "var(--moss-700)" }} /> Photos & documents</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[12px] border-2 border-dashed t-body-xs" style={{ borderColor: "var(--card-edge)", color: "var(--ink-500)" }}><Plus size={20} /> Cover photo</button>
                {[1, 2, 3].map((i) => (
                  <button key={i} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[12px] border-2 border-dashed t-body-xs" style={{ borderColor: "var(--card-edge)", color: "var(--ink-500)" }}><Plus size={20} /> Add photo</button>
                ))}
              </div>
              <Field label="Halal certificate (PDF or image)">
                <button className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed py-5 t-body-sm" style={{ borderColor: "var(--card-edge)", color: "var(--ink-500)" }}><Plus size={16} /> Upload certificate</button>
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Review & Submit</div>
              {[["Business", "Famous Kabob · Restaurant · $$"], ["Address", "1290 Fulton Ave, Sacramento, CA 95825"], ["Hours", "Mon–Sat 11:00–22:00 · Sun closed"], ["Halal", "HFSAA · Zabihah · No alcohol"], ["Photos", "Cover + 3 photos · certificate attached"]].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: "1px dashed var(--card-edge)" }}>
                  <span className="t-eyebrow" style={{ color: "var(--ink-500)" }}>{k}</span>
                  <span className="t-body-sm" style={{ color: "var(--ink-900)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div className="flex items-center gap-2"><Tag tone="warn">Pending Verification</Tag><span className="t-body-sm" style={{ color: "var(--ink-500)" }}>Most listings are reviewed within 2 business days.</span></div>
            </div>
          )}
        </ManCard>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Save Draft</Button>
            {step < last
              ? <Button size="sm" onClick={() => setStep(step + 1)}>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              : <Link href="/dashboard"><Button size="sm">Submit for verification <Check className="ml-1.5 h-4 w-4" /></Button></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
