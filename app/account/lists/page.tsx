"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountShell";
import { PH, ManCard, Seal, Rating, Photo, Tag } from "@/components/man/primitives";
import { Button } from "@/components/ui/button";
import { Plus, Share2, Map, MoreHorizontal } from "lucide-react";

const lists = [
  { name: "Sacramento favorites", count: 12, tags: ["Restaurants", "Markets"] },
  { name: "Date night", count: 6, tags: ["Dinner", "Dessert"] },
  { name: "Quick halal lunch", count: 8, tags: ["Fast", "Near work"] },
];

export default function SavedListsPage() {
  const [biz, setBiz] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/businesses?status=PUBLISHED&limit=12&lat=38.5816&lng=-121.4944")
      .then((r) => r.json()).then((d) => setBiz(d.businesses || [])).catch(() => {});
  }, []);

  return (
    <AccountShell active="saved">
      <div className="px-6 py-8 md:px-9">
        <PH title="Saved Lists" sub="Collections you can keep private or share with family" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l, li) => (
            <ManCard key={l.name} style={{ overflow: "hidden" }} className="transition-shadow hover:shadow-[var(--shadow-lift)]">
              <div className="grid h-32 grid-cols-3 gap-0.5">
                {[0, 1, 2].map((j) => <Photo key={j} src={biz[li * 3 + j]?.coverImage} seed={`${l.name}${j}`} h={128} radius={0} />)}
              </div>
              <div style={{ padding: 16 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)" }}>{l.name}</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{l.count} places</div>
                <div className="mt-2.5 flex flex-wrap gap-1">{l.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            </ManCard>
          ))}
          <button className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[14px]" style={{ border: "2px dashed var(--card-edge)", color: "var(--ink-500)" }}>
            <Plus size={22} /><span className="t-label">Create a new list</span>
          </button>
        </div>

        {/* Expanded list detail */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="t-h3" style={{ color: "var(--ink-900)" }}>Sacramento favorites</h2>
              <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>12 places · last updated this week</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Map className="mr-1.5 h-4 w-4" /> Map</Button>
              <Button variant="outline" size="sm"><Share2 className="mr-1.5 h-4 w-4" /> Share</Button>
            </div>
          </div>
          <ManCard>
            {(biz.slice(0, 5)).map((b, i, arr) => (
              <div key={b.id} className="flex items-center gap-4 p-3.5" style={{ borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--card-edge)" }}>
                <Photo src={b.coverImage} seed={b.name} w={72} h={56} radius={8} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Seal size={15} />
                    <Link href={`/business/${b.id}`} className="t-label" style={{ color: "var(--ink-900)" }}>{b.name}</Link>
                  </div>
                  <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>Personal note: must try the mixed grill</div>
                </div>
                {b.averageRating > 0 && <Rating value={b.averageRating} count={b.reviewCount} />}
                <button style={{ color: "var(--ink-400)" }}><MoreHorizontal size={18} /></button>
              </div>
            ))}
          </ManCard>
        </div>
      </div>
    </AccountShell>
  );
}
