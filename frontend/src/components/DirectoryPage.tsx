
import React, { useState } from 'react';
import { Search, MapPin, Filter, Star, Clock, Heart, ExternalLink, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All Categories',
    'Restaurants',
    'Clothing',
    'Beauty & Wellness',
    'Professional Services',
    'Tech & IT',
    'Education',
    'Healthcare',
    'Real Estate',
  ];

  const cities = [
    'All Cities',
    'San Francisco',
    'Oakland',
    'San Jose',
    'Fremont',
    'Hayward',
    'Sunnyvale',
    'Mountain View',
    'Palo Alto',
  ];

  const filters = [
    { id: 'halal-certified', label: 'Halal Certified', checked: false },
    { id: 'women-owned', label: 'Women-Owned', checked: false },
    { id: 'black-owned', label: 'Black-Owned', checked: false },
    { id: 'open-now', label: 'Open Now', checked: false },
    { id: 'delivery', label: 'Delivery Available', checked: false },
    { id: 'family-friendly', label: 'Family Friendly', checked: false },
  ];

  const businesses = [
    {
      id: 1,
      name: 'Salam Mediterranean Grill',
      category: 'Restaurant',
      address: '39500 Stevenson Pl, Fremont, CA 94539',
      phone: '(510) 555-0123',
      website: 'salamgrill.com',
      rating: 4.8,
      reviews: 124,
      image: '/placeholder.svg',
      tags: ['Halal Certified', 'Family Owned', 'Mediterranean'],
      isOpen: true,
      hours: 'Open until 10:00 PM',
      description: 'Authentic Mediterranean cuisine with fresh halal ingredients, featuring kebabs, shawarma, and traditional sides.',
      price: '$$',
    },
    {
      id: 2,
      name: 'Hijab House Boutique',
      category: 'Clothing',
      address: '1875 S Bascom Ave, San Jose, CA 95008',
      phone: '(408) 555-0156',
      website: 'hijabhouse.com',
      rating: 4.9,
      reviews: 89,
      image: '/placeholder.svg',
      tags: ['Women Owned', 'Modest Fashion', 'Accessories'],
      isOpen: true,
      hours: 'Open until 8:00 PM',
      description: 'Beautiful modest fashion and hijabs for every occasion, from casual wear to special events.',
      price: '$',
    },
    {
      id: 3,
      name: 'Tech Solutions Bay',
      category: 'Professional Services',
      address: '123 Market St, San Francisco, CA 94105',
      phone: '(415) 555-0198',
      website: 'techsolutionsbay.com',
      rating: 4.7,
      reviews: 76,
      image: '/placeholder.svg',
      tags: ['Tech Services', 'Consulting', 'Web Development'],
      isOpen: false,
      hours: 'Closed • Opens 9:00 AM',
      description: 'Full-stack development and IT consulting services for businesses of all sizes.',
      price: '$$$',
    },
    {
      id: 4,
      name: 'Barakah Beauty Salon',
      category: 'Beauty & Wellness',
      address: '2456 Telegraph Ave, Oakland, CA 94612',
      phone: '(510) 555-0134',
      website: 'barakahbeauty.com',
      rating: 4.6,
      reviews: 92,
      image: '/placeholder.svg',
      tags: ['Women Owned', 'Halal Products', 'Hijab Friendly'],
      isOpen: true,
      hours: 'Open until 7:00 PM',
      description: 'Full-service beauty salon with halal products and hijab-friendly private rooms.',
      price: '$$',
    },
    {
      id: 5,
      name: 'Al-Noor Academy',
      category: 'Education',
      address: '567 El Camino Real, Palo Alto, CA 94301',
      phone: '(650) 555-0176',
      website: 'alnooracademy.org',
      rating: 4.9,
      reviews: 45,
      image: '/placeholder.svg',
      tags: ['Islamic Education', 'Arabic Classes', 'Quran Studies'],
      isOpen: true,
      hours: 'Open until 6:00 PM',
      description: 'Comprehensive Islamic education with Arabic language and Quran studies for all ages.',
      price: '$$',
    },
    {
      id: 6,
      name: 'Halal Corner Market',
      category: 'Grocery',
      address: '890 International Blvd, Oakland, CA 94606',
      phone: '(510) 555-0143',
      website: 'halalcorner.com',
      rating: 4.4,
      reviews: 156,
      image: '/placeholder.svg',
      tags: ['Halal Certified', 'Grocery', 'Middle Eastern'],
      isOpen: true,
      hours: 'Open until 11:00 PM',
      description: 'Your one-stop shop for halal meats, Middle Eastern groceries, and specialty items.',
      price: '$',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Business Directory</h1>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto"
              >
                <Filter className="mr-2 w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox id={filter.id} />
                      <label
                        htmlFor={filter.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {businesses.length} businesses
          </p>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Sort by Relevance</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={business.isOpen ? "default" : "secondary"}
                    className={business.isOpen ? "bg-emerald-100 text-emerald-700" : ""}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {business.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="secondary" className="p-2">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{business.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400 mr-1" />
                    {business.rating}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {business.address}
                </p>
                
                <p className="text-sm text-muted-foreground mb-3">{business.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {business.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  {business.hours}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {business.reviews} reviews • {business.price}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Businesses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
