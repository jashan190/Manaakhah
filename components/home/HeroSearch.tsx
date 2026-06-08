// components/home/HeroSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/man/primitives";
import { FeaturedShowcase } from "@/components/home/FeaturedShowcase";
import { Search, MapPin } from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

export function HeroSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [where, setWhere] = useState("Sacramento, CA");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (term.trim()) params.set("search", term.trim());
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper) 60%, var(--moss-50) 100%)" }}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-14 md:py-16 lg:grid-cols-[1.05fr_1fr]">
        {/* Left: brand + search (left-aligned — our signature, not Taawun's centered hero) */}
        <div>
          <Tag tone="moss">Sacramento&apos;s Muslim business directory</Tag>
          <h1 className="t-display" style={{ color: "var(--ink-900)", marginTop: 18 }}>
            Where the Muslim community<br className="hidden sm:block" /> <span style={{ fontStyle: "italic" }}>does business</span>.
          </h1>
          <p className="t-body-lg" style={{ color: "var(--ink-500)", marginTop: 16, maxWidth: 520 }}>
            Discover and support Muslim-owned businesses near you — restaurants, grocers, salons, services and more, trusted by your community.
          </p>

          <form onSubmit={submit} className="mt-7 flex max-w-[560px] flex-col gap-2 rounded-[14px] border bg-white p-2 shadow-[var(--shadow-lift)] sm:flex-row" style={{ borderColor: "var(--card-edge)" }}>
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search size={18} style={{ color: "var(--ink-400)" }} />
              <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search businesses, e.g. kabob, jeweler"
                className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} />
            </div>
            <div className="flex items-center gap-2 px-3 sm:w-44" style={{ borderLeft: "1px solid var(--card-edge)" }}>
              <MapPin size={18} style={{ color: "var(--ink-400)" }} />
              <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Location"
                className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} />
            </div>
            <Button type="submit" size="lg">Search</Button>
            <Link href="/search"><Button type="button" variant="outline" size="lg" className="w-full sm:w-auto">Browse all</Button></Link>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_GROUPS.slice(0, 5).map((g) => (
              <Link key={g.key} href={`/search?group=${g.key}`}
                className="rounded-full px-3 py-1.5 t-body-sm" style={{ background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>
                {g.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex gap-7">
            {[["110+", "Muslim-owned businesses"], ["Sacramento", "& growing"], ["94%", "Of reviewers return"]].map(([v, l]) => (
              <div key={l}>
                <div className="t-h4" style={{ color: "var(--ink-900)" }}>{v}</div>
                <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: our signature rotating showcase of real businesses */}
        <div className="hidden lg:block"><FeaturedShowcase /></div>
      </div>
    </section>
  );
}
