import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Film, Home, Music, Gamepad2, ChefHat, Globe, Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import eventsData from '../assets/data/events.json';

// Import components
import {
  EventsSearchAndFilter,
  EventsGrid,
  EventModal,
  ComingSoon,
  ActionButtons
} from '../features/events';

gsap.registerPlugin(ScrollTrigger);

import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const sectionRef = useRef(null);
  const heroRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'dance': Music,
      'gaming': Gamepad2,
      'cooking': ChefHat,
      'tourism': Globe,
      'all': Home,
      'default': Film
    };
    return iconMap[category?.toLowerCase()] || iconMap.default;
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      'dance': 'from-purple-600 to-pink-600',
      'gaming': 'from-green-600 to-emerald-600',
      'cooking': 'from-yellow-600 to-orange-600',
      'tourism': 'from-blue-600 to-cyan-600',
      'all': 'from-gray-600 to-gray-800',
      'default': 'from-amber-600 to-red-600'
    };
    return colorMap[category?.toLowerCase()] || colorMap.default;
  };

  // Generate categories from events data
  const categories = useMemo(() => {
    if (!eventsData || eventsData.length === 0) return [];

    // Count events per category
    const categoryCounts = {};
    eventsData.forEach(event => {
      const cat = event.category?.toLowerCase() || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Convert to array
    const categoryArray = Object.keys(categoryCounts).map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: getCategoryIcon(cat),
      gradient: getCategoryColor(cat),
      color: getCategoryColor(cat),
      count: categoryCounts[cat]
    }));

    // Sort by count (descending)
    categoryArray.sort((a, b) => b.count - a.count);

    // Add "All" category
    const allCategory = {
      id: 'all',
      label: 'All Events',
      icon: Home,
      gradient: 'from-amber-600 to-red-600',
      color: 'from-amber-600 to-red-600',
      count: eventsData.length
    };

    return [allCategory, ...categoryArray];
  }, [eventsData]);

  // Filter events based on category and search
  const updateFilteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      // Filter by category
      const matchesCategory = activeCategory === 'all' ||
        event.category?.toLowerCase() === activeCategory;

      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [eventsData, activeCategory, searchQuery]);

  // Update filtered events when dependencies change
  useEffect(() => {
    setFilteredEvents(updateFilteredEvents);
  }, [updateFilteredEvents]);

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic intro animation
      gsap.from('.cinematic-intro', {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: 'power3.out',
      });

      // Hero section animation
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out'
        });
      }

      // Staggered animation for cards
      gsap.from('.event-card', {
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Floating animation for featured cards
      gsap.to('.featured-card', {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      });

      // Background particles animation
      gsap.to('.particle', {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Reset hover state when category changes
    setHoveredCard(null);
  };

  // Handle search change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Reset hover state when search changes
    setHoveredCard(null);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setHoveredCard(null);
  };

  const handleRegister = async (event) => {
    if (!user) {
      alert("Please login to register for events");
      navigate('/auth');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://sparkz-server.onrender.com';
      const res = await fetch(`${API_URL}/event/normal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: user,
          name: event.title, // Assuming event has a title
          eventDetails: event
        })
      });

      if (res.ok) {
        alert("Registration successful! Check your email for the QR code.");
      } else {
        const errorData = await res.json();
        alert(`Registration failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  // Get featured events count
  const featuredEventsCount = useMemo(() => {
    return eventsData.filter(event => event.featured).length;
  }, [eventsData]);

  // Get total events count
  const totalEvents = eventsData.length;

  return (
    <div ref={sectionRef} className="min-h-screen bg-black cinematic-intro overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#dc2626' : '#ffffff',
              opacity: Math.random() * 0.1 + 0.05,
            }}
          />
        ))}
      </div>

      {/* Light Rays */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-400/20 via-transparent to-transparent blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-red-400/20 via-transparent to-transparent blur-2xl"></div>
      </div>

      {/* Page Header - Sticky */}
      

      {/* Main Content */}
      <div className="pt-20 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          {/* <div className="mb-8 md:mb-12">
            <div ref={heroRef}>
              <EventsHero isMobile={isMobile} />
            </div>
          </div> */}

          {/* Search and Filter */}
          <div className="mb-10 md:mb-12">
            <EventsSearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryChange}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              events={eventsData}
              isMobile={isMobile}
              clearSearch={clearSearch}
            />
          </div>

          {/* Results Summary */}
          {(searchQuery || activeCategory !== 'all') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-900/20 to-red-900/20 backdrop-blur-sm rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-600/30 to-red-600/30 rounded-lg">
                    <Film className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      Showing <span className="font-bold text-amber-400">{filteredEvents.length}</span> of {totalEvents} events
                    </div>
                    {activeCategory !== 'all' && (
                      <div className="text-sm text-amber-200">
                        Filtered by: <span className="font-bold">{categories.find(c => c.id === activeCategory)?.label}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600/20 to-amber-600/20 hover:from-red-600/30 hover:to-amber-600/30 backdrop-blur-sm rounded-lg border border-red-500/30 hover:border-amber-500/50 transition-all"
                >
                  <span className="text-white text-sm">Clear Filters</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Events Grid */}
          <EventsGrid
            filteredEvents={filteredEvents}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            setSelectedEvent={setSelectedEvent}
            isMobile={isMobile}
            getCategoryIcon={getCategoryIcon}
            searchQuery={searchQuery}
            clearSearch={clearSearch}
          />

          {/* Coming Soon Section */}
          {filteredEvents.length > 0 && filteredEvents.length < totalEvents && (
            <div className="mt-16 md:mt-20">
              <ComingSoon isMobile={isMobile} />
            </div>
          )}

          {/* No Results Message */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16 md:py-24">
              <div className="inline-block p-6 bg-gradient-to-r from-amber-900/20 to-red-900/20 backdrop-blur-sm rounded-2xl border border-amber-500/30">
                <Film className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No events match "${searchQuery}". Try a different search term.`
                    : 'No events match your current filters. Try selecting a different category.'}
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-lg hover:from-amber-700 hover:to-red-700 transition-all"
                >
                  Clear Filters & Show All Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons isMobile={isMobile} />

      {/* Event Modal */}
      <AnimatePresence mode="wait">
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={handleModalClose}
            getCategoryIcon={getCategoryIcon}
            onRegister={() => handleRegister(selectedEvent)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-black/95 backdrop-blur-sm text-center p-6 text-xs text-white/20 font-mono border-t border-white/10">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span>NOW SHOWING • {filteredEvents.length} EVENTS</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div className="text-white/40 text-xs">
            SPARKZ 2026 // CINEMA REEL // TOTAL {totalEvents} PREMIERES
          </div>
          <div className="text-white/30 text-[10px] mt-1">
            © KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f59e0b, #dc2626);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #d97706, #b91c1c);
        }
        
        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
      `}</style>
    </div>
  );
};

// Add missing motion component
const motion = {
  div: ({ children, className, initial, animate, transition }) => (
    <div className={className}>{children}</div>
  )
};

export default EventsPage;