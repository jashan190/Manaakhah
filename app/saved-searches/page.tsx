"use client";

import { useState, useEffect } from "react";
import { useMockSession } from "@/components/mock-session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BUSINESS_CATEGORIES, BUSINESS_TAGS, DISTANCE_OPTIONS } from "@/lib/constants";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    category?: string;
    tags?: string[];
    distance?: string;
  };
  alertEnabled: boolean;
  createdAt: string;
}

export default function SavedSearchesPage() {
  const { data: session } = useMockSession();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    query: "",
    category: "",
    tags: [] as string[],
    distance: "25",
    alertsEnabled: true,
  });

  useEffect(() => {
    if (session?.user?.id) loadSearches();
  }, [session?.user?.id]);

  const loadSearches = async () => {
    try {
      const res = await fetch("/api/saved-searches");
      if (res.ok) {
        const data = await res.json();
        setSearches(data.searches || []);
      }
    } catch (error) {
      console.error("Error loading saved searches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSearch = async () => {
    if (!formData.name.trim()) return;

    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          query: formData.query,
          filters: {
            category: formData.category || undefined,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            distance: formData.distance,
          },
          alertEnabled: formData.alertsEnabled,
        }),
      });
      if (res.ok) {
        await loadSearches();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating search:", error);
    }
  };

  const handleUpdateSearch = async () => {
    if (!editingId || !formData.name.trim()) return;

    try {
      const res = await fetch(`/api/saved-searches/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          query: formData.query,
          filters: {
            category: formData.category || undefined,
            tags: formData.tags.length > 0 ? formData.tags : undefined,
            distance: formData.distance,
          },
          alertEnabled: formData.alertsEnabled,
        }),
      });
      if (res.ok) {
        await loadSearches();
        resetForm();
      }
    } catch (error) {
      console.error("Error updating search:", error);
    }
  };

  const handleDeleteSearch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved search?")) return;

    try {
      const res = await fetch(`/api/saved-searches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSearches(searches.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

  const handleToggleAlerts = async (id: string) => {
    const search = searches.find((s) => s.id === id);
    if (!search) return;

    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertEnabled: !search.alertEnabled }),
      });
      if (res.ok) {
        setSearches(searches.map((s) =>
          s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
        ));
      }
    } catch (error) {
      console.error("Error toggling alerts:", error);
    }
  };

  const handleEditSearch = (search: SavedSearch) => {
    setEditingId(search.id);
    setFormData({
      name: search.name,
      query: search.query,
      category: search.filters?.category || "",
      tags: search.filters?.tags || [],
      distance: search.filters?.distance || "25",
      alertsEnabled: search.alertEnabled,
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      query: "",
      category: "",
      tags: [],
      distance: "25",
      alertsEnabled: true,
    });
    setShowCreateForm(false);
    setEditingId(null);
  };

  const runSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.query) params.append("search", search.query);
    if (search.filters?.category) params.append("category", search.filters.category);
    if (search.filters?.tags && search.filters.tags.length > 0) params.append("tags", search.filters.tags.join(","));
    if (search.filters?.distance) params.append("distance", search.filters.distance);

    window.location.href = `/search?${params.toString()}`;
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to save and manage your searches.
            </p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Saved Searches</h1>
            <p className="text-gray-600 mt-1">
              Save your search criteria and get notified when new matches appear
            </p>
          </div>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>
              + Create Saved Search
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Saved Search" : "Create New Saved Search"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Halal Restaurants Near Downtown"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Search Keywords</label>
                <input
                  type="text"
                  value={formData.query}
                  onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                  placeholder="e.g., halal, organic, fast food"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Distance</label>
                  <select
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {DISTANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TAGS.map((tag) => (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => handleTagToggle(tag.value)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.tags.includes(tag.value)
                          ? "bg-primary text-white border-primary"
                          : "bg-white border-gray-300 hover:border-primary"
                      }`}
                    >
                      {tag.icon} {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alertsEnabled"
                  checked={formData.alertsEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, alertsEnabled: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="alertsEnabled" className="text-sm">
                  Send me notifications when new businesses match this search
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={editingId ? handleUpdateSearch : handleCreateSearch}
                  disabled={!formData.name.trim()}
                >
                  {editingId ? "Update Search" : "Save Search"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Searches List */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : searches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No Saved Searches</h3>
              <p className="text-gray-600 mb-4">
                Save your favorite searches to quickly find businesses and get notified of new matches.
              </p>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Your First Saved Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <Card key={search.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{search.name}</h3>
                        {search.alertEnabled && (
                          <Badge variant="secondary" className="text-xs">
                            Alerts On
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {search.query && (
                          <Badge variant="outline">Keywords: {search.query}</Badge>
                        )}
                        {search.filters?.category && (
                          <Badge variant="outline">
                            {BUSINESS_CATEGORIES.find((c) => c.value === search.filters.category)?.label}
                          </Badge>
                        )}
                        {search.filters?.distance && (
                          <Badge variant="outline">
                            {DISTANCE_OPTIONS.find((d) => d.value === search.filters.distance)?.label || search.filters.distance + " mi"}
                          </Badge>
                        )}
                        {search.filters?.tags?.map((tag) => {
                          const tagInfo = BUSINESS_TAGS.find((t) => t.value === tag);
                          return (
                            <Badge key={tag} variant="secondary">
                              {tagInfo?.icon} {tagInfo?.label}
                            </Badge>
                          );
                        })}
                      </div>

                      <div className="text-sm text-gray-500">
                        Created {new Date(search.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" onClick={() => runSearch(search)}>
                        Run Search
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleAlerts(search.id)}
                        title={search.alertEnabled ? "Disable alerts" : "Enable alerts"}
                      >
                        {search.alertEnabled ? "On" : "Off"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSearch(search)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSearch(search.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Quick Tip</h4>
                <p className="text-sm text-gray-600">
                  You can also save a search directly from the search results page by clicking &quot;Save This Search&quot;
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline">Go to Search</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
