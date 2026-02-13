import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Check, Star, Calendar, 
  Home, Wifi, MapPin, Globe, Music, 
  Gamepad2, ChefHat, Film, Camera, BookOpen, Trophy, 
  Palette, Theater
} from 'lucide-react';

const EventsSearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  eventType,
  setEventType,
  events = [],
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState([]);

  // --- 1. DERIVE CATEGORIES FROM EVENTS ---
  useEffect(() => {
    if (events) {
      const categoryMap = new Map();
      
      events.forEach(event => {
        const cat = event.category?.toLowerCase() || 'other';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const uniqueCategories = Array.from(categoryMap.keys()).map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: categoryMap.get(cat),
        icon: getCategoryIcon(cat)
      }));

      // Ensure "All Events" and "Featured" are always present
      const specialCategories = [
        { id: 'all', label: 'All Events', count: events.length, icon: Home },
        { id: 'featured', label: 'Featured', count: events.filter(e => e.featured).length, icon: Star }
      ];
      
      setCategories([...specialCategories, ...uniqueCategories]);
    }
  }, [events]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'music': return Music;
      case 'dance': return Music;
      case 'gaming': return Gamepad2;
      case 'cooking': return ChefHat;
      case 'film': return Film;
      case 'photography': return Camera;
      case 'literary': return BookOpen;
      case 'sports': return Trophy;
      case 'arts': return Palette;
      case 'drama': return Theater;
      default: return Star;
    }
  };

  const eventTypeOptions = [
    { id: 'all', label: 'All Modes', icon: Globe },
    { id: 'online', label: 'Online', icon: Wifi },
    { id: 'offline', label: 'Offline', icon: MapPin },
  ];

  const getFilteredCount = () => {
    return events.filter(event => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        event.title?.toLowerCase().includes(query) ||
        event.tagline?.toLowerCase().includes(query) ||
        event.club?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query);

      const matchesCategory = activeCategory === 'all' || 
        (activeCategory === 'featured' && event.featured === true) ||
        event.category?.toLowerCase() === activeCategory;

      const matchesType = eventType === 'all' || 
        event.eventMode?.toLowerCase() === eventType;

      return matchesSearch && matchesCategory && matchesType;
    }).length;
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setEventType('all');
  };

  const getActiveLabel = (options, activeId) => options.find(opt => opt.id === activeId)?.label || '';

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileFilter]);

  return (
    <div className="w-full text-white">
      {/* --- MAIN SEARCH BAR --- */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search events, clubs, or taglines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10"><X size={16} /></button>
        )}
      </div>

      {/* --- DESKTOP FILTERS (Hidden on Mobile) --- */}
      <div className="hidden md:block space-y-6 mb-8">
        {/* Row 1: Mode Selection */}
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-400 w-16">Mode:</h3>
          <div className="flex flex-wrap gap-2">
            {eventTypeOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setEventType(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 border ${
                  eventType === id 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Categories */}
        <div className="flex items-start gap-4">
          <h3 className="text-sm font-semibold text-gray-400 w-16 pt-2">Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 border ${
                  activeCategory === id 
                    ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {Icon && <Icon size={14} />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* --- MOBILE FILTER BUTTON & HEADER --- */}
      <div className="flex justify-between items-center gap-4 mb-6 md:hidden">
        <button 
          onClick={() => setShowMobileFilter(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 active:scale-95 transition-all"
        >
          <Filter size={18} className="text-amber-500" />
          Filter Events
        </button>
        <div className="px-4 py-3 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-400 whitespace-nowrap">
          <span className="text-amber-500 font-bold text-sm">{getFilteredCount()}</span> Results
        </div>
      </div>
      
      {/* --- ACTIVE FILTERS BAR (Desktop & Mobile Preview) --- */}
      {(searchQuery || activeCategory !== 'all' || eventType !== 'all') && (
        <div className="mb-8 flex flex-wrap items-center gap-3 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/5">
          <span className="text-sm font-semibold text-gray-400">Active:</span>
          {searchQuery && <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10">Search: "{searchQuery}"</span>}
          {eventType !== 'all' && <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30">Mode: {getActiveLabel(eventTypeOptions, eventType)}</span>}
          {activeCategory !== 'all' && <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30">{getActiveLabel(categories, activeCategory)}</span>}
          <button onClick={handleClearAll} className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
            <X size={14} /> Reset
          </button>
        </div>
      )}

      {/* --- MOBILE FILTER MODAL (Full Screen) --- */}
      <AnimatePresence>
        {showMobileFilter && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col top-15"
          >
            {/* 1. Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#0a0a0a]">
              <h2 className="text-xl font-bold font-mono tracking-wider text-white">FILTER</h2>
              <button 
                onClick={() => setShowMobileFilter(false)} 
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 2. Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide pb-32">
              
              {/* Event Mode Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Event Mode</h3>
                <div className="grid grid-cols-3 gap-3">
                  {eventTypeOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setEventType(id)}
                      className={`py-3.5 px-2 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all duration-200 ${
                        eventType === id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                          : 'bg-[#111] border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-[11px] font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Section - GRID LAYOUT */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`
                        relative group flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all duration-200
                        ${activeCategory === id
                          ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-900/40'
                          : 'bg-[#111] border-white/5 text-gray-300 hover:bg-white/5'
                        }
                      `}
                    >
                      <div className={`${activeCategory === id ? 'text-black' : 'text-gray-500 group-hover:text-amber-500'} transition-colors`}>
                         {Icon && <Icon size={18} />}
                      </div>
                      <span className="text-sm font-bold truncate">{label}</span>
                      
                      {/* Optional Checkmark for active state */}
                      {activeCategory === id && (
                        <div className="absolute top-2 right-2 opacity-50">
                           <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Modal Footer (Fixed Bottom) */}
            <div className="absolute bottom-25 left-0 right-0 p-5 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
              <div className="flex gap-4">
                <button 
                  onClick={handleClearAll}
                  className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 hover:text-white bg-white/5 border border-white/5 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="flex-[2] py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-transform"
                >
                  Show {getFilteredCount()} Results
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsSearchAndFilter;