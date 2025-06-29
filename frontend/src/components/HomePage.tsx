
import React from 'react';
import { Search, MapPin, Calendar, Users, Heart, ArrowUp, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const categories = [
    { name: 'Restaurants', icon: '🍽️', count: 45 },
    { name: 'Clothing', icon: '👕', count: 28 },
    { name: 'Beauty & Wellness', icon: '💄', count: 22 },
    { name: 'Professional Services', icon: '💼', count: 35 },
    { name: 'Tech & IT', icon: '💻', count: 18 },
    { name: 'Education', icon: '📚', count: 15 },
    { name: 'Healthcare', icon: '🏥', count: 12 },
    { name: 'Real Estate', icon: '🏠', count: 20 },
  ];

  const featuredBusinesses = [
    {
      id: 1,
      name: 'Salam Mediterranean Grill',
      category: 'Restaurant',
      location: 'Fremont, CA',
      rating: 4.8,
      reviews: 124,
      image: '/placeholder.svg',
      tags: ['Halal Certified', 'Family Owned'],
      isOpen: true,
      description: 'Authentic Mediterranean cuisine with fresh halal ingredients',
    },
    {
      id: 2,
      name: 'Hijab House Boutique',
      category: 'Clothing',
      location: 'San Jose, CA',
      rating: 4.9,
      reviews: 89,
      image: '/placeholder.svg',
      tags: ['Women Owned', 'Modest Fashion'],
      isOpen: true,
      description: 'Beautiful modest fashion and hijabs for every occasion',
    },
    {
      id: 3,
      name: 'Tech Solutions Bay',
      category: 'Professional Services',
      location: 'San Francisco, CA',
      rating: 4.7,
      reviews: 76,
      image: '/placeholder.svg',
      tags: ['Tech Services', 'Consulting'],
      isOpen: false,
      description: 'Full-stack development and IT consulting services',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Eid Bazaar 2024',
      date: '2024-07-15',
      time: '10:00 AM',
      location: 'Islamic Center of San Francisco',
      attendees: 250,
    },
    {
      id: 2,
      title: 'Muslim Women Entrepreneurs Meetup',
      date: '2024-07-20',
      time: '2:00 PM',
      location: 'South Bay Islamic Association',
      attendees: 45,
    },
    {
      id: 3,
      title: 'Halal Food Festival',
      date: '2024-07-25',
      time: '11:00 AM',
      location: 'Fremont Central Park',
      attendees: 500,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-gold-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-gold-600 bg-clip-text text-transparent">
                Discover & Support
              </span>
              <br />
              <span className="text-foreground">Muslim-Owned Businesses</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with authentic halal restaurants, modest fashion, professional services, 
              and community spaces across the San Francisco Bay Area.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-lg border">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search businesses, services, or cuisine..."
                    className="pl-10 border-0 focus-visible:ring-0 text-base"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="City or ZIP code"
                    className="pl-10 border-0 focus-visible:ring-0 text-base"
                  />
                </div>
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">200+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-muted-foreground">Prayer Spaces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">15</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">1000+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/directory?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-emerald-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} businesses
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Businesses</h2>
              <p className="text-muted-foreground text-lg">Highly recommended by our community</p>
            </div>
            <Link to="/directory">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowUp className="ml-2 w-4 h-4 rotate-45" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
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
                      {business.isOpen ? "Open Now" : "Closed"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    {business.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/90">
                        {tag}
                      </Badge>
                    ))}
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
                  
                  <p className="text-muted-foreground mb-2">{business.category} • {business.location}</p>
                  <p className="text-sm text-muted-foreground mb-4">{business.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {business.reviews} reviews
                    </span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground text-lg">Don't miss these community gatherings</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="hidden sm:flex">
                View Calendar
                <Calendar className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {event.time} • {event.attendees} attending
                    </div>
                    <Button size="sm">
                      RSVP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Connect with fellow Muslims, discover amazing businesses, and help strengthen 
            our community across the Bay Area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" variant="secondary" className="flex-1">
              <Users className="mr-2 w-5 h-5" />
              Join Community
            </Button>
            <Button size="lg" variant="outline" className="flex-1 text-white border-white hover:bg-white hover:text-emerald-600">
              <Heart className="mr-2 w-5 h-5" />
              Add Your Business
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
