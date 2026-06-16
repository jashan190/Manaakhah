"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, Seal, Tag, Photo, Check } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Checkbox } from "@/components/man/Choice";
import { ExternalLink, Plus, Eye } from "lucide-react";

const selOpts = (...l: string[]) => l.map((s) => ({ value: s, label: s }));

const TABS = ["Overview", "Photos", "Menu", "Halal details", "Hours", "Amenities"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fieldCls = "man-field w-full px-3.5 py-2.5 t-body";
const fs = { color: "var(--ink-900)" } as const;
const completeness = [
  ["Business basics", true], ["Address & hours", true], ["Cover photo", true],
  ["5+ gallery photos", true], ["Menu uploaded", false], ["Halal certificate", true], ["Amenities tagged", false],
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 5 }}>{label}</div>{children}</div>;
}

export default function ListingProfilePage() {
  const [tab, setTab] = useState("Overview");
  const pct = Math.round((completeness.filter(([, d]) => d).length / completeness.length) * 100);

  return (
    <OwnerShell active="profile">
      <div className="px-6 py-7 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PH title="Listing & Profile" sub="This is what the community sees on Manaakhah" />
          <Link href="/business/sac-famous-kabob"><Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-4 w-4" /> View Public Profile</Button></Link>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex flex-wrap gap-2 border-b" style={{ borderColor: "var(--card-edge)" }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className="man-focus rounded-[6px] t-body-sm -mb-px border-b-2 px-1 pb-2.5"
              style={tab === t ? { borderColor: "var(--moss-700)", color: "var(--ink-900)", fontWeight: 600 } : { borderColor: "transparent", color: "var(--ink-500)" }}>{t}</button>
          ))}
        </div>

        <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
          {/* Editor column */}
          <div className="grid gap-3.5">
            {tab === "Overview" && (
              <ManCard style={{ padding: 24 }}>
                <div className="grid gap-4">
                  <Field label="Business name"><input className={fieldCls} style={fs} defaultValue="Famous Kabob" /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Category"><Select defaultValue="Restaurant" options={selOpts("Restaurant", "Grocery & market", "Café & bakery", "Jewelry", "Modest fashion", "Salon & beauty", "Professional services")} /></Field>
                    <Field label="Price range"><Select defaultValue="$$ — Moderate" options={selOpts("$ — Budget", "$$ — Moderate", "$$$ — Upscale")} /></Field>
                  </div>
                  <Field label="Tagline"><input className={fieldCls} style={fs} defaultValue="Authentic Afghan & Persian kabobs since 1998" /></Field>
                  <Field label="About"><textarea className={fieldCls} style={{ ...fs, minHeight: 110, resize: "vertical" }} defaultValue="Family-run grill serving zabihah halal kabobs, fresh naan and slow-cooked rice. Prayer space available, family seating, and catering for events across Sacramento." /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone"><input className={fieldCls} style={fs} defaultValue="(916) 483-1700" /></Field>
                    <Field label="Website"><input className={fieldCls} style={fs} defaultValue="famouskabob.com" /></Field>
                  </div>
                </div>
              </ManCard>
            )}

            {tab === "Photos" && (
              <ManCard style={{ padding: 24 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>Gallery</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {["sac-famous-kabob", "kabob-1", "kabob-2", "kabob-3", "kabob-4"].map((s) => (
                    <Photo key={s} seed={s} h={120} radius={10} />
                  ))}
                  <button className="man-focus flex h-[120px] flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 border-dashed t-body-xs" style={{ borderColor: "var(--card-edge)", color: "var(--ink-500)" }}><Plus size={20} /> Add photo</button>
                </div>
              </ManCard>
            )}

            {tab === "Menu" && (
              <ManCard style={{ padding: 24 }}>
                <div className="flex items-center justify-between"><div className="t-h4" style={{ color: "var(--ink-900)" }}>Menu</div><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Item</Button></div>
                <div className="mt-4 grid gap-2.5">
                  {[["Chicken kabob plate", "$14.99"], ["Lamb chops", "$24.99"], ["Beef koobideh", "$15.99"], ["Mixed grill", "$22.99"]].map(([n, p]) => (
                    <div key={n} className="flex items-center justify-between rounded-[10px] border px-3.5 py-2.5" style={{ borderColor: "var(--card-edge)" }}>
                      <span className="t-body-sm" style={{ color: "var(--ink-900)" }}>{n}</span>
                      <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>{p}</span>
                    </div>
                  ))}
                </div>
              </ManCard>
            )}

            {tab === "Halal details" && (
              <ManCard style={{ padding: 24 }}>
                <div className="flex items-start gap-3 rounded-[10px] p-3.5" style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
                  <Seal size={24} />
                  <div className="flex-1"><div className="t-label" style={{ color: "var(--ink-900)" }}>Verified halal · HFSAA active</div><div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>Certificate expires March 14, 2027.</div></div>
                  <Link href="/business/sac-famous-kabob/certification"><Button variant="outline" size="sm">Manage</Button></Link>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[["All meat is zabihah", true], ["Separate halal kitchen", true], ["No alcohol served", true], ["Vegetarian options", true], ["Vegan options", false]].map(([o, on]) => (
                    <div key={o as string} className="flex items-center rounded-[10px] border px-3 py-2.5" style={{ borderColor: "var(--card-edge)" }}><Checkbox defaultChecked={on as boolean} label={o} /></div>
                  ))}
                </div>
              </ManCard>
            )}

            {tab === "Hours" && (
              <ManCard style={{ padding: 24 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>Opening Hours</div>
                <div className="grid gap-2">
                  {DAYS.map((d, i) => (
                    <div key={d} className="flex items-center gap-3">
                      <span className="t-body-sm" style={{ color: "var(--ink-700)", width: 44 }}>{d}</span>
                      <input className="man-field px-2.5 py-1.5 t-body-sm" style={fs} defaultValue="11:00" disabled={i === 6} />
                      <span className="t-body-sm" style={{ color: "var(--ink-400)" }}>–</span>
                      <input className="man-field px-2.5 py-1.5 t-body-sm" style={fs} defaultValue="22:00" disabled={i === 6} />
                      <Checkbox className="ml-auto" defaultChecked={i === 6} label="Closed" />
                    </div>
                  ))}
                </div>
              </ManCard>
            )}

            {tab === "Amenities" && (
              <ManCard style={{ padding: 24 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>Amenities</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[["Prayer space", true], ["Family seating", true], ["Parking", true], ["Wheelchair access", true], ["Outdoor seating", false], ["Catering", true], ["Delivery", true], ["Wi-Fi", false]].map(([o, on]) => (
                    <div key={o as string} className="flex items-center rounded-[10px] border px-3 py-2.5" style={{ borderColor: "var(--card-edge)" }}><Checkbox defaultChecked={on as boolean} label={o} /></div>
                  ))}
                </div>
              </ManCard>
            )}

            <div className="flex justify-end gap-2"><Button variant="ghost" size="sm">Discard</Button><Button size="sm">Save Changes</Button></div>
          </div>

          {/* Completeness column */}
          <div className="grid gap-3.5">
            <ManCard style={{ padding: 22 }}>
              <div className="flex items-baseline justify-between"><div className="t-h4" style={{ color: "var(--ink-900)" }}>Profile Completeness</div><span className="t-h3" style={{ color: "var(--moss-700)" }}>{pct}%</span></div>
              <div className="mt-3 h-2.5 w-full rounded-full" style={{ background: "var(--paper-2)" }}><div className="h-2.5 rounded-full" style={{ width: `${pct}%`, background: "var(--moss-700)" }} /></div>
              <div className="mt-4 grid gap-2.5">
                {completeness.map(([l, done]) => (
                  <div key={l} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full" style={done ? { background: "var(--moss-700)" } : { border: "1.5px solid var(--card-edge)" }}>{done && <Check size={11} style={{ color: "var(--bone)" }} />}</span>
                    <span className="t-body-sm" style={{ color: done ? "var(--ink-500)" : "var(--ink-900)", textDecoration: done ? "line-through" : "none" }}>{l}</span>
                  </div>
                ))}
              </div>
              <p className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 14 }}>Complete profiles get up to 3× more profile views.</p>
            </ManCard>

            <ManCard style={{ padding: 22, background: "var(--clay-50)", border: "1px solid var(--clay-100)" }}>
              <Tag tone="clay">Tip</Tag>
              <div className="t-label" style={{ color: "var(--ink-900)", marginTop: 8 }}>Add your menu</div>
              <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 4 }}>Listings with a menu convert 40% more enquiries. Upload yours under the Menu tab.</p>
              <button onClick={() => setTab("Menu")} className="mt-3 inline-flex items-center gap-1.5 t-body-sm" style={{ color: "var(--clay-700)", fontWeight: 600 }}><Eye size={14} /> Go to menu</button>
            </ManCard>
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}
