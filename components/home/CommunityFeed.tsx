"use client";

import { useState } from "react";
import { ManCard, Tag, Avatar } from "@/components/man/primitives";
import {
  ThumbsUp, MessageCircle, Share2, BadgeCheck,
  MapPin, Calendar, Briefcase, Clock, Megaphone, Star, TrendingUp,
} from "lucide-react";

type PostType = "PROMO" | "HIRING" | "EVENT" | "NEW_LISTING" | "MILESTONE";

interface MetaRow { icon: React.ElementType; label: string }
interface FeedPost {
  id: string;
  type: PostType;
  biz: string;
  bizCat: string;
  bizCity: string;
  verified: boolean;
  time: string;
  text: string;
  image?: string;
  meta?: MetaRow[];
  cta?: string;
  likes: number;
  comments: number;
}

const TYPE_STYLE: Record<PostType, { tone: "moss" | "clay" | "ok" | "warn" | "default"; label: string }> = {
  PROMO:       { tone: "clay",    label: "Promotion" },
  HIRING:      { tone: "moss",    label: "Now Hiring" },
  EVENT:       { tone: "warn",    label: "Event" },
  NEW_LISTING: { tone: "ok",      label: "New on Minara" },
  MILESTONE:   { tone: "default", label: "Milestone" },
};

const POSTS: FeedPost[] = [
  {
    id: "p1", type: "PROMO",
    biz: "Famous Kabob", bizCat: "Persian & Mediterranean", bizCity: "Arden-Arcade", verified: true, time: "2h ago",
    text: "Weekend special — 20% off all platters Friday through Sunday! Dine-in or takeout. Perfect after Jumu'ah with the family. No code needed, just mention Minara.",
    image: "https://images.unsplash.com/photo-1600555379885-08a02224726d?auto=format&fit=crop&w=900&q=70",
    meta: [
      { icon: Megaphone, label: "20% off all platters" },
      { icon: Clock,     label: "Valid Fri – Sun only" },
      { icon: MapPin,    label: "Arden-Arcade, Sacramento" },
    ],
    cta: "View deal", likes: 87, comments: 12,
  },
  {
    id: "p2", type: "HIRING",
    biz: "Qamaria Yemeni Coffee", bizCat: "Coffee House", bizCity: "Folsom", verified: true, time: "5h ago",
    text: "We're looking for a passionate barista to join our team in Folsom! If you love specialty coffee, community, and a welcoming environment — this is your spot. Part-time, flexible hours.",
    meta: [
      { icon: Briefcase, label: "Barista · Part-time" },
      { icon: MapPin,    label: "Folsom, CA" },
      { icon: Star,      label: "$18 – $22 / hr" },
    ],
    cta: "Apply now", likes: 43, comments: 9,
  },
  {
    id: "p3", type: "EVENT",
    biz: "Islamic Center of Sacramento", bizCat: "Masjid / Islamic Center", bizCity: "Sacramento", verified: false, time: "1d ago",
    text: "Community Iftar & Bazaar this Saturday! Local Muslim-owned vendors, free iftar for all, and family activities. Come early — last year we ran out of food fast 😄",
    meta: [
      { icon: Calendar, label: "Sat, Jun 22 · after Maghrib" },
      { icon: MapPin,   label: "Islamic Center of Sacramento" },
      { icon: Star,     label: "Free entry · All welcome" },
    ],
    cta: "I'm attending", likes: 214, comments: 31,
  },
  {
    id: "p4", type: "NEW_LISTING",
    biz: "Al-Noor Pharmacy", bizCat: "Health & Wellness", bizCity: "Sacramento", verified: true, time: "2d ago",
    text: "Al-Noor Pharmacy has joined Minara! Muslim-owned and operated, serving the Sacramento community with compassionate care, halal supplements, and Arabic-speaking staff. Stop by and say salaam.",
    meta: [
      { icon: BadgeCheck, label: "Owner-verified listing" },
      { icon: MapPin,     label: "Sacramento, CA" },
      { icon: Star,       label: "Arabic & English speaking staff" },
    ],
    cta: "View listing", likes: 156, comments: 22,
  },
  {
    id: "p5", type: "MILESTONE",
    biz: "Sinbad Market & Bakery", bizCat: "Market & Bakery", bizCity: "Sacramento", verified: true, time: "3d ago",
    text: "We just hit 200 reviews on Minara! 🎉 Alhamdulillah, every single one means the world to us. Thank you Sacramento for the love and trust. Come grab some fresh pita on us this week.",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=70",
    meta: [
      { icon: Star,   label: "200+ reviews · 4.9 ★ average" },
      { icon: MapPin, label: "Sacramento, CA" },
    ],
    likes: 312, comments: 48,
  },
  {
    id: "p6", type: "HIRING",
    biz: "Iman Therapy", bizCat: "Counseling & Wellness", bizCity: "Sacramento", verified: true, time: "4d ago",
    text: "Seeking a licensed clinical therapist (LCSW or MFT) with experience in culturally-competent care for Muslim clients. Full-time with competitive pay, flexible schedule, and a supportive team.",
    meta: [
      { icon: Briefcase, label: "Therapist (LCSW / MFT) · Full-time" },
      { icon: MapPin,    label: "Sacramento, CA" },
      { icon: Star,      label: "$75k – $95k / year" },
    ],
    cta: "Apply now", likes: 67, comments: 14,
  },
  {
    id: "p7", type: "PROMO",
    biz: "Adam's International Market", bizCat: "International Grocery", bizCity: "Elk Grove", verified: false, time: "5d ago",
    text: "Fresh produce drop this week — dates, pistachios, pomegranate, and specialty items straight from our import shipment. First come first served. Open daily 9am–9pm.",
    meta: [
      { icon: Megaphone, label: "Limited stock — this week only" },
      { icon: Clock,     label: "Open daily 9am – 9pm" },
      { icon: MapPin,    label: "Elk Grove, CA" },
    ],
    likes: 99, comments: 7,
  },
  {
    id: "p8", type: "EVENT",
    biz: "Amal Tutoring", bizCat: "Tutoring / Education", bizCity: "Elk Grove", verified: true, time: "6d ago",
    text: "Free SAT prep workshop this Sunday for Muslim high school students. Our instructors volunteer their time every month — no strings attached. Seats are limited, first-come first-served.",
    meta: [
      { icon: Calendar, label: "Sun, Jun 23 · 10am – 2pm" },
      { icon: MapPin,   label: "Elk Grove Community Library" },
      { icon: Star,     label: "Free · High schoolers welcome" },
    ],
    cta: "Reserve a seat", likes: 188, comments: 26,
  },
];

const FILTER_TABS: { key: PostType | "ALL"; label: string }[] = [
  { key: "ALL",         label: "All" },
  { key: "PROMO",       label: "Promotions" },
  { key: "HIRING",      label: "Hiring" },
  { key: "EVENT",       label: "Events" },
  { key: "NEW_LISTING", label: "New Listings" },
  { key: "MILESTONE",   label: "Milestones" },
];

const SUGGESTED = [
  { name: "Zaitoon Sweets",    cat: "Bakery & Sweets",      city: "Sacramento" },
  { name: "Baraka Legal Group", cat: "Legal Services",       city: "Sacramento" },
  { name: "Amal Tutoring",     cat: "Tutoring / Education", city: "Elk Grove" },
];

const TRENDING = [
  "#HalalFood", "#MuslimOwned", "#SacramentoEats",
  "#CommunityFirst", "#HiringNow", "#IftarEvents",
];

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const { tone, label } = TYPE_STYLE[post.type];
  const likeCount = post.likes + (liked ? 1 : 0);

  return (
    <ManCard style={{ padding: 0, overflow: "hidden" }}>
      {/* Post header */}
      <div className="flex items-start justify-between gap-3 p-4 pb-0">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar name={post.biz} size={44} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="t-label" style={{ color: "var(--ink-900)" }}>{post.biz}</span>
              {post.verified && <BadgeCheck size={14} style={{ color: "var(--moss-700)", flexShrink: 0 }} />}
            </div>
            <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>
              {post.bizCat} · {post.bizCity} · {post.time}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Tag tone={tone}>{label}</Tag>
        </div>
      </div>

      {/* Post text */}
      <p className="px-4 pt-3 t-body-sm" style={{ color: "var(--ink-700)", lineHeight: 1.65 }}>
        {post.text}
      </p>

      {/* Optional image */}
      {post.image && (
        <div className="mt-3 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image} alt=""
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: 280 }}
            loading="lazy"
          />
        </div>
      )}

      {/* Meta block */}
      {post.meta && (
        <div className="mx-4 mt-3 rounded-lg p-3" style={{ background: "var(--paper-2)", border: "1px solid var(--card-edge)" }}>
          <div className="space-y-1">
            {post.meta.map(({ icon: Icon, label: metaLabel }, i) => (
              <div key={i} className="flex items-center gap-2 t-body-sm" style={{ color: "var(--ink-700)" }}>
                <Icon size={13} style={{ color: "var(--ink-400)", flexShrink: 0 }} />
                <span>{metaLabel}</span>
              </div>
            ))}
          </div>
          {post.cta && (
            <button
              className="mt-3 rounded-md px-3 py-1.5 t-body-sm man-focus"
              style={{ background: "var(--moss-700)", color: "var(--bone)", fontWeight: 600 }}
            >
              {post.cta} →
            </button>
          )}
        </div>
      )}

      {/* Reaction bar */}
      <div className="flex items-center gap-1 px-4 py-3 mt-2" style={{ borderTop: "1px solid var(--card-edge)" }}>
        <button
          onClick={() => setLiked((v) => !v)}
          className="man-focus flex items-center gap-1.5 rounded-md px-3 py-1.5 t-body-sm transition-colors hover:bg-[var(--paper-2)]"
          style={{ color: liked ? "var(--moss-700)" : "var(--ink-500)", fontWeight: liked ? 600 : 400 }}
        >
          <ThumbsUp
            size={14}
            style={{ fill: liked ? "var(--moss-700)" : "none", color: liked ? "var(--moss-700)" : "var(--ink-500)" }}
          />
          {likeCount}
        </button>
        <button
          className="man-focus flex items-center gap-1.5 rounded-md px-3 py-1.5 t-body-sm transition-colors hover:bg-[var(--paper-2)]"
          style={{ color: "var(--ink-500)" }}
        >
          <MessageCircle size={14} />
          {post.comments}
        </button>
        <button
          className="man-focus ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 t-body-sm transition-colors hover:bg-[var(--paper-2)]"
          style={{ color: "var(--ink-500)" }}
        >
          <Share2 size={14} />
          Share
        </button>
      </div>
    </ManCard>
  );
}

export function CommunityFeed() {
  const [filter, setFilter] = useState<PostType | "ALL">("ALL");
  const filtered = filter === "ALL" ? POSTS : POSTS.filter((p) => p.type === filter);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      {/* Filter pill tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FILTER_TABS.map(({ key, label }) => {
          const on = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="man-focus flex-shrink-0 rounded-full px-4 py-1.5 t-body-sm transition-colors"
              style={{
                background:   on ? "var(--moss-700)" : "var(--paper-2)",
                color:        on ? "var(--bone)"     : "var(--ink-700)",
                border:       "1px solid",
                borderColor:  on ? "var(--moss-700)" : "var(--card-edge)",
                fontWeight:   on ? 600 : 400,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Two-column layout: feed + sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Feed */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <ManCard style={{ padding: 32, textAlign: "center" }}>
              <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>No posts in this category yet.</p>
            </ManCard>
          ) : (
            filtered.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <ManCard style={{ padding: 20 }}>
            <div className="t-eyebrow mb-3" style={{ color: "var(--ink-500)" }}>Suggested Businesses</div>
            <div className="space-y-4">
              {SUGGESTED.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <Avatar name={s.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{s.name}</div>
                    <div className="t-body-xs" style={{ color: "var(--ink-500)" }}>{s.cat} · {s.city}</div>
                  </div>
                  <button
                    className="man-focus flex-shrink-0 rounded-md px-3 py-1 t-body-xs"
                    style={{ border: "1px solid var(--moss-700)", color: "var(--moss-700)", fontWeight: 600 }}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </ManCard>

          <ManCard style={{ padding: 20 }}>
            <div className="t-eyebrow mb-3 flex items-center gap-1.5" style={{ color: "var(--ink-500)" }}>
              <TrendingUp size={12} />
              Trending in Sacramento
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((tag) => (
                <button
                  key={tag}
                  className="man-focus rounded-full px-2.5 py-1 t-body-xs transition-colors hover:bg-[var(--moss-50)]"
                  style={{ background: "var(--paper-2)", color: "var(--ink-700)", border: "1px solid var(--card-edge)" }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </ManCard>
        </aside>
      </div>
    </div>
  );
}
