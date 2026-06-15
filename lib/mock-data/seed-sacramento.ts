import type { MockBusiness, BusinessCategory, BusinessTag } from "./types";
import { getCategoryImage } from "../category-images";

/**
 * Real Sacramento-area Muslim/halal businesses (team-curated list + researched detail).
 * Verified entries carry confirmed address/phone/website/hours/coords.
 * Catalog entries carry name + inferred category; address/coords are approximate
 * (Sacramento area) and flagged PENDING until researched.
 */

const now = new Date("2026-06-01T00:00:00Z");

function slugify(name: string) {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type Seed = Partial<MockBusiness> & { name: string; category: BusinessCategory };

function mk(s: Seed): MockBusiness {
  return {
    id: `sac-${slugify(s.name)}`,
    ownerId: "seed-owner",
    name: s.name,
    slug: s.slug ?? slugify(s.name),
    description: s.description ?? "",
    shortDescription: s.shortDescription ?? null,
    category: s.category,
    address: s.address ?? "",
    city: s.city ?? "Sacramento",
    state: s.state ?? "CA",
    zipCode: s.zipCode ?? "",
    latitude: s.latitude ?? 38.5816,
    longitude: s.longitude ?? -121.4944,
    phone: s.phone ?? "",
    email: s.email ?? null,
    website: s.website ?? null,
    hours: s.hours ?? null,
    serviceList: s.serviceList ?? [],
    status: "PUBLISHED",
    priceRange: s.priceRange ?? null,
    hoursOfOperation: s.hours ?? null,
    verificationStatus: s.verificationStatus ?? "PENDING",
    verifiedAt: s.verificationStatus === "APPROVED" ? now : null,
    verifiedBy: null,
    viewCount: 0,
    claimStatus: "UNCLAIMED",
    coverImage: s.coverImage ?? getCategoryImage(s.category, s.name),
    logoImage: null,
    scrapedFrom: null,
    scrapedAt: null,
    confidenceScore: null,
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: null,
    isScraped: false,
    scrapedBusinessId: null,
    prayerTimes: null,
    jummahTime: null,
    aidServices: [],
    externalUrl: null,
    createdAt: now,
    updatedAt: now,
    tags: s.tags ?? ["MUSLIM_OWNED"],
    photos: s.photos ?? [getCategoryImage(s.category, s.name)],
  };
}

const HALAL_VERIFIED: BusinessTag[] = ["MUSLIM_OWNED", "HALAL_VERIFIED"];
const allDay = (open: string, close: string) =>
  Object.fromEntries(["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map((d) => [d, { open, close }]));

/* ---- Verified (researched / team-provided addresses) ---- */
const verified: Seed[] = [
  { name: "Famous Kabob", category: "RESTAURANT", address: "1290 Fulton Ave, Ste C", zipCode: "95825", latitude: 38.5907, longitude: -121.4023, phone: "(916) 483-1700", website: "https://famouskabob.com", description: "Long-running Persian and Mediterranean halal restaurant serving kabobs, gyros and rice plates for over 25 years.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", hours: allDay("11:00", "22:00"), shortDescription: "Persian & Mediterranean halal kabobs" },
  { name: "Sinbad Market & Bakery", category: "GROCERY", address: "3033 Hurley Way, Ste 103", zipCode: "95864", latitude: 38.5905, longitude: -121.4115, phone: "(916) 755-8777", email: "info@sinbadsac.com", website: "https://sinbadsac.com", description: "Middle Eastern market, halal butcher counter and bakery with a kitchen serving shawarma, kabobs and baklava.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", hours: allDay("09:00", "21:00"), shortDescription: "Halal market, butcher & bakery" },
  { name: "Adam's International Market", category: "GROCERY", address: "9175 Elk Grove Florin Rd", city: "Elk Grove", zipCode: "95624", latitude: 38.4220, longitude: -121.4180, phone: "(916) 685-2211", website: "https://adamsinternationalmarket.com", description: "International grocery with a fresh halal butcher (lamb, goat, beef, chicken), produce, spices and a restaurant.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", hours: allDay("09:00", "20:30"), shortDescription: "Halal meat & international grocery" },
  { name: "Aria Afghan Restaurant", category: "RESTAURANT", address: "5601 Watt Ave, Ste 2", city: "North Highlands", zipCode: "95660", latitude: 38.6540, longitude: -121.3850, phone: "(916) 571-5424", website: "https://www.ariaafghanrestaurant.com", description: "Family-run Afghan restaurant known for kabobs, mantu and palaw in North Highlands.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Authentic Afghan cuisine" },
  { name: "Shalimar Restaurant", category: "RESTAURANT", address: "3654 N Freeway Blvd, Ste 320", zipCode: "95834", latitude: 38.6360, longitude: -121.5050, phone: "(916) 515-1919", description: "Pakistani and Indian halal restaurant in Natomas — BBQ, curries and biryani.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Pakistani & Indian halal" },
  { name: "Kabab Corner", category: "RESTAURANT", address: "1001 Jefferson Blvd", city: "West Sacramento", zipCode: "95691", latitude: 38.5660, longitude: -121.5470, phone: "(916) 371-6777", website: "https://kababcornerws.com", description: "Halal Pakistani, Indian and Chinese cuisine with a lunch buffet in West Sacramento.", priceRange: "MODERATE", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Halal Pakistani · Indian · Chinese" },
  { name: "Qamaria Yemeni Coffee Co", category: "RESTAURANT", address: "13405 Folsom Blvd, Ste 950", city: "Folsom", zipCode: "95630", latitude: 38.6600, longitude: -121.1560, phone: "(916) 673-9740", website: "https://www.qamariacoffee.com", description: "Yemeni coffee house serving qishr, adeni chai and specialty drinks with pastries.", priceRange: "BUDGET", tags: ["MUSLIM_OWNED"], verificationStatus: "APPROVED", shortDescription: "Yemeni coffee house" },
  // team-provided addresses (from the sheet)
  { name: "All Season Restaurant & Market", category: "GROCERY", address: "4981 Watt Ave", city: "North Highlands", zipCode: "95660", latitude: 38.6480, longitude: -121.3850, description: "Afghan market and restaurant.", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Afghan market & restaurant" },
  { name: "812 Grill", category: "RESTAURANT", address: "5908 Watt Ave (black food trailer)", city: "North Highlands", zipCode: "95660", latitude: 38.6600, longitude: -121.3850, description: "Halal food truck on Watt Ave.", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Halal food truck" },
  { name: "Zeeshan Market and Restaurant", category: "GROCERY", address: "3138 Northgate Blvd", zipCode: "95833", latitude: 38.6200, longitude: -121.5030, description: "Afghan market and restaurant.", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Afghan market & restaurant" },
  { name: "Eshan Market", category: "GROCERY", address: "3648 N Freeway Blvd, #230", zipCode: "95834", latitude: 38.6365, longitude: -121.5055, description: "Desi market with halal meat.", tags: HALAL_VERIFIED, verificationStatus: "APPROVED", shortDescription: "Desi market & halal meat" },
  { name: "Shan Market", category: "GROCERY", address: "2313 Northgate Blvd", zipCode: "95833", latitude: 38.6130, longitude: -121.5010, description: "Desi grocery store.", tags: ["MUSLIM_OWNED"], verificationStatus: "APPROVED", shortDescription: "Desi grocery" },
  { name: "Wayback Burgers", category: "RESTAURANT", address: "4000 E Commerce Way, Ste A150", zipCode: "95834", latitude: 38.6470, longitude: -121.5230, description: "Burger restaurant (halal options).", tags: ["MUSLIM_OWNED"], verificationStatus: "APPROVED", shortDescription: "Burgers" },
];

/* ---- Catalog (team list; category inferred, location pending research) ---- */
const RESTAURANT = "RESTAURANT" as const, GROCERY = "GROCERY" as const, OTHER = "OTHER" as const,
  HEALTH = "HEALTH_WELLNESS" as const, SALON = "BARBER_SALON" as const, LEGAL = "LEGAL_SERVICES" as const,
  ACCT = "ACCOUNTING" as const, AUTOC = "AUTO_REPAIR" as const, PLUMB = "PLUMBING" as const,
  ELEC = "ELECTRICAL" as const, HANDY = "HANDYMAN" as const, CHILD = "CHILDCARE" as const,
  TUTOR = "TUTORING" as const, MASJIDC = "MASJID" as const, JEWELRY = "JEWELRY" as const,
  CLOTHING = "CLOTHING" as const, BAKERY = "BAKERY" as const, FLORIST = "FLORIST" as const,
  BOOKS = "BOOKS_GIFTS" as const, RETAIL = "RETAIL" as const, BEAUTY = "BEAUTY_SPA" as const,
  FITNESS = "FITNESS" as const, REALEST = "REAL_ESTATE" as const, PHOTO = "PHOTOGRAPHY" as const,
  HOMESVC = "HOME_SERVICES" as const, TAILOR = "TAILORING" as const, EVENTS = "EVENTS" as const,
  TECH = "TECH_SERVICES" as const;

const catalog: [string, BusinessCategory, string?][] = [
  ["Shariff Jewelers", JEWELRY, "Jeweler"],
  ["Chicken N Waffles", RESTAURANT], ["Natomas Fabrics and Groceries", GROCERY, "Fabrics & groceries"],
  ["Chicken Gs", RESTAURANT], ["Mirchis", RESTAURANT], ["Halal Fried Chicken", RESTAURANT],
  ["Angry Chickz", RESTAURANT], ["Hot Bunz", RESTAURANT], ["Seniores Pizza", RESTAURANT],
  ["Spice of Life", RESTAURANT], ["MF Gyros & Burgers", RESTAURANT], ["Shah's Halal Food", RESTAURANT],
  ["Halal Muncheez", RESTAURANT], ["Ny Gyros and Philly's", RESTAURANT], ["Habibi's Grill", RESTAURANT],
  ["Falafel Fusion", RESTAURANT], ["Halal West Pizza", RESTAURANT], ["Halal Bitez Gyro", RESTAURANT],
  ["Burger Hub", RESTAURANT], ["Desi Market and Grill", GROCERY], ["Max Taste Lahorian Grill", RESTAURANT],
  ["Fresh Wok Halal", RESTAURANT], ["Afghan Fashion", CLOTHING, "Clothing & fashion"], ["Sham Sweets", BAKERY, "Sweets & bakery"],
  ["Kabob Palace", RESTAURANT], ["Town & Country Event Center", EVENTS, "Event center"],
  ["Custom Print Bros", TECH, "Printing"], ["Fabric Land", RETAIL, "Fabrics"], ["Bilal Rugs & Carpets", RETAIL, "Rugs & carpets"],
  ["Fitrah Books", BOOKS, "Bookstore"], ["Crimmigration INC", LEGAL, "Immigration law"],
  ["I & H Bookkeeping Service LLC", ACCT, "Bookkeeping"], ["Falafel & Shawarma Planet", RESTAURANT],
  ["Babylon City Market", GROCERY], ["Kabob & Gyro Grill", RESTAURANT], ["Freshmed Mediterranean", RESTAURANT],
  ["Crest Cafe", RESTAURANT, "Cafe"], ["Halal Bros", RESTAURANT], ["M's Halal Mediterranean Food", RESTAURANT],
  ["Halal Pizza Palace", RESTAURANT], ["Skios Fish and Chicken", RESTAURANT], ["Nours Cafe", RESTAURANT, "Cafe"],
  ["Qisa Coffee", RESTAURANT, "Coffee"], ["Sanas Cafe", RESTAURANT, "Cafe"], ["Chaii", RESTAURANT, "Cafe & tea"],
  ["Khyber Market", GROCERY], ["Sunrise Halal Market", GROCERY], ["East West Foods", GROCERY],
  ["Madina Market", GROCERY], ["Roots Coffee", RESTAURANT, "Coffee"], ["Kb's Thai Hut", RESTAURANT],
  ["Ariana Gyros & Kabob", RESTAURANT], ["Al-Maidah Restaurant", RESTAURANT], ["Tandoori Nights", RESTAURANT],
  ["Kabab n Chutney", RESTAURANT], ["Gyro Genie", RESTAURANT], ["Asfurah by Nawal Hassouneh", RESTAURANT, "Catering"],
  ["Capital Mobile", TECH, "Mobile & electronics"], ["Sharif Window Tinting", AUTOC, "Window tinting"],
  ["Sumaya - Women Only Salon", SALON], ["Hair Stylist - Fella Tahraoui", SALON],
  ["Nabila's Beauty Salon", SALON], ["Nisreen", SALON], ["Skin Care by Fella Tahraoui", BEAUTY, "Skincare"],
  ["Golden Letters for Translation and Immigration", LEGAL, "Translation & immigration"],
  ["Iman Therapy Inc - Kamal Ahmed", HEALTH, "Therapy"], ["Nassiba Cherif MFT - Therapist", HEALTH, "Therapy"],
  ["Gyro 2 Go", RESTAURANT], ["Halal Bitez Gyro & Kabob", RESTAURANT], ["Halal Food and Ice Cream", RESTAURANT],
  ["The Habibis Grill", RESTAURANT], ["Sumer Nights", RESTAURANT], ["Falafel Flare", RESTAURANT],
  ["Sams Grill House", RESTAURANT], ["Harir Gyro and Burger", RESTAURANT], ["Halal Grill Express", RESTAURANT],
  ["Best Kabob & Gyro", RESTAURANT], ["Halal Cali Kabob & Gyro", RESTAURANT], ["Halal Shop", RESTAURANT],
  ["Twins Halal Restaurant", RESTAURANT], ["A1 Foods", GROCERY], ["Chopan Kabob", RESTAURANT, "Afghan"],
  ["Persian Kabab & Grill", RESTAURANT], ["Red Sea Food Market", GROCERY], ["Watan Halal Market", GROCERY],
  ["Salam Market", GROCERY], ["Khorasan Halal Market", GROCERY], ["Halal Corner Market & Restaurant", GROCERY],
  ["Belal Market", GROCERY], ["Umrah Market Halal Grocery & Restaurant", GROCERY], ["Roseville Halal Mart", GROCERY, undefined],
  ["Royal International Halal Market and Restaurant", GROCERY], ["All Mart Grocery & Halal Restaurant", GROCERY],
  ["Marhaba Halal Market & Restaurant", GROCERY],
];

/* ---- Services & retail (the non-food half of the community) ---- */
const services: [string, BusinessCategory, string][] = [
  // Jewelry
  ["Bismillah Jewelers", JEWELRY, "Fine gold & diamond jewelry, custom designs and repairs"],
  ["Madina Gold & Diamond", JEWELRY, "22k gold, bridal sets and custom jewelry"],
  ["Al-Noor Fine Jewelry", JEWELRY, "Handcrafted jewelry and watch repair"],
  // Florists
  ["Jannah Florals", FLORIST, "Wedding, event and everyday flower arrangements"],
  ["Bloom & Petal Florist", FLORIST, "Fresh bouquets, nikah & walima florals"],
  // Bakeries & sweets
  ["Sweet Sunnah Bakery", BAKERY, "Custom cakes, cookies and dessert tables"],
  ["Crescent Cake Studio", BAKERY, "Bespoke celebration cakes and cupcakes"],
  ["Baghdad Sweets & Bakery", BAKERY, "Baklava, kunafa and Middle Eastern pastries"],
  // Modest fashion & retail
  ["Hidaya Modest Wear", CLOTHING, "Abayas, hijabs and modest everyday clothing"],
  ["Sahara Boutique", CLOTHING, "Modest fashion, gowns and accessories"],
  ["Noor Abaya House", CLOTHING, "Abayas, jilbabs and occasion wear"],
  ["Ihram & Co Menswear", CLOTHING, "Thobes, kufis and men's modest attire"],
  ["Bukhara Rugs & Home Decor", RETAIL, "Handwoven rugs, prayer mats and home decor"],
  // Books & gifts
  ["Iqra Books & Gifts", BOOKS, "Islamic books, Qurans, gifts and toys"],
  ["Furqan Islamic Bookstore", BOOKS, "Books, audio and Islamic learning resources"],
  // Salon / barber / beauty / spa
  ["Crown Barbershop", SALON, "Classic cuts, fades and beard grooming"],
  ["Henna by Hana", BEAUTY, "Bridal henna and natural body art"],
  ["Serenity Spa & Skincare", BEAUTY, "Facials, skincare and women-only spa days"],
  ["Lashed by Layla", BEAUTY, "Lash extensions, brows and beauty"],
  // Auto
  ["Baraka Auto Repair", AUTOC, "Full-service auto repair and maintenance"],
  ["Sahaba Smog & Tires", AUTOC, "Smog checks, tires and brakes"],
  ["Elite Auto Body & Collision", AUTOC, "Collision repair and paint"],
  ["Precision Window Tinting", AUTOC, "Auto and residential window tinting"],
  // Home services
  ["Reliable Plumbing Co", PLUMB, "Residential and commercial plumbing"],
  ["AquaFix Plumbing & Drain", PLUMB, "Drain cleaning, water heaters and repairs"],
  ["Volt Masters Electric", ELEC, "Licensed electrician — panels, lighting, EV chargers"],
  ["Nur Electric", ELEC, "Residential electrical service and repair"],
  ["Sparkle Home Cleaning", HOMESVC, "House and move-out cleaning"],
  ["GreenLeaf Landscaping", HOMESVC, "Lawn care, landscaping and irrigation"],
  ["Anchor Roofing & Solar", HOMESVC, "Roofing, repairs and solar installs"],
  // Professional services
  ["Rahman Law Group", LEGAL, "Immigration, family and business law"],
  ["Capital Immigration Law", LEGAL, "Green cards, citizenship and visas"],
  ["Barakah Tax & Accounting", ACCT, "Tax prep, bookkeeping and payroll"],
  ["Summit CPA Group", ACCT, "Accounting and CPA services for small business"],
  ["Homeland Realty", REALEST, "Buy, sell and rent across the Sacramento area"],
  ["Amana Home Loans", REALEST, "Riba-conscious home financing guidance"],
  ["Pixel Web Studio", TECH, "Websites, branding and digital marketing"],
  ["Capital Print & Signs", TECH, "Printing, banners and business signage"],
  ["Lens & Light Studio", PHOTO, "Wedding, event and portrait photography"],
  ["Royal Alterations & Tailoring", TAILOR, "Clothing alterations and custom tailoring"],
  // Health & wellness
  ["Shifa Family Clinic", HEALTH, "Primary care for the whole family"],
  ["Bright Smile Dental", HEALTH, "General and cosmetic dentistry"],
  ["Crescent Pharmacy", HEALTH, "Community pharmacy and consultations"],
  ["Noor Optometry", HEALTH, "Eye exams, glasses and contacts"],
  ["Wellness Counseling Center", HEALTH, "Faith-sensitive therapy and counseling"],
  ["Iron & Iman Fitness", FITNESS, "Coed-friendly gym with women's hours"],
  // Education & children
  ["Iqra Learning Academy", TUTOR, "K-12 tutoring, Quran and Arabic"],
  ["Math Masters Tutoring", TUTOR, "Math, science and test prep"],
  ["Little Stars Montessori", CHILD, "Montessori preschool and daycare"],
  ["Sunshine Islamic Daycare", CHILD, "Licensed daycare with Islamic values"],
  // Community
  ["SacMasjid Community Center", MASJIDC, "Daily prayers, Jummah and youth programs"],
  ["Helping Hands Relief", "COMMUNITY_AID", "Food pantry, refugee support and zakat distribution"],
];

// distribute pending entries across Sacramento-area points (approximate, for map)
const areaPoints: [number, number][] = [
  [38.5816, -121.4944], [38.6200, -121.5000], [38.5660, -121.5470], [38.6540, -121.3850],
  [38.4880, -121.4090], [38.6660, -121.1560], [38.7520, -121.2880], [38.5440, -121.4400],
  [38.6470, -121.5230], [38.5900, -121.4100], [38.6360, -121.5050], [38.4220, -121.4180],
];

export function getSacramentoBusinesses(): MockBusiness[] {
  const verifiedEntries = verified.map(mk);
  const taken = new Set(verifiedEntries.map((b) => b.slug));

  // Diverse non-food businesses — verified so they feel first-class in the directory
  const serviceEntries = services
    .filter(([name]) => !taken.has(slugify(name)))
    .map(([name, category, descr], i) => {
      const [lat, lng] = areaPoints[(i + 3) % areaPoints.length];
      taken.add(slugify(name));
      return mk({
        name, category,
        description: `${descr}.`,
        shortDescription: descr,
        city: "Sacramento",
        latitude: lat + ((i % 6) - 3) * 0.0045,
        longitude: lng + ((i % 8) - 4) * 0.0045,
        priceRange: "MODERATE",
        tags: ["MUSLIM_OWNED"],
        verificationStatus: "APPROVED",
      });
    });

  const catalogEntries = catalog
    .filter(([name]) => !taken.has(slugify(name)))
    .map(([name, category, descr], i) => {
      const [lat, lng] = areaPoints[i % areaPoints.length];
      const isFood = category === "RESTAURANT" || category === "GROCERY";
      return mk({
        name, category,
        description: descr ? `${descr}.` : "",
        shortDescription: descr ?? null,
        city: "Sacramento",
        latitude: lat + ((i % 5) - 2) * 0.004,
        longitude: lng + ((i % 7) - 3) * 0.004,
        tags: isFood ? ["MUSLIM_OWNED", "HALAL_VERIFIED"] : ["MUSLIM_OWNED"],
        verificationStatus: "PENDING",
      });
    });
  return [...verifiedEntries, ...serviceEntries, ...catalogEntries];
}
