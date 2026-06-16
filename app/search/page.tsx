"use client";

import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import to avoid SSR issues with WebGL
const MapLibreMap = dynamic(() => import("@/components/map/MapLibreMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
      <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>Loading map…</p>
    </div>
  ),
});
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DISTANCE_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_LOCATION,
} from "@/lib/constants";
import { useMockSession } from "@/components/mock-session-provider";
import { useMapSearch, type MapBounds } from "@/hooks/useMapSearch";
import { ViewToggle, type ViewMode } from "@/components/search/ViewToggle";
import { FilterRail } from "@/components/search/FilterRail";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/man/Skeleton";
import { EmptyState } from "@/components/man/EmptyState";
import { categoriesForGroup } from "@/lib/category-groups";
import { Bookmark, MessageCircle, SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

function SearchContent() {
  const { data: session } = useMockSession();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [guestDismissed, setGuestDismissed] = useState(false);
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

  // Close the Filters dropdown on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) setFiltersOpen(false);
    };
    if (filtersOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [filtersOpen]);

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
        imageUrl: (b as any).coverImage || (typeof b.photos?.[0] === "string" ? b.photos[0] : b.photos?.[0]?.url),
        description: b.description,
      }));
  }, [sortedBusinesses]);

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      {/* Search Header */}
      <div className="border-b px-4 py-6 sm:px-8" style={{ background: "var(--paper)", borderColor: "var(--card-edge)" }}>
        <div className="container mx-auto max-w-6xl">
          <h1 className="t-h2 mb-4" style={{ color: "var(--ink-900)" }}>Find Muslim-Owned Businesses</h1>

          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search businesses..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="flex-1 bg-white"
            />

            {/* Filters dropdown — every filter nested inside */}
            <div className="relative" ref={filtersRef}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFiltersOpen((o) => !o)}
                className="w-full justify-center bg-white sm:w-auto"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs" style={{ background: "var(--moss-700)", color: "var(--bone)" }}>
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="ml-1.5 h-4 w-4" style={{ transform: filtersOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
              </Button>
              {filtersOpen && (
                <div
                  className="absolute left-0 z-50 mt-2 w-[min(340px,calc(100vw-2rem))] overflow-auto rounded-[14px] border p-2 sm:left-auto sm:right-0"
                  style={{ background: "#ffffff", borderColor: "var(--card-edge)", boxShadow: "var(--shadow-lift)", maxHeight: "70vh" }}
                >
                  <FilterRail filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeFilterCount} />
                  <div className="mt-2 flex gap-2 border-t px-1 pt-2.5" style={{ borderColor: "var(--card-edge)" }}>
                    <Button type="button" variant="outline" size="sm" className="flex-1" onClick={clearFilters}>Clear All</Button>
                    <Button type="button" size="sm" className="flex-1" onClick={() => setFiltersOpen(false)}>Show {sortedBusinesses.length}</Button>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="sm:w-auto">Search</Button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Guest rail — limited, but intentional (not broken) */}
        {!session && !guestDismissed && (
          <div className="relative mb-6 flex flex-wrap items-center gap-4 rounded-[14px] py-4 pl-5 pr-12"
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
            <button onClick={() => setGuestDismissed(true)} aria-label="Dismiss"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--moss-100)]">
              <X size={16} style={{ color: "var(--ink-500)" }} />
            </button>
          </div>
        )}

        <div>
          {/* Results */}
          <div>
            {isLoading ? (
              viewMode === "split" ? (
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} variant="grid" />
                  ))}
                </div>
              )
            ) : sortedBusinesses.length === 0 ? (
              <EmptyState
                Icon={Search}
                title="No businesses found"
                description="Try adjusting your search filters or expanding your search radius."
                action={
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>
                    Found <strong style={{ color: "var(--ink-900)" }}>{sortedBusinesses.length}</strong> businesses
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
                      "flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-3 transition-opacity duration-300",
                      isStale ? "opacity-50" : "opacity-100"
                    )}>
                      {sortedBusinesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          variant="compact"
                          isFavorite={favorites.includes(business.id)}
                          onToggleFavorite={(e) => toggleFavorite(business.id, e)}
                          onView={() => addToRecentlyViewed(business.id)}
                        />
                      ))}
                    </div>
                    {/* Map on right */}
                    <div className="h-[600px] rounded-lg overflow-hidden border sticky top-24" style={{ borderColor: "var(--card-edge)" }}>
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
                ) : (
                  <div className={cn(
                    "grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300",
                    isStale ? "opacity-50" : "opacity-100"
                  )}>
                    {sortedBusinesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        isFavorite={favorites.includes(business.id)}
                        onToggleFavorite={(e) => toggleFavorite(business.id, e)}
                        onView={() => addToRecentlyViewed(business.id)}
                      />
                    ))}
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
      <div className="min-h-screen" style={{ background: "var(--paper)" }}>
        <div className="container mx-auto max-w-6xl py-8 px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} variant="grid" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
