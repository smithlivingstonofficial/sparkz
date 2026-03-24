import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Check, Star, Home, Wifi, MapPin, Globe, Music, 
  Gamepad2, ChefHat, Film, Camera, BookOpen, Trophy, 
  Palette, Theater, SlidersHorizontal, ArrowUpRight
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

  // --- 1. DERIVE CATEGORIES AUTOMATICALLY ---
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
        icon: getCategoryIcon(cat)
      }));

      const specialCategories = [
        { id: 'all', label: 'All Events', icon: Home },
        { id: 'featured', label: 'Featured', icon: Star }
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
    { id: 'all', label: 'Any Mode', icon: Globe },
    { id: 'online', label: 'Online', icon: Wifi },
    { id: 'offline', label: 'Offline', icon: MapPin },
  ];

  const getFilteredCount = () => {
    return events.filter(event => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        event.title?.toLowerCase().includes(query) ||
        event.tagline?.toLowerCase().includes(query) ||
        event.club?.toLowerCase().includes(query);

      const matchesCategory = activeCategory === 'all' || 
        (activeCategory === 'featured' && event.featured === true) ||
        event.category?.toLowerCase() === activeCategory;

      const matchesType = eventType === 'all' || 
        event.eventMode?.toLowerCase() === eventType;

      return matchesSearch && matchesCategory && matchesType;
    }).length;
  };

  const handleClearAll = () => {
    setActiveCategory('all');
    setEventType('all');
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showMobileFilter ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileFilter]);

  return (
    <div className="w-full text-white relative">
      
      {/* --- MAIN SEARCH BAR & TRIGGER --- */}
      <div className="relative mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-[#121212] border border-white/10 rounded-2xl placeholder-gray-500 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Mobile Trigger Button (Separate Square Button) */}
        <button 
          onClick={() => setShowMobileFilter(true)}
          className="md:hidden aspect-square h-14 flex items-center justify-center bg-[#121212] border border-white/10 rounded-2xl active:scale-95 transition-all"
        >
          <SlidersHorizontal size={22} className={activeCategory !== 'all' || eventType !== 'all' ? "text-amber-500" : "text-white"} />
        </button>
      </div>

      {/* --- DESKTOP FILTERS --- */}
      <div className="hidden md:block space-y-6 mb-8">
        {/* (Desktop logic remains the same) */}
      </div>
      
      {/* ============================================================
          MOBILE FILTER POPUP (CENTERED)
          ============================================================ */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            {/* 1. Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilter(false)}
              className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
            />

            {/* 2. Centered Popup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, y: "-50%", x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              data-lenis-prevent
              className="fixed top-1/2 left-1/2 z-[9999] w-[90%] max-w-sm max-h-[60vh] flex flex-col bg-[#121212] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden"
            >
              
              {/* --- HEADER --- */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-[#121212]">
                <h2 className="text-lg font-bold text-white">Filter Events</h2>
                <button 
                  onClick={() => setShowMobileFilter(false)} 
                  className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white active:scale-90 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* --- SCROLLABLE BODY --- */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0a0a0a]">
                
                {/* Event Mode */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Event Mode</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {eventTypeOptions.map(({ id, label, icon: Icon }) => {
                      const isActive = eventType === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setEventType(id)}
                          className={`
                            py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all duration-200
                            ${isActive 
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                              : 'bg-[#181818] border-white/5 text-gray-400 hover:bg-[#202020]'
                            }
                          `}
                        >
                          <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                          <span className="text-[10px] font-bold">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(({ id, label, icon: Icon }) => {
                      const isActive = activeCategory === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setActiveCategory(id)}
                          className={`
                            flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200
                            ${isActive
                              ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-900/30'
                              : 'bg-[#181818] border-white/5 text-gray-300 hover:bg-[#202020]'
                            }
                          `}
                        >
                          <div className={`
                            p-1.5 rounded-lg
                            ${isActive ? 'bg-black/10' : 'bg-black/30 text-gray-500'}
                          `}>
                             {Icon && <Icon size={16} />}
                          </div>
                          <span className="text-xs font-bold truncate">{label}</span>
                          {isActive && <Check size={14} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* --- FOOTER --- */}
              <div className="p-4 bg-[#121212] border-t border-white/10">
                <div className="flex gap-3">
                  <button 
                    onClick={handleClearAll}
                    className="flex-1 py-3 rounded-xl text-xs font-bold text-gray-400 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  >
                    Apply ({getFilteredCount()})
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default EventsSearchAndFilter;