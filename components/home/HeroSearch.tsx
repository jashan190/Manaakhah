// components/home/HeroSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/man/primitives";
import { FeaturedShowcase } from "@/components/home/FeaturedShowcase";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (term.trim()) params.set("search", term.trim());
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper) 60%, var(--moss-50) 100%)" }}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-14 md:py-16 lg:grid-cols-[1.25fr_1fr]">
        {/* Left: brand + search (left-aligned — our signature, not Taawun's centered hero) */}
        <div>
          <Tag tone="moss">Sacramento&apos;s Muslim Business Directory</Tag>
          <h1 className="t-display" style={{ color: "var(--ink-900)", marginTop: 16 }}>
            Where the Muslim Community<br className="hidden sm:block" /> <span style={{ fontStyle: "italic" }}>does business</span>.
          </h1>
          <p className="t-body-lg" style={{ color: "var(--ink-500)", marginTop: 16, maxWidth: 520 }}>
            Discover and support Muslim-owned businesses near you — restaurants, grocers, salons, services and more, trusted by your community.
          </p>

          <form onSubmit={submit} className="man-field-wrap mt-7 flex w-full flex-col gap-2 rounded-[12px] border bg-white p-2 shadow-[var(--shadow-lift)] sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 px-3 sm:min-w-[200px]">
              <Search size={18} className="flex-shrink-0" style={{ color: "var(--ink-400)" }} />
              <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search businesses…"
                className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} />
            </div>
            <Button type="submit" size="sm" className="sm:flex-shrink-0">Search</Button>
            <Link href="/search" className="sm:flex-shrink-0"><Button type="button" variant="outline" size="sm" className="w-full sm:w-auto">Browse All</Button></Link>
          </form>

          <div className="mt-8 flex gap-7">
            {[["Owner-verified", "Every listing"], ["Sacramento", "Your community"], ["Free", "To browse & save"]].map(([v, l]) => (
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
