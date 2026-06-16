"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Photo, Tag, Seal } from "@/components/man/primitives";
import { Select } from "@/components/man/Select";
import { Search, ArrowLeft } from "lucide-react";

const CITIES = [
  "Sacramento, CA",
  "Elk Grove, CA",
  "Roseville, CA",
  "Folsom, CA",
  "Citrus Heights, CA",
  "West Sacramento, CA",
  "Rancho Cordova, CA",
  "Davis, CA",
].map((c) => ({ value: c, label: c }));


export default function ClaimBusinessPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Sacramento, CA");
  const [matches, setMatches] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const runSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ status: "PUBLISHED", limit: "8", lat: "38.5816", lng: "-121.4944" });
      if (query.trim()) params.set("search", query.trim());
      const r = await fetch(`/api/businesses?${params}`);
      const d = await r.json();
      setMatches((d.businesses || []).slice(0, 5));
    } catch {
      setMatches([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "var(--paper)" }} className="px-6 py-8 md:px-14">
      <div className="mx-auto max-w-[900px]">
        <Link href="/for-business" className="t-body-sm inline-flex items-center gap-1" style={{ color: "var(--ink-500)" }}><ArrowLeft size={14} /> Back</Link>
        <h1 className="t-h2" style={{ color: "var(--ink-900)", marginTop: 14 }}>Claim Your Business</h1>
        <p className="t-body" style={{ color: "var(--ink-500)", marginTop: 6 }}>Search for your business to claim it — we&apos;ll guide you through proving ownership next.</p>

        <ManCard style={{ padding: 22, marginTop: 18 }}>
          <form onSubmit={runSearch} className="flex flex-col gap-2.5 sm:flex-row">
            <div className="man-field-wrap flex flex-1 items-center gap-2 rounded-[8px] border bg-white px-3.5">
              <Search size={18} style={{ color: "var(--ink-400)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} placeholder="Search your business name…" />
            </div>
            <Select value={city} onChange={setCity} options={CITIES} className="sm:w-56" />
            <Button type="submit">Search</Button>
          </form>
        </ManCard>

        {/* Results — only after a search has run */}
        {searched && (
          loading ? (
            <div className="mt-10 text-center t-body-sm" style={{ color: "var(--ink-500)" }}>Searching…</div>
          ) : matches.length > 0 ? (
            <>
              <div className="mt-6 t-body-sm" style={{ color: "var(--ink-500)" }}>
                {matches.length} {matches.length === 1 ? "match" : "matches"} in {city}
              </div>
              <div className="mt-3 grid gap-3">
                {matches.map((b, i) => (
                  <ManCard key={b.id} style={{ padding: 14, border: i === 0 ? "1.5px solid var(--moss-700)" : "1px solid var(--card-edge)" }} className="flex items-center gap-4">
                    <Photo src={b.coverImage} seed={b.name} w={80} h={60} radius={8} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Seal size={16} />
                        <div className="t-label" style={{ color: "var(--ink-900)" }}>{b.name}</div>
                        {i === 0 ? <Tag tone="moss">Best Match</Tag> : i === 3 ? <Tag tone="warn">Already Claimed</Tag> : null}
                      </div>
                      <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{b.address ? `${b.address}, ${b.city}` : `${b.city}, ${b.state}`}</div>
                    </div>
                    {i === 3 ? (
                      <Button variant="outline" size="sm">Dispute</Button>
                    ) : (
                      <Link href="/register?role=owner&next=%2Fdashboard%2Fverification"><Button size="sm">Claim</Button></Link>
                    )}
                  </ManCard>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-10 text-center">
              <div className="t-label" style={{ color: "var(--ink-900)" }}>No matches found</div>
              <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>Try a different name, or add your business from scratch.</p>
            </div>
          )
        )}

        {/* Add new — offered once a search has run */}
        {searched && !loading && (
          <ManCard style={{ padding: 18, marginTop: 16, background: "var(--paper-2)" }} className="flex items-center justify-between gap-4">
            <div>
              <div className="t-label" style={{ color: "var(--ink-900)" }}>Don&apos;t see your business?</div>
              <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>Add it from scratch — we&apos;ll route it through verification.</div>
            </div>
            <Link href="/register?role=owner&next=%2Fdashboard%2Fnew-listing"><Button variant="outline" size="sm">Add a New Business</Button></Link>
          </ManCard>
        )}
      </div>
    </div>
  );
}
