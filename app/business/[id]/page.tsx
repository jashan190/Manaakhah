"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard, Tag, Seal, Avatar } from "@/components/man/primitives";
import { BUSINESS_TAGS, PRICE_RANGES } from "@/lib/constants";
import {
  Phone, MessageCircle, MapPin, Globe, Heart, Share2, Star, Clock,
  BadgeCheck, ArrowLeft, Flag, Pencil, Check, Navigation,
} from "lucide-react";

const DAYS: [string, string][] = [
  ["sunday", "Sun"], ["monday", "Mon"], ["tuesday", "Tue"], ["wednesday", "Wed"],
  ["thursday", "Thu"], ["friday", "Fri"], ["saturday", "Sat"],
];
// Fallback so the Hours panel always renders (mock data is missing hours for many businesses)
const DEFAULT_HOURS: Record<string, { open: string; close: string }> = {
  monday: { open: "10:00", close: "20:00" },
  tuesday: { open: "10:00", close: "20:00" },
  wednesday: { open: "10:00", close: "20:00" },
  thursday: { open: "10:00", close: "20:00" },
  friday: { open: "10:00", close: "21:00" },
  saturday: { open: "10:00", close: "21:00" },
  sunday: { open: "11:00", close: "18:00" },
};
const EXTRA = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=70",
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

const fmtTime = (s: string) => {
  let [H, M] = s.split(":").map(Number);
  const ap = H >= 12 ? "PM" : "AM";
  H = H % 12 || 12;
  return `${H}${M ? ":" + String(M).padStart(2, "0") : ""} ${ap}`;
};
function openStatus(hours: any, todayKey: string) {
  const h = hours?.[todayKey];
  if (!h?.open) return { open: false, label: "Closed today" };
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const o = oh * 60 + om, c = ch * 60 + cm;
  if (mins >= o && mins < c) return { open: true, label: `Open now · closes ${fmtTime(h.close)}` };
  return { open: false, label: `Closed · opens ${fmtTime(h.open)}` };
}

export default function BusinessDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        <Link href="/search"><Button>Back to Browse</Button></Link>
      </div>
    );
  }

  const photos: string[] = (business.photos || []).map((p: any) => (typeof p === "string" ? p : p?.url)).filter(Boolean);
  const gallery = Array.from(new Set([business.coverImage, ...photos, ...EXTRA].filter(Boolean))) as string[];
  const reviews: any[] = business.reviews || [];
  const verified = business.verificationStatus === "APPROVED";
  const isFood = ["RESTAURANT", "GROCERY", "HALAL_FOOD", "BAKERY", "CAFE"].includes(business.category);
  const price = PRICE_RANGES.find((p) => p.value === business.priceRange)?.label;
  const category = (business.category || "").toString().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
  const todayKey = DAYS[new Date().getDay()][0];
  const tagLabels: string[] = (business.tags || []).map((t: any) => BUSINESS_TAGS.find((b) => b.value === (t.tag || t))?.label || (t.tag || t));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}, ${business.state}`)}`;
  const amenities = Array.from(new Set([...(business.serviceList || business.services || []), ...tagLabels])) as string[];
  const hours = business.hours && Object.keys(business.hours).length ? business.hours : DEFAULT_HOURS;
  const status = openStatus(hours, todayKey);

  // rating breakdown
  const dist = [5, 4, 3, 2, 1].map((s) => reviews.filter((r) => Math.round(r.rating) === s).length);
  const maxDist = Math.max(1, ...dist);

  return (
    <div style={{ background: "var(--paper)" }}>
      {/* Hero gallery */}
      <div className="relative">
        <div className="grid h-[280px] grid-cols-4 grid-rows-2 gap-1.5 md:h-[400px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[0]} alt={business.name} className="col-span-4 row-span-2 h-full w-full object-cover md:col-span-2" />
          {gallery.slice(1, 5).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`${business.name} ${i + 2}`} className="hidden h-full w-full object-cover md:block" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 md:px-8">
          <Link href="/search" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm shadow-sm" style={{ background: "rgba(255,255,255,0.95)", color: "var(--ink-900)" }}><ArrowLeft size={15} /> Back</Link>
          <div className="flex gap-2">
            <button onClick={toggleFav} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm shadow-sm" style={{ background: "rgba(255,255,255,0.95)", color: "var(--ink-900)" }}>
              <Heart size={15} fill={fav ? "var(--clay-500)" : "none"} stroke={fav ? "var(--clay-500)" : "currentColor"} /> {fav ? "Saved" : "Save"}
            </button>
            <button onClick={share} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-body-sm shadow-sm" style={{ background: "rgba(255,255,255,0.95)", color: "var(--ink-900)" }}>
              <Share2 size={15} /> {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        {/* Header */}
        <div className="py-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {verified && <Seal size={24} />}
            <h1 className="t-h1" style={{ color: "var(--ink-900)" }}>{business.name}</h1>
            {verified && <Tag tone="moss" leading={<BadgeCheck size={12} />}>{isFood ? "Halal Verified" : "Verified"}</Tag>}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 t-body-sm" style={{ color: "var(--ink-500)" }}>
            {business.reviewCount > 0 && (
              <span className="inline-flex items-center gap-1.5" style={{ color: "var(--ink-700)" }}>
                <Stars n={business.averageRating} /> <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                <a href="#reviews" style={{ color: "var(--moss-700)" }}>({business.reviewCount} reviews)</a>
              </span>
            )}
            <span>{category}</span>
            {price && <span>· {price}</span>}
            <span className="inline-flex items-center gap-1"><MapPin size={13} /> {business.city}, {business.state}</span>
            <span className="inline-flex items-center gap-1" style={{ color: status.open ? "var(--ok-500)" : "var(--err-500)", fontWeight: 600 }}>
              <Clock size={13} /> {status.label}
            </span>
          </div>
          {/* key trust tags */}
          {tagLabels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tagLabels.slice(0, 6).map((t) => <Tag key={t} tone="moss">{t}</Tag>)}
            </div>
          )}
          {/* actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`tel:${business.phone}`}><Button size="sm"><Phone className="mr-1.5 h-4 w-4" /> Call Now</Button></a>
            <Link href={`/business/${id}/contact`}><Button variant="outline" size="sm"><MessageCircle className="mr-1.5 h-4 w-4" /> Message</Button></Link>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><Navigation className="mr-1.5 h-4 w-4" /> Directions</Button></a>
          </div>
        </div>

        {/* Body: main + sticky aside */}
        <div className="grid gap-6 pb-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="min-w-0 grid gap-4 content-start">
            {/* About */}
            <ManCard style={{ padding: 22 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>About {business.name}</div>
              <p className="mt-2 t-body" style={{ color: "var(--ink-700)", lineHeight: 1.6 }}>{business.description}</p>
            </ManCard>

            {/* Highlights */}
            {amenities.length > 0 && (
              <ManCard style={{ padding: 22 }}>
                <div className="t-h4" style={{ color: "var(--ink-900)", marginBottom: 12 }}>What This Place Offers</div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 t-body-sm" style={{ color: "var(--ink-700)" }}>
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "var(--moss-50)" }}><Check size={13} style={{ color: "var(--moss-700)" }} /></span>
                      {a}
                    </div>
                  ))}
                </div>
              </ManCard>
            )}

            {/* Halal & trust */}
            {verified && (
              <ManCard style={{ padding: 22, background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
                <div className="flex items-start gap-3.5">
                  <Seal size={30} />
                  <div className="flex-1">
                    <div className="t-h4" style={{ color: "var(--ink-900)" }}>{isFood ? "Halal verified by Manaakhah" : "Verified Muslim-owned"}</div>
                    <p className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 4 }}>
                      {isFood ? "We cross-checked this business's halal certification with the issuing body and confirmed ownership." : "Ownership has been confirmed by our verification team."}
                    </p>
                    <Link href={`/business/${id}/certification`} className="mt-2.5 inline-flex items-center gap-1 t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>See verification details →</Link>
                  </div>
                </div>
              </ManCard>
            )}

            {/* Reviews summary */}
            <ManCard id="reviews" style={{ padding: 22 }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="t-h4" style={{ color: "var(--ink-900)" }}>{business.reviewCount > 0 ? `${business.reviewCount} Reviews` : "Reviews"}</div>
                <Link href={`/business/${id}/review`}><Button size="sm"><Pencil className="mr-1.5 h-4 w-4" /> Write a Review</Button></Link>
              </div>
              {business.reviewCount > 0 ? (
                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="text-center sm:border-r sm:pr-6" style={{ borderColor: "var(--card-edge)" }}>
                    <div className="t-display" style={{ color: "var(--ink-900)", fontSize: 44, lineHeight: 1 }}>{business.averageRating.toFixed(1)}</div>
                    <div className="mt-1"><Stars n={business.averageRating} size={15} /></div>
                    <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{business.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="t-body-xs w-3" style={{ color: "var(--ink-500)" }}>{s}</span>
                        <Star size={11} fill="var(--clay-500)" stroke="none" />
                        <div className="h-2 flex-1 rounded-full" style={{ background: "var(--paper-2)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${(dist[i] / maxDist) * 100}%`, background: "var(--moss-700)" }} />
                        </div>
                        <span className="t-body-xs w-5 text-right" style={{ color: "var(--ink-400)" }}>{dist[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[12px] py-10 text-center" style={{ background: "var(--paper-2)" }}>
                  <Star size={24} style={{ color: "var(--clay-500)", margin: "0 auto" }} />
                  <div className="t-label" style={{ color: "var(--ink-900)", marginTop: 8 }}>No reviews yet</div>
                  <div className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 2 }}>Be the first to share your experience.</div>
                </div>
              )}
            </ManCard>

            {/* Each review as its own card */}
            {reviews.map((rv) => (
              <ManCard key={rv.id} style={{ padding: 20 }}>
                <div className="flex items-start gap-3">
                  <Avatar name={rv.user?.name || "Community member"} size={40} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="t-label" style={{ color: "var(--ink-900)" }}>{rv.user?.name || "Community member"}</div>
                      <span className="t-body-xs" style={{ color: "var(--ink-500)" }}>{rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2"><Stars n={rv.rating} size={14} />{rv.isVerified && <span className="inline-flex items-center gap-1 t-body-xs" style={{ color: "var(--moss-700)" }}><BadgeCheck size={12} /> Verified visit</span>}</div>
                    {rv.title && <div className="mt-2 t-label-sm" style={{ color: "var(--ink-900)" }}>{rv.title}</div>}
                    <p className="mt-1.5 t-body-sm" style={{ color: "var(--ink-700)", lineHeight: 1.6 }}>{rv.content || rv.text}</p>
                    {rv.ownerResponse && (
                      <div className="mt-3 rounded-[10px] p-3.5" style={{ background: "var(--paper-2)" }}>
                        <div className="flex items-center gap-1.5 t-eyebrow" style={{ color: "var(--ink-500)" }}><Seal size={13} /> Response from {business.name}</div>
                        <p className="mt-1.5 t-body-sm" style={{ color: "var(--ink-700)" }}>{rv.ownerResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ManCard>
            ))}
          </div>

          {/* Sticky aside */}
          <aside className="grid h-fit gap-4 lg:sticky lg:top-[88px]">
            <ManCard style={{ padding: 22 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 t-h4" style={{ color: "var(--ink-900)" }}><Clock size={16} style={{ color: "var(--moss-700)" }} /> Hours</div>
                <span className="rounded-full px-2 py-0.5 t-body-xs" style={{ fontWeight: 600, background: status.open ? "var(--moss-50)" : "var(--paper-2)", color: status.open ? "var(--moss-700)" : "var(--ink-500)" }}>{status.open ? "Open" : "Closed"}</span>
              </div>
              <div className="mt-3 grid gap-1.5">
                {DAYS.map(([key, label]) => {
                  const h = hours[key];
                  const isToday = key === todayKey;
                  return (
                    <div key={key} className="flex items-center justify-between t-body-sm" style={{ color: isToday ? "var(--ink-900)" : "var(--ink-500)", fontWeight: isToday ? 600 : 400 }}>
                      <span>{label}</span>
                      <span>{h?.open ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : "Closed"}</span>
                    </div>
                  );
                })}
              </div>
            </ManCard>

            <ManCard style={{ padding: 22 }}>
              <div className="t-h4" style={{ color: "var(--ink-900)" }}>Contact & Location</div>
              <div className="mt-3 grid gap-3 t-body-sm">
                <div className="flex items-start gap-2.5"><MapPin size={15} style={{ color: "var(--ink-400)", marginTop: 2 }} /><span style={{ color: "var(--ink-700)" }}>{business.address}<br />{business.city}, {business.state} {business.zipCode}</span></div>
                {business.phone && <a href={`tel:${business.phone}`} className="flex items-center gap-2.5" style={{ color: "var(--ink-700)" }}><Phone size={15} style={{ color: "var(--ink-400)" }} /> {business.phone}</a>}
                {business.website && <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5" style={{ color: "var(--moss-700)" }}><Globe size={15} style={{ color: "var(--ink-400)" }} /> Visit website</a>}
              </div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block"><Button variant="outline" size="sm" className="w-full"><Navigation className="mr-1.5 h-4 w-4" /> Get Directions</Button></a>
            </ManCard>

            <Link href={`/business/${id}/contact`} className="inline-flex items-center gap-1.5 t-body-xs" style={{ color: "var(--ink-400)" }}><Flag size={12} /> Report this listing</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
