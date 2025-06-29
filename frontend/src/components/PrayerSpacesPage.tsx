
import React, { useState } from 'react';
import { MapPin, Clock, Users, Filter, Star, Phone, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const PrayerSpacesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
    { id: 'jummah', label: 'Jumu\'ah Prayer', checked: false },
    { id: 'women-section', label: 'Women\'s Section', checked: false },
    { id: 'parking', label: 'Parking Available', checked: false },
    { id: 'wheelchair', label: 'Wheelchair Accessible', checked: false },
    { id: 'childcare', label: 'Childcare Services', checked: false },
    { id: 'classes', label: 'Islamic Classes', checked: false },
  ];

  const prayerSpaces = [
    {
      id: 1,
      name: 'Islamic Center of San Francisco',
      type: 'Masjid',
      address: '20 Jones St, San Francisco, CA 94102',
      phone: '(415) 552-8831',
      website: 'icsfmasjid.org',
      rating: 4.8,
      reviews: 156,
      image: '/placeholder.svg',
      features: ['Jumu\'ah Prayer', 'Women\'s Section', 'Parking', 'Classes'],
      capacity: 500,
      description: 'Historic mosque serving the San Francisco Muslim community since 1955.',
      prayerTimes: {
        fajr: '5:30 AM',
        dhuhr: '1:15 PM',
        asr: '4:45 PM',
        maghrib: '7:20 PM',
        isha: '8:45 PM',
        jummah: '1:30 PM'
      },
    },
    {
      id: 2,
      name: 'South Bay Islamic Association',
      type: 'Masjid',
      address: '325 N 3rd St, San Jose, CA 95112',
      phone: '(408) 947-9447',
      website: 'sbia.us',
      rating: 4.7,
      reviews: 203,
      image: '/placeholder.svg',
      features: ['Jumu\'ah Prayer', 'Women\'s Section', 'Childcare', 'Classes', 'Parking'],
      capacity: 800,
      description: 'Large community center with extensive programs for all ages.',
      prayerTimes: {
        fajr: '5:25 AM',
        dhuhr: '1:10 PM',
        asr: '4:40 PM',
        maghrib: '7:15 PM',
        isha: '8:40 PM',
        jummah: '1:15 PM'
      },
    },
    {
      id: 3,
      name: 'Islamic Society of East Bay',
      type: 'Masjid',
      address: '32431 Alvarado-Niles Rd, Union City, CA 94587',
      phone: '(510) 471-1222',
      website: 'iseb.org',
      rating: 4.6,
      reviews: 134,
      image: '/placeholder.svg',
      features: ['Jumu\'ah Prayer', 'Women\'s Section', 'Parking', 'Wheelchair Accessible'],
      capacity: 400,
      description: 'Welcoming community mosque serving the East Bay area.',
      prayerTimes: {
        fajr: '5:35 AM',
        dhuhr: '1:20 PM',
        asr: '4:50 PM',
        maghrib: '7:25 PM',
        isha: '8:50 PM',
        jummah: '1:30 PM'
      },
    },
    {
      id: 4,
      name: 'Masjid Al-Noor',
      type: 'Masjid',
      address: '5855 Christie Ave, Emeryville, CA 94608',
      phone: '(510) 655-4420',
      website: 'masjidalnoorbay.org',
      rating: 4.9,
      reviews: 87,
      image: '/placeholder.svg',
      features: ['Jumu\'ah Prayer', 'Women\'s Section', 'Classes', 'Parking'],
      capacity: 300,
      description: 'Beautiful mosque with active community programs and education.',
      prayerTimes: {
        fajr: '5:30 AM',
        dhuhr: '1:15 PM',
        asr: '4:45 PM',
        maghrib: '7:20 PM',
        isha: '8:45 PM',
        jummah: '1:20 PM'
      },
    },
    {
      id: 5,
      name: 'Stanford University Prayer Room',
      type: 'Prayer Room',
      address: '450 Serra Mall, Stanford, CA 94305',
      phone: '(650) 723-2091',
      website: 'stanford.edu/msa',
      rating: 4.4,
      reviews: 45,
      image: '/placeholder.svg',
      features: ['Interfaith Space', 'Student Access'],
      capacity: 50,
      description: 'Multi-faith prayer space available to students and visitors.',
      prayerTimes: {
        note: 'Open 24/7 for individual prayer'
      },
    },
    {
      id: 6,
      name: 'Fremont Islamic Center',
      type: 'Masjid',
      address: '41590 Paseo Padre Pkwy, Fremont, CA 94539',
      phone: '(510) 656-9632',
      website: 'fremontislamiccenter.org',
      rating: 4.5,
      reviews: 112,
      image: '/placeholder.svg',
      features: ['Jumu\'ah Prayer', 'Women\'s Section', 'Childcare', 'Parking'],
      capacity: 600,
      description: 'Active community center with youth programs and social services.',
      prayerTimes: {
        fajr: '5:40 AM',
        dhuhr: '1:25 PM',
        asr: '4:55 PM',
        maghrib: '7:30 PM',
        isha: '8:55 PM',
        jummah: '1:30 PM'
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Prayer Spaces</h1>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search prayer spaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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
                <h3 className="font-semibold mb-3">Facilities & Services</h3>
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
            Showing {prayerSpaces.length} prayer spaces
          </p>
          <Select defaultValue="distance">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Sort by Distance</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="capacity">Largest Capacity</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prayerSpaces.map((space) => (
            <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {space.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-white/90 px-2 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400 mr-1" />
                    {space.rating}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-xl mb-2">{space.name}</h3>
                  <p className="text-muted-foreground flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {space.address}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{space.description}</p>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {space.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prayer Times */}
                {space.prayerTimes.fajr && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Today's Prayer Times
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>Fajr: {space.prayerTimes.fajr}</div>
                      <div>Dhuhr: {space.prayerTimes.dhuhr}</div>
                      <div>Asr: {space.prayerTimes.asr}</div>
                      <div>Maghrib: {space.prayerTimes.maghrib}</div>
                      <div>Isha: {space.prayerTimes.isha}</div>
                      <div className="font-medium text-emerald-600">
                        Jumu'ah: {space.prayerTimes.jummah}
                      </div>
                    </div>
                  </div>
                )}

                {space.prayerTimes.note && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {space.prayerTimes.note}
                    </p>
                  </div>
                )}

                {/* Capacity and Contact */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Capacity: {space.capacity}
                    <span className="ml-4">{space.reviews} reviews</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Prayer Space CTA */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-gold-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Know of a Prayer Space We're Missing?</h3>
            <p className="text-muted-foreground mb-4">
              Help us build the most comprehensive directory of prayer spaces in the Bay Area.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Calendar className="mr-2 w-4 h-4" />
              Suggest a Prayer Space
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerSpacesPage;
