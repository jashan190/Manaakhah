"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import to avoid SSR issues with WebGL
const MapLibreMap = dynamic(() => import("@/components/map/MapLibreMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});
import { Input } from "@/components/ui/input";
import { Select } from "@/components/man/Select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_TAGS,
  DISTANCE_OPTIONS,
  SORT_OPTIONS,
  PRICE_RANGES,
  DEFAULT_LOCATION,
} from "@/lib/constants";
import { useMockSession } from "@/components/mock-session-provider";
import { useMapSearch, type Business, type MapBounds } from "@/hooks/useMapSearch";
import { ViewToggle, type ViewMode } from "@/components/search/ViewToggle";
import { FilterSheet } from "@/components/search/FilterSheet";
import { FilterRail } from "@/components/search/FilterRail";
import { categoriesForGroup } from "@/lib/category-groups";
import { Bookmark, MessageCircle, Heart, Star, Check, Store } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchContent() {
  const { data: session } = useMockSession();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // Default to the service-area center so nearest businesses show immediately
  // (refined to the user's real location if geolocation is granted).
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: DEFAULT_LOCATION.latitude,
    lng: DEFAULT_LOCATION.longitude,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Read the ?group= URL param for grouped-category filtering
  const searchParams = useSearchParams();
  const groupKey = searchParams.get("group") || "";

  // Use the useMapSearch hook for URL-first state management
  const { filters, setFilters, businesses, isLoading, isStale, setIsStale, searchBounds } = useMapSearch(userLocation);

  // Track current viewport bounds for "Search this area" functionality
  const [viewportBounds, setViewportBounds] = useState<MapBounds | null>(null);

  // Handle map bounds change (when user pans/zooms)
  const handleBoundsChange = (bounds: MapBounds) => {
    setViewportBounds(bounds);
    setIsStale(true);
  };

  // Handle "Search this area" button click
  const handleSearchThisArea = () => {
    if (viewportBounds) {
      searchBounds(viewportBounds);
    }
  };

  // Load favorites and recently viewed from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("manakhaah-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedRecent = localStorage.getItem("manakhaah-recently-viewed");
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent));
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Data is Sacramento-only — only adopt the device location if it's
          // within the service area, otherwise stay centered on Sacramento so
          // results still show. (Remove the radius check once data is multi-city.)
          const toRad = (d: number) => (d * Math.PI) / 180;
          const dLat = toRad(lat - DEFAULT_LOCATION.latitude);
          const dLng = toRad(lng - DEFAULT_LOCATION.longitude);
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(DEFAULT_LOCATION.latitude)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
          const miles = 2 * 3959 * Math.asin(Math.sqrt(a));
          if (miles <= 75) setUserLocation({ lat, lng });
        },
        () => {
          setUserLocation({
            lat: DEFAULT_LOCATION.latitude,
            lng: DEFAULT_LOCATION.longitude,
          });
        }
      );
    } else {
      setUserLocation({
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      });
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters already sync to URL via setFilters, React Query auto-refetches
  };

  const handleTagFilter = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setFilters({ tags: newTags });
  };

  const toggleFavorite = (businessId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = favorites.includes(businessId)
      ? favorites.filter((id) => id !== businessId)
      : [...favorites, businessId];
    setFavorites(newFavorites);
    localStorage.setItem("manakhaah-favorites", JSON.stringify(newFavorites));
  };

  const addToRecentlyViewed = (businessId: string) => {
    const newRecent = [businessId, ...recentlyViewed.filter((id) => id !== businessId)].slice(0, 10);
    setRecentlyViewed(newRecent);
    localStorage.setItem("manakhaah-recently-viewed", JSON.stringify(newRecent));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      tags: [],
      distance: "25",
      sort: "distance",
      priceRange: "",
      minRating: "",
      // Clear bounds when clearing filters
      ne_lat: null,
      ne_lng: null,
      sw_lat: null,
      sw_lng: null,
    });
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.tags.length +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  // Sort businesses client-side based on filter selection
  const sortedBusinesses = useMemo(() => {
    let sorted = [...businesses];
    if (filters.sort === "rating") {
      sorted.sort((a, b) => b.averageRating - a.averageRating);
    } else if (filters.sort === "reviews") {
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    // distance sort is default from API
    if (groupKey) {
      const cats = categoriesForGroup(groupKey);
      sorted = sorted.filter((b) => cats.includes(b.category as any));
    }
    return sorted;
  }, [businesses, filters.sort, groupKey]);

  // Transform businesses for map component (needs latitude/longitude)
  const businessesForMap = useMemo(() => {
    return sortedBusinesses
      .filter((b) => b.latitude && b.longitude)
      .map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        address: b.address,
        city: b.city,
        latitude: b.latitude,
        longitude: b.longitude,
        averageRating: b.averageRating,
        reviewCount: b.reviewCount,
        distance: b.distance,
        tags: b.tags?.map((t) => t.tag) || [],
        imageUrl: b.coverImage || (typeof b.photos?.[0] === "string" ? b.photos[0] : b.photos?.[0]?.url),
        description: b.description,
      }));
  }, [sortedBusinesses]);

  // Render business card
  const renderBusinessCard = (business: Business, compact: boolean = false) => {
    const img = (business as any).coverImage || (typeof (business as any).photos?.[0] === "string" ? (business as any).photos[0] : (business as any).photos?.[0]?.url);
    const cat = BUSINESS_CATEGORIES.find((c) => c.value === business.category)?.label;
    const price = PRICE_RANGES.find((p) => p.value === business.priceRange)?.label;
    const fav = favorites.includes(business.id);

    // Compact = short horizontal row (used in split view alongside the map)
    if (compact) {
      return (
        <Link href={`/business/${business.id}`} key={business.id} onClick={() => addToRecentlyViewed(business.id)}>
          <div className="flex gap-3 overflow-hidden rounded-[12px] p-2.5 transition-shadow hover:shadow-[var(--shadow-rest)]"
            style={{ background: "var(--card)", border: "1px solid var(--card-edge)" }}>
            {/* Thumbnail */}
            <div className="relative h-[84px] w-[84px] flex-shrink-0 overflow-hidden rounded-[10px]">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={business.name} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, var(--moss-100), var(--moss-200))" }}>
                  <Store size={20} style={{ color: "var(--moss-700)" }} />
                </div>
              )}
              {business.verificationStatus === "APPROVED" && (
                <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full shadow-sm" style={{ background: "var(--moss-700)" }}>
                  <Check size={11} style={{ color: "var(--bone)" }} />
                </div>
              )}
            </div>
            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{business.name}</h3>
                <button onClick={(e) => toggleFavorite(business.id, e)} aria-label="Save" className="-mr-0.5 flex-shrink-0">
                  <Heart size={15} fill={fav ? "var(--clay-500)" : "none"} stroke={fav ? "var(--clay-500)" : "var(--ink-400)"} />
                </button>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 t-body-xs" style={{ color: "var(--ink-500)" }}>
                {business.averageRating > 0 && (
                  <span className="inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
                    <Star size={12} fill="var(--clay-500)" stroke="none" />
                    <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                    <span style={{ color: "var(--ink-400)" }}>({business.reviewCount})</span>
                  </span>
                )}
                {cat && <span>{cat}</span>}
                {price && <span>· {price}</span>}
              </div>
              <p className="mt-auto pt-1 t-body-xs line-clamp-1" style={{ color: "var(--ink-500)" }}>
                {[business.address, business.city].filter(Boolean).join(", ")}
                {business.distance !== undefined && ` · ${business.distance.toFixed(1)} mi`}
              </p>
            </div>
          </div>
        </Link>
      );
    }

    return (
    <Link href={`/business/${business.id}`} key={business.id} onClick={() => addToRecentlyViewed(business.id)}>
      <div className="h-full overflow-hidden rounded-[14px] transition-shadow hover:shadow-[var(--shadow-lift)]"
        style={{ background: "var(--card)", border: "1px solid var(--card-edge)" }}>
        <div className="relative">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={business.name} loading="lazy" className={`${compact ? 'aspect-[16/9]' : 'aspect-video'} w-full object-cover`} />
          ) : (
            <div className={`${compact ? 'aspect-[16/9]' : 'aspect-video'} flex items-center justify-center`}
              style={{ background: "linear-gradient(135deg, var(--moss-100), var(--moss-200))" }}>
              <Store size={26} style={{ color: "var(--moss-700)" }} />
            </div>
          )}

          <button onClick={(e) => toggleFavorite(business.id, e)} aria-label="Save"
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
            style={{ background: "var(--card)" }}>
            <Heart size={15} fill={fav ? "var(--clay-500)" : "none"} stroke={fav ? "var(--clay-500)" : "var(--ink-500)"} />
          </button>

          {business.verificationStatus === "APPROVED" && (
            <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1"
              style={{ background: "var(--moss-700)", color: "var(--bone)", fontSize: 11, fontWeight: 600 }}>
              <Check size={11} /> Verified
            </div>
          )}

          {price && (
            <div className="absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5"
              style={{ background: "rgba(17,50,30,0.78)", color: "var(--bone)", fontSize: 11 }}>{price}</div>
          )}
        </div>

        <div style={{ padding: compact ? 14 : 16 }}>
          <div className="flex items-start justify-between gap-2">
            <h3 className={`${compact ? 't-label-sm' : 't-label'} line-clamp-1`} style={{ color: "var(--ink-900)" }}>{business.name}</h3>
            {business.distance !== undefined && (
              <span className="t-body-xs whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{business.distance.toFixed(1)} mi</span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 t-body-sm" style={{ color: "var(--ink-500)" }}>
            {business.averageRating > 0 && (
              <span className="inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
                <Star size={13} fill="var(--clay-500)" stroke="none" />
                <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                <span style={{ color: "var(--ink-400)" }}>({business.reviewCount})</span>
              </span>
            )}
            {cat && <span>{cat}</span>}
          </div>

          {!compact && business.description && (
            <p className="mt-2 t-body-sm line-clamp-2" style={{ color: "var(--ink-500)" }}>{business.description}</p>
          )}

          <p className="mt-2 t-body-sm line-clamp-1" style={{ color: "var(--ink-500)" }}>{[business.address, business.city].filter(Boolean).join(", ")}</p>

          {!compact && business.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {business.tags.slice(0, 3).map((tag) => {
                const ti = BUSINESS_TAGS.find((t) => t.value === tag.tag);
                return <span key={tag.tag} className="rounded-full px-2.5 py-1 t-body-xs" style={{ background: "var(--moss-50)", color: "var(--moss-700)" }}>{ti?.label.split(" ")[0] || tag.tag}</span>;
              })}
              {business.tags.length > 3 && (
                <span className="rounded-full px-2.5 py-1 t-body-xs" style={{ background: "var(--paper-2)", color: "var(--ink-700)" }}>+{business.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Search Header */}
      <div className="border-b px-4 py-6 sm:px-8" style={{ background: "var(--card)", borderColor: "var(--card-edge)" }}>
        <div className="container mx-auto max-w-6xl">
          <h1 className="t-h2 mb-4" style={{ color: "var(--ink-900)" }}>Find Muslim-Owned Businesses</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <Input
                placeholder="Search businesses..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="md:col-span-2"
              />

              <Select
                value={filters.category}
                onChange={(v) => setFilters({ category: v })}
                placeholder="All categories"
                options={[{ value: "", label: "All categories" }, ...BUSINESS_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))]}
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="relative"
                >
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

          </form>

          {/* C3 — Filter Panel (slide-over) */}
          <FilterSheet
            open={showAdvancedFilters}
            onClose={() => setShowAdvancedFilters(false)}
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            resultCount={sortedBusinesses.length}
            activeCount={activeFilterCount}
          />

          {/* Tag Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {BUSINESS_TAGS.map((tag) => (
              <button
                key={tag.value}
                onClick={() => handleTagFilter(tag.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  filters.tags.includes(tag.value)
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-[var(--card-edge)] hover:border-primary hover:text-primary"
                }`}
              >
                {tag.icon} {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Guest rail — limited, but intentional (not broken) */}
        {!session && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[14px] px-5 py-4"
            style={{ background: "var(--moss-50)", border: "1px solid var(--moss-200)" }}>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--moss-700)" }}><Bookmark size={16} style={{ color: "var(--bone)" }} /></span>
              <span className="flex h-9 w-9 -ml-4 items-center justify-center rounded-full" style={{ background: "var(--clay-500)", border: "2px solid var(--moss-50)" }}><MessageCircle size={16} style={{ color: "var(--bone)" }} /></span>
            </div>
            <div className="min-w-[220px] flex-1">
              <div className="t-label" style={{ color: "var(--ink-900)" }}>You&apos;re browsing as a guest</div>
              <div className="t-body-sm" style={{ color: "var(--ink-700)" }}>Create a free account to save businesses and message owners directly.</div>
            </div>
            <div className="flex gap-2">
              <Link href="/register"><Button size="sm">Sign Up Free</Button></Link>
              <Link href="/login"><Button size="sm" variant="outline">Sign In</Button></Link>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-6">
          {/* Desktop FilterRail */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] max-h-[calc(100vh-110px)] overflow-auto rounded-[14px] border p-4"
              style={{ background: "var(--bone)", borderColor: "var(--card-edge)" }}>
              <FilterRail filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeFilterCount} />
            </div>
          </aside>

          {/* Results column */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Finding businesses near you...</p>
              </div>
            ) : sortedBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-muted-foreground mb-4">No businesses found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search filters or expanding your search radius
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Found <strong>{sortedBusinesses.length}</strong> businesses
                    {userLocation && ` within ${filters.distance} miles`}
                  </p>
                  <div className="flex items-center gap-2">
                    {favorites.length > 0 && (
                      <Link href="/favorites">
                        <Button variant="outline" size="sm">
                          View Favorites ({favorites.length})
                        </Button>
                      </Link>
                    )}
                    {/* View Toggle */}
                    <ViewToggle value={viewMode} onChange={setViewMode} />
                  </div>
                </div>

                {viewMode === "split" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* List on left - dims when stale */}
                    <div className={cn(
                      "space-y-2.5 max-h-[600px] overflow-y-auto pr-2 transition-opacity duration-300",
                      isStale ? "opacity-50" : "opacity-100"
                    )}>
                      {sortedBusinesses.map((business) => renderBusinessCard(business, true))}
                    </div>
                    {/* Map on right */}
                    <div className="h-[600px] rounded-lg overflow-hidden border sticky top-24">
                      <MapLibreMap
                        businesses={businessesForMap}
                        userLat={userLocation?.lat ?? 37.5485}
                        userLng={userLocation?.lng ?? -121.9886}
                        radius={parseInt(filters.distance) || 25}
                        onBoundsChange={handleBoundsChange}
                        isStale={isStale}
                        onSearchThisArea={handleSearchThisArea}
                        isSearching={isLoading}
                      />
                    </div>
                  </div>
                ) : viewMode === "map" ? (
                  <div className="h-[600px] rounded-lg overflow-hidden border">
                    <MapLibreMap
                      businesses={businessesForMap}
                      userLat={userLocation?.lat ?? 37.5485}
                      userLng={userLocation?.lng ?? -121.9886}
                      radius={parseInt(filters.distance) || 25}
                      onBoundsChange={handleBoundsChange}
                      isStale={isStale}
                      onSearchThisArea={handleSearchThisArea}
                      isSearching={isLoading}
                    />
                  </div>
                ) : (
                  <div className={cn(
                    "grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300",
                    isStale ? "opacity-50" : "opacity-100"
                  )}>
                    {sortedBusinesses.map((business) => renderBusinessCard(business))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--moss-700)] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
