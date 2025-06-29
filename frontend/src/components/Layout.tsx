
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Directory', href: '/directory', icon: Search },
    { name: 'Prayer Spaces', href: '/prayer-spaces', icon: MapPin },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Support', href: '/support', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-gold-600 bg-clip-text text-transparent">
                Bay Area Muslim Hub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Join Community
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Join Community
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="font-bold text-lg">Bay Area Muslim Hub</span>
              </div>
              <p className="text-navy-300 text-sm">
                Connecting and supporting Muslim-owned businesses and communities across the San Francisco Bay Area.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Directory</h3>
              <ul className="space-y-2 text-sm text-navy-300">
                <li><Link to="/directory" className="hover:text-white transition-colors">Browse Businesses</Link></li>
                <li><Link to="/prayer-spaces" className="hover:text-white transition-colors">Prayer Spaces</Link></li>
                <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-navy-300">
                <li><Link to="/support" className="hover:text-white transition-colors">Support Local</Link></li>
                <li><Link to="/submit-business" className="hover:text-white transition-colors">Add Your Business</Link></li>
                <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-navy-300">
                <li>hello@bayareamuslimhub.com</li>
                <li>San Francisco Bay Area</li>
                <li className="pt-2">
                  <div className="flex space-x-3">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Facebook</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-800 mt-8 pt-8 text-center text-sm text-navy-400">
            <p>&copy; 2024 Bay Area Muslim Hub. Made with ❤️ for the community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
