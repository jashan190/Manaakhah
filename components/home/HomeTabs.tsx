"use client";

import { useState } from "react";
import { LayoutGrid, Rss } from "lucide-react";
import { CommunityFeed } from "./CommunityFeed";

type Tab = "discover" | "feed";

const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: "discover", label: "Discover",       Icon: LayoutGrid },
  { key: "feed",     label: "Community Feed", Icon: Rss },
];

export function HomeTabs({ discoverContent }: { discoverContent: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("discover");

  return (
    <>
      {/* Tab bar — sticks just below the 64px site header */}
      <div className="sticky top-16 z-20" style={{ background: "var(--paper)", borderBottom: "1px solid var(--card-edge)" }}>
        <div className="mx-auto flex max-w-[1200px] gap-1 px-6">
          {TABS.map(({ key, label, Icon }) => {
            const on = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="man-focus inline-flex items-center gap-2 rounded-t-sm px-4 py-3 t-label transition-colors"
                style={{
                  color:        on ? "var(--ink-900)" : "var(--ink-500)",
                  borderBottom: on ? "2px solid var(--moss-700)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "discover" ? discoverContent : <CommunityFeed />}
    </>
  );
}
