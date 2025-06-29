
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Filter, Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const categories = [
    'All Categories',
    'Religious',
    'Community',
    'Business',
    'Education',
    'Social',
    'Youth',
    'Women',
    'Charity',
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

  const upcomingEvents = [
    {
      id: 1,
      title: 'Eid Al-Fitr Celebration 2024',
      date: '2024-07-15',
      time: '10:00 AM',
      endTime: '4:00 PM',
      location: 'Islamic Center of San Francisco',
      address: '20 Jones St, San Francisco, CA',
      category: 'Religious',
      attendees: 500,
      maxAttendees: 800,
      image: '/placeholder.svg',
      organizer: 'Islamic Center of San Francisco',
      description: 'Join us for a joyous Eid celebration with prayers, community feast, activities for children, and cultural performances.',
      price: 'Free',
      tags: ['Family Friendly', 'Food', 'Cultural'],
      featured: true,
    },
    {
      id: 2,
      title: 'Muslim Women Entrepreneurs Meetup',
      date: '2024-07-20',
      time: '2:00 PM',
      endTime: '5:00 PM',
      location: 'South Bay Islamic Association',
      address: '325 N 3rd St, San Jose, CA',
      category: 'Business',
      attendees: 45,
      maxAttendees: 60,
      image: '/placeholder.svg',
      organizer: 'Bay Area Muslim Women Network',
      description: 'Monthly networking event for Muslim women entrepreneurs and professionals. Includes panel discussion and networking session.',
      price: '$15',
      tags: ['Networking', 'Women Only', 'Professional'],
      featured: false,
    },
    {
      id: 3,
      title: 'Halal Food Festival',
      date: '2024-07-25',
      time: '11:00 AM',
      endTime: '8:00 PM',
      location: 'Fremont Central Park',
      address: '40000 Paseo Padre Pkwy, Fremont, CA',
      category: 'Community',
      attendees: 300,
      maxAttendees: 1000,
      image: '/placeholder.svg',
      organizer: 'Fremont Muslim Community',
      description: 'Annual halal food festival featuring local restaurants, food trucks, live entertainment, and family activities.',
      price: 'Free Entry',
      tags: ['Food', 'Family Friendly', 'Entertainment'],
      featured: true,
    },
    {
      id: 4,
      title: 'Islamic Finance Workshop',
      date: '2024-07-28',
      time: '7:00 PM',
      endTime: '9:00 PM',
      location: 'Online Event',
      address: 'Zoom Meeting',
      category: 'Education',
      attendees: 85,
      maxAttendees: 100,
      image: '/placeholder.svg',
      organizer: 'Bay Area Islamic Finance Society',
      description: 'Learn about Islamic principles of finance, halal investing, and Sharia-compliant banking options.',
      price: '$20',
      tags: ['Online', 'Finance', 'Educational'],
      featured: false,
    },
    {
      id: 5,
      title: 'Youth Basketball Tournament',
      date: '2024-08-03',
      time: '9:00 AM',
      endTime: '6:00 PM',
      location: 'Oakland Community Center',
      address: '5454 Bancroft Ave, Oakland, CA',
      category: 'Youth',
      attendees: 120,
      maxAttendees: 150,
      image: '/placeholder.svg',
      organizer: 'Muslim Youth of Bay Area',
      description: 'Annual basketball tournament for Muslim youth ages 13-18. Includes awards ceremony and community lunch.',
      price: '$10',
      tags: ['Sports', 'Youth', 'Competition'],
      featured: false,
    },
    {
      id: 6,
      title: 'Charity Gala for Palestine Relief',
      date: '2024-08-10',
      time: '6:00 PM',
      endTime: '10:00 PM',
      location: 'San Jose Convention Center',
      address: '150 W San Carlos St, San Jose, CA',
      category: 'Charity',
      attendees: 200,
      maxAttendees: 400,
      image: '/placeholder.svg',
      organizer: 'Bay Area Palestine Relief Fund',
      description: 'Formal gala dinner with keynote speakers, cultural performances, and silent auction to raise funds for humanitarian aid.',
      price: '$75',
      tags: ['Formal', 'Fundraising', 'Dinner'],
      featured: true,
    },
  ];

  const pastEvents = [
    {
      id: 7,
      title: 'Ramadan Iftar Community Dinner',
      date: '2024-06-15',
      time: '7:30 PM',
      location: 'Fremont Islamic Center',
      attendees: 400,
      category: 'Religious',
      rating: 4.8,
      image: '/placeholder.svg',
    },
    {
      id: 8,
      title: 'Islamic Art & Calligraphy Workshop',
      date: '2024-06-10',
      time: '2:00 PM',
      location: 'South Bay Islamic Association',
      attendees: 35,
      category: 'Education',
      rating: 4.9,
      image: '/placeholder.svg',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Community Events</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search events..."
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

            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Submit Event
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {/* Featured Events */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.filter(event => event.featured).map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gold-500 hover:bg-gold-600">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="sm" variant="secondary" className="p-2">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="p-2">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-xl">{event.title}</h3>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time} - {event.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.attendees} / {event.maxAttendees} attending
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-lg font-semibold text-emerald-600">
                          {event.price}
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          RSVP Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Upcoming Events */}
            <div>
              <h2 className="text-2xl font-bold mb-6">All Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-40 bg-gray-200">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gold-500 hover:bg-gold-600 text-xs">
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/90 text-xs">
                          {event.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{event.title}</h3>
                      
                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-emerald-600">
                          {event.price}
                        </div>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative h-40 bg-gray-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-xs">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees} attended
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 fill-gold-400 text-gold-400 mr-1" />
                        {event.rating}
                      </div>
                      <Button size="sm" variant="outline">
                        View Photos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Event CTA */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-gold-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Organizing an Event?</h3>
            <p className="text-muted-foreground mb-4">
              Share your community event with Muslims across the Bay Area.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Calendar className="mr-2 w-4 h-4" />
              Submit Your Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventsPage;
