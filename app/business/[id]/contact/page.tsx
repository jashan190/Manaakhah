"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Seal, ManCard, Tag } from "@/components/man/primitives";
import { Checkbox } from "@/components/man/Choice";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Paperclip, Phone, Globe, Clock, CheckCircle2 } from "lucide-react";

const purposes = ["General question", "Booking / reservation", "Catering", "Halal details", "Other"];

export default function ContactPage() {
  const { id } = useParams();
  const [biz, setBiz] = useState<any>(null);
  const [purpose, setPurpose] = useState(purposes[0]);
  const [sent, setSent] = useState(false);
  useEffect(() => { fetch(`/api/businesses/${id}`).then((r) => r.json()).then(setBiz).catch(() => {}); }, [id]);
  const name = biz?.name || "this business";

  const field = "man-field w-full px-3.5 py-2.5 t-body";
  const fieldStyle = { color: "var(--ink-900)" } as const;

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[1100px]">
        <Link href={`/business/${id}`} className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={14} /> Back to {name}
        </Link>
        <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 14 }}>Message {name}</h1>

        {sent ? (
          <ManCard style={{ padding: 40, marginTop: 24, textAlign: "center" }} className="mx-auto max-w-[520px]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--moss-50)" }}>
              <CheckCircle2 size={30} style={{ color: "var(--moss-700)" }} />
            </div>
            <h2 className="t-h3" style={{ color: "var(--ink-900)", marginTop: 16 }}>Message sent to {name}</h2>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 8 }}>They typically reply within ~2 hours. You&apos;ll see their response in your inbox.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/inbox"><Button size="sm">Go to Inbox</Button></Link>
              <Link href={`/business/${id}`}><Button variant="outline" size="sm">Back to {name}</Button></Link>
            </div>
          </ManCard>
        ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Form */}
          <ManCard style={{ padding: 24 }}>
            <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>What's this about?</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {purposes.map((p) => (
                <button key={p} onClick={() => setPurpose(p)} className="t-body-sm rounded-full px-3 py-1.5"
                  style={purpose === p ? { background: "var(--ink-900)", color: "var(--bone)" } : { background: "var(--paper-2)", color: "var(--ink-700)" }}>{p}</button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <input className={field} style={fieldStyle} placeholder="Subject" />
              <textarea className={field} style={{ ...fieldStyle, minHeight: 120, resize: "vertical" }} placeholder="Write your message…" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={field} style={fieldStyle} placeholder="Your name" />
                <input className={field} style={fieldStyle} placeholder="Your email" type="email" />
              </div>
              <button className="t-body-sm inline-flex items-center gap-1.5" style={{ color: "var(--ink-500)" }}><Paperclip size={15} /> Add attachment</button>
              <Checkbox defaultChecked label="Send me a copy of this message" />
              <p className="t-body-xs" style={{ color: "var(--ink-400)" }}>Your email is shared with the owner only to reply.</p>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm">Save Draft</Button>
                <Button size="sm" onClick={() => setSent(true)}>Send Message</Button>
              </div>
            </div>
          </ManCard>

          {/* Aside */}
          <div className="space-y-4">
            <ManCard style={{ padding: 18 }} className="flex items-center gap-3">
              <Seal size={36} />
              <div>
                <div className="t-label" style={{ color: "var(--ink-900)" }}>{name}</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{biz ? `${biz.city}, ${biz.state}` : "Sacramento, CA"}</div>
              </div>
            </ManCard>
            <ManCard style={{ padding: 18 }}>
              <div className="flex items-center gap-2 t-label" style={{ color: "var(--ink-900)" }}><Clock size={15} style={{ color: "var(--moss-700)" }} /> Replies in ~2 hours</div>
              <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 6 }}>92% of messages answered within a day.</p>
            </ManCard>
            <ManCard style={{ padding: 18 }}>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Other ways to reach</div>
              <div className="mt-3 space-y-2">
                <a href={biz?.phone ? `tel:${biz.phone}` : undefined} className="flex items-center gap-2 t-body-sm" style={{ color: "var(--ink-700)" }}><Phone size={15} style={{ color: "var(--moss-700)" }} /> {biz?.phone || "Call the business"}</a>
                {biz?.website && <a href={biz.website} className="flex items-center gap-2 t-body-sm" style={{ color: "var(--ink-700)" }}><Globe size={15} style={{ color: "var(--moss-700)" }} /> Visit website</a>}
              </div>
            </ManCard>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
