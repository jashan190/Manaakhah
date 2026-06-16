"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ManCard } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Checkbox } from "@/components/man/Choice";
import { DatePicker } from "@/components/man/DatePicker";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Plus, BadgeCheck, CheckCircle2 } from "lucide-react";

const halalTags = ["Hand-slaughtered confirmed", "Prayer space", "Alcohol-free", "Family seating", "Very clean", "Good value"];

export default function WriteReviewPage() {
  const { id } = useParams();
  const [name, setName] = useState("this business");
  const [stars, setStars] = useState(4);
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>(["Hand-slaughtered confirmed"]);
  const [published, setPublished] = useState(false);
  useEffect(() => { fetch(`/api/businesses/${id}`).then((r) => r.json()).then((d) => d?.name && setName(d.name)).catch(() => {}); }, [id]);
  const toggle = (t: string) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8">
      <div className="mx-auto max-w-[640px]">
        <Link href={`/business/${id}`} className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}>
          <ArrowLeft size={14} /> Back to {name}
        </Link>
        <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 14 }}>Review {name}</h1>

        {published ? (
          <ManCard style={{ padding: 40, marginTop: 18, textAlign: "center" }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--moss-50)" }}>
              <CheckCircle2 size={30} style={{ color: "var(--moss-700)" }} />
            </div>
            <h2 className="t-h3" style={{ color: "var(--ink-900)", marginTop: 16 }}>Thank You for Your Review</h2>
            <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 8 }}>Your {stars}-star review of {name} is now live and helps the community shop with confidence.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href={`/business/${id}`}><Button size="sm">Back to {name}</Button></Link>
              <Link href="/account"><Button variant="outline" size="sm">My Account</Button></Link>
            </div>
          </ManCard>
        ) : (
        <ManCard style={{ padding: 26, marginTop: 18 }}>
          <div className="t-eyebrow" style={{ color: "var(--ink-500)" }}>Your rating</div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setStars(n)}>
                <Star size={32} fill={n <= stars ? "var(--clay-500)" : "none"} stroke={n <= stars ? "none" : "var(--ink-300)"} />
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 6 }}>Visit date</div>
              <DatePicker placeholder="Select visit date" />
            </div>
            <div>
              <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 6 }}>Visit type</div>
              <Select defaultValue="Dine-in" options={["Dine-in", "Takeout", "Delivery", "Catering"].map((s) => ({ value: s, label: s }))} />
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-body-sm" style={{ background: "var(--moss-50)", color: "var(--moss-700)" }}>
            <BadgeCheck size={13} /> Verified visit
          </div>

          <div className="mt-5">
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 6 }}>Your review</div>
            <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 1000))} placeholder="Share the details — food, service, halal experience…"
              className="w-full rounded-[10px] border bg-white px-3.5 py-2.5 t-body outline-none" style={{ borderColor: "var(--card-edge)", color: "var(--ink-900)", minHeight: 120, resize: "vertical" }} />
            <div className="mt-1 text-right t-body-xs" style={{ color: "var(--ink-400)" }}>{text.length}/1000</div>
          </div>

          <div className="mt-3">
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>What stood out? (halal-aware)</div>
            <div className="flex flex-wrap gap-2">
              {halalTags.map((t) => {
                const on = tags.includes(t);
                return (
                  <button key={t} onClick={() => toggle(t)} className="man-focus t-body-sm rounded-full px-3 py-1.5"
                    style={on ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "var(--paper-2)", color: "var(--ink-700)" }}>{t}</button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>Photos</div>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <button key={i} className="flex h-20 w-20 items-center justify-center rounded-[10px]" style={{ border: "2px dashed var(--card-edge)", color: "var(--ink-400)" }}><Plus size={18} /></button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Checkbox label="Post privately" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Save Draft</Button>
              <Button size="sm" onClick={() => setPublished(true)}>Publish Review</Button>
            </div>
          </div>
        </ManCard>
        )}
      </div>
    </div>
  );
}
