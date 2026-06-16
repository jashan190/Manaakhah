"use client";

import { OwnerShell } from "@/components/owner/OwnerShell";
import { ManCard, PH, StatCard, Photo, Tag } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Checkbox } from "@/components/man/Choice";
import { DatePicker } from "@/components/man/DatePicker";
import { Button } from "@/components/ui/button";
import { Megaphone, Eye, MousePointerClick, Ticket } from "lucide-react";

const promos = [
  { name: "Friday family iftar special", status: "Active", reach: "2,140", clicks: "186", img: "https://images.unsplash.com/photo-1600555379885-08a02224726d?auto=format&fit=crop&w=400&q=60" },
  { name: "20% off first online order", status: "Active", reach: "1,020", clicks: "94", img: "https://images.unsplash.com/photo-1542739764-0ca4adda2df5?auto=format&fit=crop&w=400&q=60" },
  { name: "Eid catering — book early", status: "Scheduled", reach: "—", clicks: "—", img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=60" },
];

export default function PromotionsPage() {
  const field = "w-full rounded-[8px] border bg-white px-3.5 py-2.5 t-body outline-none";
  const fs = { borderColor: "var(--card-edge)", color: "var(--ink-900)" } as const;
  return (
    <OwnerShell active="promos">
      <div className="px-6 py-7 md:px-8">
        <PH title="Promotions & Events" sub="Reach the community with deals and announcements" />
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard label="Active promotions" value="2" Icon={Megaphone} />
          <StatCard label="Total reach" value="3,160" delta="+22%" Icon={Eye} />
          <StatCard label="Clicks" value="280" delta="+15%" Icon={MousePointerClick} />
          <StatCard label="Redemptions" value="64" delta="+8%" Icon={Ticket} />
        </div>

        <div className="mt-5 grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>Your Promotions</div>
            <div className="grid gap-3">
              {promos.map((p) => (
                <ManCard key={p.name} style={{ padding: 12 }} className="flex items-center gap-3.5">
                  <Photo src={p.img} w={84} h={60} radius={8} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="t-label" style={{ color: "var(--ink-900)" }}>{p.name}</div>
                      <Tag tone={p.status === "Active" ? "ok" : "warn"}>{p.status}</Tag>
                    </div>
                    <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{p.reach} reached · {p.clicks} clicks</div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </ManCard>
              ))}
            </div>
          </div>

          <ManCard style={{ padding: 22 }}>
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Quick Promotion</div>
            <div className="mt-3.5 grid gap-3">
              <input className={field} style={fs} placeholder="Title (e.g. Friday iftar special)" />
              <input className={field} style={fs} placeholder="One-line description" />
              <div className="grid grid-cols-2 gap-3">
                <div><div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 4 }}>Starts</div><DatePicker placeholder="Start date" /></div>
                <div><div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 4 }}>Ends</div><DatePicker placeholder="End date" /></div>
              </div>
              <Select defaultValue="Order online" placeholder="Call to action" options={["Order online", "Book a table", "Call us", "Visit website"].map((s) => ({ value: s, label: s }))} />
              <Checkbox defaultChecked label="Notify people who saved you" />
              <Button className="mt-1">Launch Promotion</Button>
            </div>
          </ManCard>
        </div>
      </div>
    </OwnerShell>
  );
}
