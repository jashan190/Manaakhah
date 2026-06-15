import type { BusinessCategory } from "./mock-data/types";

// Curated real photos (Unsplash CDN) for the core buckets; keyword photos (LoremFlickr)
// for the long tail so every category — food or not — gets a relevant image.
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

const SETS: Record<string, string[]> = {
  restaurant: [U("1600555379885-08a02224726d"), U("1542739764-0ca4adda2df5"), U("1695712641388-87c0f9c2d36e")],
  grocery: [U("1578916171728-46686eac8d58"), U("1607349913338-fca6f7fc42d0"), U("1545601445-4d6a0a0565f0")],
  coffee: [U("1509042239860-f550ce710b93"), U("1447933601403-0c6688de566e"), U("1495474472287-4d71bcdd2085")],
  salon: [U("1634449571010-02389ed0f9b0"), U("1580618672591-eb180b1a973f"), U("1595475884562-073c30d45670")],
  office: [U("1497366811353-6870744d04b2"), U("1657978837950-03646a7c7b9e"), U("1497366754035-f200968a6e72")],
};

// Buckets without a curated set fall back to keyword photos (stable per business via ?lock)
const KEYWORDS: Record<string, string> = {
  bakery: "bakery,pastry", jewelry: "jewelry,gold", flowers: "florist,flowers",
  clothing: "boutique,clothing", bookstore: "bookstore,books", barber: "barbershop",
  auto: "auto,repair,garage", plumbing: "plumbing", electrical: "electrician,wiring",
  home: "home,renovation", legal: "law,office", accounting: "accounting,finance",
  health: "medical,clinic", dental: "dentist,clinic", pharmacy: "pharmacy",
  fitness: "gym,fitness", childcare: "daycare,children", education: "classroom,study",
  photography: "photography,studio", realestate: "house,realestate", mosque: "mosque",
  tailor: "tailor,sewing", spa: "spa,beauty", tech: "computer,desk", charity: "charity,community",
};

function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

function bucket(category: BusinessCategory, name = ""): string {
  const n = name.toLowerCase();
  // Name keywords win (a "Bismillah Jewelers" should look like jewelry, not "OTHER")
  if (/coffee|caf[eé]|chai|\btea\b|qahwa|qamaria|qisa/.test(n)) return "coffee";
  if (/bakery|baker|pastr|sweets?|dessert|baklava|cake|donut|kunafa|halwa/.test(n)) return "bakery";
  if (/jewel|gold|diamond|\brings?\b/.test(n)) return "jewelry";
  if (/flower|florist|bloom|petal/.test(n)) return "flowers";
  if (/boutique|clothing|fashion|apparel|abaya|hijab|thobe|thawb|modest|attire|garment|wear/.test(n)) return "clothing";
  if (/book|librar|islamic goods|gift/.test(n)) return "bookstore";
  if (/barber/.test(n)) return "barber";
  if (/salon|beauty|\bhair\b|nails?|lash|brow|henna|makeup/.test(n)) return "salon";
  if (/spa|wax|skincare|massage/.test(n)) return "spa";
  if (/auto|\bcar\b|tire|mechanic|garage|collision|detailing|smog|body shop/.test(n)) return "auto";
  if (/plumb/.test(n)) return "plumbing";
  if (/electric/.test(n)) return "electrical";
  if (/handyman|remodel|construction|contractor|roofing|hvac|cleaning|landscap|paint/.test(n)) return "home";
  if (/law|legal|attorney|immigration|counsel at law/.test(n)) return "legal";
  if (/account|\btax\b|cpa|bookkeep|financ/.test(n)) return "accounting";
  if (/dental|dentist|orthodon|smile/.test(n)) return "dental";
  if (/pharmac|drug|rx/.test(n)) return "pharmacy";
  if (/clinic|medical|health|wellness|doctor|therap|counsel|physical|chiro|optom|urgent/.test(n)) return "health";
  if (/gym|fitness|martial|jiu|boxing|crossfit|yoga/.test(n)) return "fitness";
  if (/daycare|childcare|montessori|preschool|nursery|kids/.test(n)) return "childcare";
  if (/tutor|academy|learning|quran|hifz|school|education|institute|college prep/.test(n)) return "education";
  if (/photo|studio|media|videograph/.test(n)) return "photography";
  if (/realty|real estate|realtor|properties|homes|mortgage/.test(n)) return "realestate";
  if (/masjid|mosque|islamic center|musalla/.test(n)) return "mosque";
  if (/tailor|alteration|\bsew|stitch|embroider/.test(n)) return "tailor";
  if (/market|grocery|halal meat|butcher|\bmart\b|produce|spice/.test(n)) return "grocery";
  if (/restaurant|grill|kabob|kebab|kitchen|\bbbq\b|biryani|shawarma|pizza|burger|cuisine|dine|tandoor|curry|halal food/.test(n)) return "restaurant";
  if (/\btech\b|\bit\b|computer|software|\bweb\b|digital|marketing|print|signs?/.test(n)) return "tech";

  switch (category) {
    case "GROCERY": return "grocery";
    case "RESTAURANT": case "HALAL_FOOD": return "restaurant";
    case "BAKERY": return "bakery";
    case "JEWELRY": return "jewelry";
    case "CLOTHING": return "clothing";
    case "FLORIST": return "flowers";
    case "BOOKS_GIFTS": return "bookstore";
    case "RETAIL": return "clothing";
    case "BARBER_SALON": return "salon";
    case "BEAUTY_SPA": return "spa";
    case "FITNESS": return "fitness";
    case "AUTO_REPAIR": return "auto";
    case "PLUMBING": return "plumbing";
    case "ELECTRICAL": return "electrical";
    case "HANDYMAN": case "HOME_SERVICES": return "home";
    case "LEGAL_SERVICES": return "legal";
    case "ACCOUNTING": return "accounting";
    case "REAL_ESTATE": return "realestate";
    case "TECH_SERVICES": return "tech";
    case "PHOTOGRAPHY": return "photography";
    case "TAILORING": return "tailor";
    case "EVENTS": return "office";
    case "HEALTH_WELLNESS": return "health";
    case "CHILDCARE": return "childcare";
    case "TUTORING": return "education";
    case "MASJID": return "mosque";
    case "COMMUNITY_AID": return "charity";
    default: return "office";
  }
}

export function getCategoryImage(category: BusinessCategory, name = ""): string {
  const key = bucket(category, name);
  const h = hash(name);
  if (SETS[key]) return SETS[key][h % SETS[key].length];
  const kw = KEYWORDS[key] || "shop";
  return `https://loremflickr.com/900/600/${kw}?lock=${h % 1000}`;
}
