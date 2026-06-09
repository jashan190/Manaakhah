"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Tag, Seal, Avatar } from "@/components/man/primitives";
import { BUSINESS_TAGS, PRICE_RANGES } from "@/lib/constants";
import { useMockSession } from "@/components/mock-session-provider";
import {
  Phone, MessageCircle, MapPin, Globe, Heart, Share2, Plus, Star, Clock,
  BadgeCheck, ArrowLeft, Flag, Pencil, Check, Navigation,
} from "lucide-react";

const DAYS: [string, string][] = [
  ["sunday", "Sun"], ["monday", "Mon"], ["tuesday", "Tue"], ["wednesday", "Wed"],
  ["thursday", "Thu"], ["friday", "Fri"], ["saturday", "Sat"],
];
// a few tasteful stock shots to round out sparse galleries (placeholders)
const EXTRA = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=70",
];

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(n) ? "var(--clay-500)" : "none"} stroke={i <= Math.round(n) ? "none" : "var(--ink-300)"} />
      ))}
    </span>
  );
}

export default function BusinessDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useMockSession();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");
  const [fav, setFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/businesses/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setBusiness(d); setLoading(false); })
      .catch(() => setLoading(false));
    try { setFav(JSON.parse(localStorage.getItem("favorites") || "[]").includes(id)); } catch {}
  }, [id]);

  const toggleFav = () => {
    try {
      const f = JSON.parse(localStorage.getItem("favorites") || "[]");
      const next = f.includes(id) ? f.filter((x: string) => x !== id) : [...f, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      setFav(!fav);
    } catch {}
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center" style={{ background: "var(--paper)" }}><div className="h-8 w-8 animate-spin rounded-full border-b-2" style={{ borderColor: "var(--moss-700)" }} /></div>;
  }
  if (!business) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" style={{ background: "var(--paper)" }}>
        <h1 className="t-h3" style={{ color: "var(--ink-900)" }}>Business Not Found</h1>
        <Link href="/search"><Button>Back to Search</Button></Link>
      </div>
    );
  }

  const photos: string[] = (business.photos || []).map((p: any) => (typeof p === "string" ? p : p?.url)).filter(Boolean);
  const gallery = Array.from(new Set([business.coverImage, ...photos, ...EXTRA].filter(Boolean))).slice(0, 6) as string[];
  const reviews: any[] = business.reviews || [];
  const verified = business.verificationStatus === "APPROVED";
  const isFood = ["RESTAURANT", "GROCERY", "HALAL_FOOD"].includes(business.category);
  const price = PRICE_RANGES.find((p) => p.value === business.priceRange)?.label;
  const todayKey = DAYS[new Date().getDay()][0];
  const tagLabels: string[] = (business.tags || []).map((t: any) => BUSINESS_TAGS.find((b) => b.value === (t.tag || t))?.label || (t.tag || t));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}, ${business.state}`)}`;
  const amenities = Array.from(new Set([...(business.serviceList || []), ...tagLabels]));

  return (
    <div style={{ background: "var(--paper)" }}>
      {/* Hero cover */}
      <div className="relative h-[300px] w-full overflow-hidden md:h-[360px]">
        {business.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.coverImage} alt={business.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--moss-100), var(--moss-200))" }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(17,50,30,0.18), rgba(17,50,30,0.55))" }} />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 md:px-8">
          <Link href="/search" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm" style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink-900)" }}><ArrowLeft size={15} /> Back</Link>
          <div className="flex gap-2">
            <button onClick={toggleFav} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm" style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink-900)" }}>
              <Heart size={15} fill={fav ? "var(--clay-500)" : "none"} stroke={fav ? "var(--clay-500)" : "currentColor"} /> {fav ? "Saved" : "Save"}
            </button>
            <button onClick={share} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm" style={{ background: "rgba(255,255,255,0.92)", color: "var(--ink-900)" }}>
              <Share2 size={15} /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        {/* Header card (overlaps hero) */}
        <ManCard style={{ padding: 24, marginTop: -56, position: "relative" }}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                {verified && <Seal size={22} />}
                <h1 className="t-h2" style={{ color: "var(--ink-900)" }}>{business.name}</h1>
                {verified && <Tag tone="moss" leading={<BadgeCheck size={13} />}>{isFood ? "Halal verified" : "Verified"}</Tag>}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 t-body-sm" style={{ color: "var(--ink-500)" }}>
                {business.reviewCount > 0 && (
                  <span className="inline-flex items-center gap-1.5" style={{ color: "var(--ink-700)" }}>
                    <Stars n={business.averageRating} /> <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                    <button onClick={() => setTab("Reviews")} style={{ color: "var(--moss-700)" }}>({business.reviewCount} reviews)</button>
                  </span>
                )}
                <span>{BUSINESS_TAGS.length && (business.category || "").toString().replace("_", " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>
                {price && <span>· {price}</span>}
                <span className="inline-flex items-center gap-1"><MapPin size={13} /> {business.city}, {business.state}</span>
              </div>
              <p className="mt-3 t-body" style={{ color: "var(--ink-700)", maxWidth: 560 }}>{business.description}</p>
            </div>

            <div className="flex flex-col gap-2 md:w-[210px]">
              <a href={`tel:${business.phone}`}><Button className="w-full"><Phone className="mr-1.5 h-4 w-4" /> Call Now</Button></a>
              <Link href={`/business/${id}/contact`}><Button variant="outline" className="w-full"><MessageCircle className="mr-1.5 h-4 w-4" /> Message</Button></Link>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full"><Navigation className="mr-1.5 h-4 w-4" /> Directions</Button></a>
            </div>
          </div>
        </ManCard>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 border-b" style={{ borderColor: "var(--card-edge)" }}>
          {["Overview", "Reviews", "Photos"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className="-mb-px border-b-2 px-1 pb-2.5 t-body-sm"
              style={tab === t ? { borderColor: "var(--moss-700)", color: "var(--ink-900)", fontWeight: 600 } : { borderColor: "transparent", color: "var(--ink-500)" }}>
              {t}{t === "Reviews" && business.reviewCount > 0 ? ` (${business.reviewCount})` : ""}
            </button>
          ))}
        </div>

        {/* Body: main + sticky aside */}
        <div className="grid gap-6 py-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="min-w-0">
            {tab === "Overview" && (
              <div className="grid gap-4">
                <ManCard style={{ padding: 22 }}>
                  <div className="t-h4" style={{ color: "var(--ink-900)" }}>About</div>
                  <p className="mt-2 t-body" style={{ color: "var(--ink-700)" }}>{business.description}</p>
                </ManCard>
                {amenities.length > 0 && (
                  <ManCard style={{ padding: 22 }}>
                    <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>What This Place Offers</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {amenities.map((a) => (
                        <div key={a} className="flex items-center gap-2 t-body-sm" style={{ color: "var(--ink-700)" }}>
                          <Check size={15} style={{ color: "var(--moss-700)" }} /> {a}
                        </div>
                      ))}
                    </div>
                  </ManCard>
                )}
              </div>
            )}

            {tab === "Reviews" && (
              <div className="grid gap-4">
                <ManCard style={{ padding: 22 }} className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div><div className="t-display" style={{ color: "var(--ink-900)", fontSize: 40, lineHeight: 1 }}>{business.reviewCount > 0 ? business.averageRating.toFixed(1) : "—"}</div></div>
                    <div><Stars n={business.averageRating} size={16} /><div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>{business.reviewCount} review{business.reviewCount === 1 ? "" : "s"}</div></div>
                  </div>
                  <Link href={`/business/${id}/review`}><Button size="sm"><Pencil className="mr-1.5 h-4 w-4" /> Write a Review</Button></Link>
                </ManCard>

                {reviews.length === 0 ? (
                  <ManCard style={{ padding: 40 }} className="text-center">
                    <Star size={26} style={{ color: "var(--clay-500)", margin: "0 auto" }} />
                    <div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 10 }}>No Reviews Yet</div>
                    <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 4 }}>Be the first to share your experience.</div>
                  </ManCard>
                ) : reviews.map((rv) => (
                  <ManCard key={rv.id} style={{ padding: 22 }}>
                    <div className="flex items-start gap-3">
                      <Avatar name={rv.user?.name || "Community member"} size={40} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="t-label" style={{ color: "var(--ink-900)" }}>{rv.user?.name || "Community member"}</div>
                          <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2"><Stars n={rv.rating} />{rv.isVerified && <span className="inline-flex items-center gap-1 t-body-xs" style={{ color: "var(--moss-700)" }}><BadgeCheck size={12} /> Verified visit</span>}</div>
                        {rv.title && <div className="mt-2 t-label-sm" style={{ color: "var(--ink-900)" }}>{rv.title}</div>}
                        <p className="mt-1 t-body-sm" style={{ color: "var(--ink-700)" }}>{rv.content || rv.text}</p>
                        {rv.tags?.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">{rv.tags.map((t: string) => <Tag key={t} tone="moss">{t}</Tag>)}</div>
                        )}
                        {rv.ownerResponse && (
                          <div className="mt-3 rounded-[10px] p-3.5" style={{ background: "var(--paper-2)" }}>
                            <div className="flex items-center gap-1.5 t-eyebrow" style={{ color: "var(--ink-500)" }}><Seal size={13} /> Response from {business.name}</div>
                            <p className="mt-1.5 t-body-sm" style={{ color: "var(--ink-700)" }}>{rv.ownerResponse}</p>
                          </div>
                        )}
                        <div className="mt-3 t-body-xs" style={{ color: "var(--ink-400)" }}>{rv.helpfulCount || 0} found this helpful</div>
                      </div>
                    </div>
                  </ManCard>
                ))}
              </div>
            )}

            {tab === "Photos" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`${business.name} ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-[12px] object-cover" />
                ))}
              </div>
            )}
          </div>

          {/* Sticky aside */}
          <aside className="grid h-fit gap-4 lg:sticky lg:top-[88px]">
            <ManCard style={{ padding: 22 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Contact</div>
              <div className="mt-3 grid gap-3 t-body-sm">
                <div className="flex items-start gap-2.5"><MapPin size={15} style={{ color: "var(--ink-400)", marginTop: 2 }} /><span style={{ color: "var(--ink-700)" }}>{business.address}<br />{business.city}, {business.state} {business.zipCode}</span></div>
                {business.phone && <a href={`tel:${business.phone}`} className="flex items-center gap-2.5" style={{ color: "var(--ink-700)" }}><Phone size={15} style={{ color: "var(--ink-400)" }} /> {business.phone}</a>}
                {business.website && <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5" style={{ color: "var(--moss-700)" }}><Globe size={15} style={{ color: "var(--ink-400)" }} /> Visit website</a>}
              </div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block"><Button variant="outline" size="sm" className="w-full"><Navigation className="mr-1.5 h-4 w-4" /> Get Directions</Button></a>
            </ManCard>

            {business.hours && (
              <ManCard style={{ padding: 22 }}>
                <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)" }}><Clock size={16} style={{ color: "var(--moss-700)" }} /> Hours</div>
                <div className="mt-3 grid gap-1.5">
                  {DAYS.map(([key, label]) => {
                    const h = business.hours[key];
                    const isToday = key === todayKey;
                    return (
                      <div key={key} className="flex items-center justify-between t-body-sm" style={{ color: isToday ? "var(--ink-900)" : "var(--ink-600)", fontWeight: isToday ? 600 : 400 }}>
                        <span>{label}</span>
                        <span>{h?.open ? `${h.open} – ${h.close}` : "Closed"}</span>
                      </div>
                    );
                  })}
                </div>
              </ManCard>
            )}

            {verified && (
              <ManCard style={{ padding: 22, background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
                <div className="flex items-start gap-3">
                  <Seal size={24} />
                  <div className="flex-1">
                    <div className="t-label" style={{ color: "var(--ink-900)" }}>{isFood ? "Verified halal" : "Verified Muslim-owned"}</div>
                    <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>{isFood ? "Certification cross-checked with the issuing body." : "Ownership confirmed by our team."}</p>
                    <Link href={`/business/${id}/certification`} className="mt-2 inline-flex items-center gap-1 t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>View details →</Link>
                  </div>
                </div>
              </ManCard>
            )}

            <Link href={`/business/${id}/contact`} className="inline-flex items-center gap-1.5 t-body-xs" style={{ color: "var(--ink-400)" }}><Flag size={12} /> Report this listing</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
