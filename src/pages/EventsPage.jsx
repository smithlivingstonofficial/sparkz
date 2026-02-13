import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Film, Home, Music, Gamepad2, ChefHat, Globe, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion'; // Fixed motion import
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

import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState('all');
  const [eventType, setEventType] = useState('all'); // 'all', 'online', 'offline'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'day_asc', 'title_asc'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedEvents = useMemo(() => {
    // 1. First, apply Filters
    let result = eventsData.filter(event => {
      // Category Filter
      const matchesCategory = activeCategory === 'all' ||
        (activeCategory === 'featured' ? event.featured : event.category?.toLowerCase() === activeCategory);

      // Search Filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(query) ||
        event.tagline?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query);

      // Event Mode Filter (Online/Offline)
      const matchesMode = eventType === 'all' || 
        event.eventMode?.toLowerCase() === eventType.toLowerCase();

      return matchesCategory && matchesSearch && matchesMode;
    });

    // 2. Then, apply Sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured === a.featured) ? 0 : b.featured ? 1 : -1;
        case 'day_asc':
          return a.day.localeCompare(b.day); // Sorts Day 1 before Day 2
        case 'title_asc':
          return a.title.localeCompare(b.title); // A-Z
        case 'date_asc':
          return a.date.localeCompare(b.date);
        default:
          return 0;
      }
    });
  }, [activeCategory, searchQuery, eventType, sortBy]);

  // --- CATEGORY GENERATION ---
  const categories = useMemo(() => {
    const counts = {};
    eventsData.forEach(event => {
      const cat = event.category?.toLowerCase() || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', label: 'All Events', icon: Home, count: eventsData.length },
      { id: 'featured', label: 'Featured', icon: Star, count: eventsData.filter(e => e.featured).length },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: counts[cat]
      }))
    ];
  }, []);

  // Helper for Category Icons (Used by Modal)
  const getCategoryIcon = (category) => {
    const iconMap = { dance: Music, gaming: Gamepad2, cooking: ChefHat, tourism: Globe, all: Home };
    return iconMap[category?.toLowerCase()] || Film;
  };

  // --- HANDLERS ---
  const clearSearch = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setEventType('all');
    setSortBy('featured');
  };

  const handleRegister = async (event) => {
    if (!user) {
      alert("Please login to register for events");
      navigate('/auth');
      return;
    }
    // ... your registration logic
    alert(`Registering for ${event.title}... Check console for API mock.`);
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-black cinematic-intro overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.2) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="pt-20 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Updated Search and Filter Component */}
          <div className="mb-10">
            <EventsSearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              eventType={eventType}
              setEventType={setEventType}
              events={eventsData}
            />
          </div>

          {/* Results Counter UI */}
          {(searchQuery || activeCategory !== 'all' || eventType !== 'all') && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="flex items-center justify-between p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl backdrop-blur-md">
                <span className="text-amber-200 text-sm">
                  Showing <b>{filteredAndSortedEvents.length}</b> events matching your filters
                </span>
                <button onClick={clearSearch} className="text-xs text-amber-500 hover:underline">Clear All</button>
              </div>
            </motion.div>
          )}

          {/* Events Grid */}
          <EventsGrid
            filteredEvents={filteredAndSortedEvents}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            setSelectedEvent={setSelectedEvent}
            isMobile={isMobile}
            getCategoryIcon={getCategoryIcon}
            searchQuery={searchQuery}
            clearSearch={clearSearch}
          />

          {/* No Results Message */}
          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center py-20">
              <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No results found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              <button onClick={clearSearch} className="mt-6 px-6 py-2 bg-amber-600 rounded-full text-sm font-bold">Reset All Filters</button>
            </div>
          )}
        </div>
      </div>

      <ActionButtons isMobile={isMobile} />

      <AnimatePresence mode="wait">
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            getCategoryIcon={getCategoryIcon}
            onRegister={() => handleRegister(selectedEvent)}
          />
        )}
      </AnimatePresence>

      <footer className="relative z-10 w-full bg-black/90 border-t border-white/10 p-8 text-center">
         <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
            Sparkz 2K26 • Cinematic Excellence • {filteredAndSortedEvents.length} Results
         </p>
      </footer>
    </div>
  );
};

export default EventsPage;