import type { MockReview, MockUser } from "./types";

/* Demo reviewers + reviews so flagship business profiles aren't empty in mock mode. */

const D = (s: string) => new Date(s);

export const SEED_REVIEW_USERS: MockUser[] = [
  ["u-rev-1", "Hassan K.", "hassan@example.com"],
  ["u-rev-2", "Mariam T.", "mariam@example.com"],
  ["u-rev-3", "Bilal R.", "bilal@example.com"],
  ["u-rev-4", "Sara A.", "sara@example.com"],
  ["u-rev-5", "Omar D.", "omar@example.com"],
].map(([id, name, email]) => ({
  id, email, password: "password", name, phone: null, role: "CONSUMER",
  image: null, emailVerified: D("2025-06-01"), createdAt: D("2025-06-01"), updatedAt: D("2025-06-01"),
}));

type R = [string, string, number, string, string, string[], string?];
// [businessId, userId, rating, title, content, tags, ownerResponse?]
const RAW: R[] = [
  ["sac-famous-kabob", "u-rev-1", 4, "Great kabobs, prayer space a plus",
    "Mixed grill was excellent and the lamb was tender. Loved that there's a prayer space — made it easy to bring the family on a Friday. Service was a touch slow when busy.",
    ["Prayer space", "Family seating"],
    "Jazakum Allah khair, Hassan! So glad the prayer space worked for your family — we just expanded it. Hope to see you again soon, in shaa Allah."],
  ["sac-famous-kabob", "u-rev-2", 5, "Best mixed grill in Sacramento",
    "Been coming here for years. Everything is zabihah and the certification gave me total peace of mind. The koobideh is unreal.",
    ["Hand-slaughtered confirmed", "Alcohol-free"]],
  ["sac-famous-kabob", "u-rev-3", 5, "Family favorite",
    "Generous portions, fresh naan, and the staff are kind. Takes catering orders for events too — did our Eid dinner.",
    ["Catering", "Family seating"]],
  ["sac-famous-kabob", "u-rev-4", 4, "Solid and reliable",
    "Consistent quality every visit. Wish they had more parking on weekends, but the food makes up for it.",
    ["Good value"]],
  ["sac-sinbad-market-and-bakery", "u-rev-2", 5, "Halal butcher + fresh baklava",
    "The butcher counter is the real deal — fresh lamb and goat. The bakery in the back has the best baklava I've found in the area.",
    ["Halal meat", "Butcher"]],
  ["sac-sinbad-market-and-bakery", "u-rev-5", 4, "Well-stocked market",
    "Great selection of Middle Eastern groceries and spices. Staff helped me find everything. Gets busy after Jummah.",
    ["Muslim-owned"]],
  ["sac-shalimar-restaurant", "u-rev-3", 5, "Authentic Pakistani food",
    "The biryani and karahi are fantastic. Everything is halal and the portions are huge. Highly recommend the chai.",
    ["Hand-slaughtered confirmed"]],
  ["sac-shalimar-restaurant", "u-rev-1", 4, "Good for groups",
    "Brought a big group and they handled it well. Food came out hot and fresh. A little loud but that's part of the charm.",
    ["Family seating"]],
  ["sac-shan-market", "u-rev-4", 5, "My go-to grocery",
    "Friendly owners, fair prices, and a solid halal meat section. Love supporting a Muslim-owned shop in the neighborhood.",
    ["Muslim-owned", "Halal meat"]],
  ["sac-kabab-corner", "u-rev-5", 4, "Quick, tasty, halal",
    "Perfect for a fast lunch. The chicken kabob roll is my favorite. Clean and the staff are welcoming.",
    ["Good value"]],
];

export function getSeedReviews(): MockReview[] {
  return RAW.map(([businessId, userId, rating, title, content, tags, ownerResponse], i) => ({
    id: `seed-review-${i + 1}`,
    businessId,
    userId,
    bookingId: null,
    rating,
    title,
    content,
    text: content,
    photos: [],
    tags,
    isVerified: true,
    verifiedAt: D("2026-03-01"),
    helpfulCount: [12, 31, 8, 5, 19, 6, 22, 4, 15, 9][i] ?? 3,
    reportCount: 0,
    ownerResponse: ownerResponse ?? null,
    respondedAt: ownerResponse ? D("2026-03-05") : null,
    status: "PUBLISHED",
    flagReason: null,
    moderatedBy: null,
    moderatedAt: null,
    createdAt: D(`2026-0${(i % 5) + 1}-1${i % 9}`),
    updatedAt: D(`2026-0${(i % 5) + 1}-1${i % 9}`),
  }));
}
