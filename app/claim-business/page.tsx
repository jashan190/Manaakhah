"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Photo, Tag, Seal } from "@/components/man/primitives";
import { Search, MapPin, ArrowLeft } from "lucide-react";

export default function ClaimBusinessPage() {
  const [matches, setMatches] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/businesses?status=PUBLISHED&limit=5&lat=38.5816&lng=-121.4944")
      .then((r) => r.json()).then((d) => setMatches((d.businesses || []).slice(0, 4))).catch(() => {});
  }, []);
  const field = "flex-1 flex items-center gap-2 rounded-[10px] border bg-white px-3.5";
  const fs = { borderColor: "var(--card-edge)" } as const;

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[900px]">
        <Link href="/for-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back</Link>
        <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 14 }}>Claim your business</h1>
        <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 6 }}>Find your listing below — we&apos;ll guide you through proving ownership next.</p>

        <ManCard style={{ padding: 22, marginTop: 18 }}>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className={field} style={fs}><Search size={18} style={{ color: "var(--ink-400)" }} /><input defaultValue="Famous Kabob" className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} placeholder="Business name" /></div>
            <div className="flex items-center gap-2 rounded-[10px] border bg-white px-3.5 sm:w-56" style={fs}><MapPin size={18} style={{ color: "var(--ink-400)" }} /><input defaultValue="Sacramento, CA" className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} placeholder="City" /></div>
            <Button>Search listings</Button>
          </div>
        </ManCard>

        <div className="mt-6 grid gap-3">
          {matches.map((b, i) => (
            <ManCard key={b.id} style={{ padding: 14, border: i === 0 ? "1.5px solid var(--moss-700)" : "1px solid var(--card-edge)" }} className="flex items-center gap-4">
              <Photo src={b.coverImage} seed={b.name} w={80} h={60} radius={8} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Seal size={16} />
                  <div className="t-label" style={{ color: "var(--ink-900)" }}>{b.name}</div>
                  {i === 0 ? <Tag tone="moss">Best match</Tag> : i === 3 ? <Tag tone="warn">Already claimed</Tag> : null}
                </div>
                <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{b.address ? `${b.address}, ${b.city}` : `${b.city}, ${b.state}`}</div>
              </div>
              {i === 3 ? (
                <Button variant="outline" size="sm">Dispute</Button>
              ) : (
                <Link href="/dashboard/verification"><Button size="sm">Claim</Button></Link>
              )}
            </ManCard>
          ))}
        </div>

        <ManCard style={{ padding: 18, marginTop: 16, background: "var(--paper-2)" }} className="flex items-center justify-between gap-4">
          <div>
            <div className="t-label" style={{ color: "var(--ink-900)" }}>Don&apos;t see your business?</div>
            <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Add it from scratch — we&apos;ll route it through verification.</div>
          </div>
          <Link href="/dashboard/new-listing"><Button variant="outline" size="sm">Add a new business</Button></Link>
        </ManCard>
      </div>
    </div>
  );
}
