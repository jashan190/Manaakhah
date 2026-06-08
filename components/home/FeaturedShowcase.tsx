"use client";

import { useEffect, useState } from "react";

type Slide = { name: string; category: string; area: string; tags: string[]; img: string };
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1100&q=70`;

// Real featured Sacramento businesses from the directory — a mix beyond food
const slides: Slide[] = [
  { name: "Famous Kabob", category: "Persian & Mediterranean", area: "Arden-Arcade, Sacramento", tags: ["Muslim-owned", "Dine-in"], img: U("1600555379885-08a02224726d") },
  { name: "Sinbad Market & Bakery", category: "Market & bakery", area: "Hurley Way, Sacramento", tags: ["Muslim-owned", "Butcher"], img: U("1578916171728-46686eac8d58") },
  { name: "Sumaya Salon", category: "Women's salon & beauty", area: "Sacramento", tags: ["Muslim-owned", "Sisters-only"], img: U("1634449571010-02389ed0f9b0") },
  { name: "Iman Therapy", category: "Counseling & wellness", area: "Sacramento", tags: ["Muslim-owned", "Professional"], img: U("1497366811353-6870744d04b2") },
  { name: "Adam's International Market", category: "International grocery", area: "Elk Grove", tags: ["Muslim-owned", "Grocer"], img: U("1607349913338-fca6f7fc42d0") },
  { name: "Qamaria Yemeni Coffee", category: "Yemeni coffee house", area: "Folsom", tags: ["Muslim-owned", "Café"], img: U("1509042239860-f550ce710b93") },
];

export function FeaturedShowcase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 3800);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-[14px]" style={{ boxShadow: "var(--shadow-lift)" }}>
      {/* rotating photo panels with moss scrim for legibility */}
      {slides.map((sl, idx) => (
        <div key={sl.name} className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: idx === i ? 1 : 0,
            backgroundImage: `linear-gradient(180deg, rgba(17,50,30,0.15), rgba(17,50,30,0.78)), url(${sl.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
      ))}

      {/* floating info card */}
      <div className="absolute bottom-5 left-5 right-5 rounded-[14px] border bg-white p-4"
        style={{ borderColor: "var(--card-edge)", boxShadow: "var(--shadow-lift)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="t-eyebrow" style={{ color: "var(--clay-700)" }}>Featured · Muslim-owned</div>
            <div className="mt-1 t-h4" style={{ color: "var(--ink-900)" }}>{s.name}</div>
            <div className="t-body-sm" style={{ color: "var(--ink-500)" }}>{s.category} · {s.area}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full px-2.5 py-1 t-body-sm" style={{ background: "var(--moss-50)", color: "var(--moss-700)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* slide dots */}
      <div className="absolute right-4 top-4 flex gap-1.5">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{ width: idx === i ? 18 : 6, background: idx === i ? "#FBF8F2" : "rgba(251,248,242,0.5)" }} />
        ))}
      </div>
    </div>
  );
}
