import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronDown, Check, Star, Calendar, 
  SortAsc, TrendingUp, Home, Wifi, MapPin, Globe
} from 'lucide-react';

const EventsSearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  sortBy,         // ADDED: Current sort state from parent
  setSortBy,      // ADDED: Function to update sort state in parent
  eventType,      // ADDED: Current event type filter (all, online, offline)
  setEventType,   // ADDED: Function to update event type
  events = [],
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState([]);

  // --- DERIVE CATEGORIES FROM EVENTS ---
  useEffect(() => {
    if (events && events.length > 0) {
      const categoryMap = new Map();
      events.forEach(event => {
        const cat = event.category?.toLowerCase() || 'other';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });

      const uniqueCategories = Array.from(categoryMap.keys()).map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: categoryMap.get(cat)
      }));

      const specialCategories = [
        { id: 'all', label: 'All Events', count: events.length, icon: Home },
        { id: 'featured', label: 'Featured', count: events.filter(e => e.featured).length, icon: Star }
      ];
      
      setCategories([...specialCategories, ...uniqueCategories]);
    }
  }, [events]);

  // --- FILTER & SORT OPTIONS ---
  const sortOptions = [
    { id: 'featured', label: 'Featured First', icon: Star },
    { id: 'day1', label: 'Day 1', icon: Calendar },
    { id: 'day2', label: 'Day 2', icon: Calendar },
    { id: 'name_asc', label: 'Name (A-Z)', icon: SortAsc },
    { id: 'popularity', label: 'Popularity', icon: TrendingUp },
  ];
  
  const eventTypeOptions = [
    { id: 'all', label: 'All Types', icon: Globe },
    { id: 'online', label: 'Online', icon: Wifi },
    { id: 'offline', label: 'Offline', icon: MapPin },
  ];

  const handleClearAll = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('featured');
    setEventType('all'); // Reset event type filter
  };

  const getActiveLabel = (options, activeId) => options.find(opt => opt.id === activeId)?.label || '';

  return (
    <div className="w-full text-white">
      {/* --- MAIN SEARCH BAR --- */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search for events, artists, or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10"><X size={16} /></button>
        )}
      </div>

      {/* --- DESKTOP FILTERS --- */}
      <div className="hidden md:block space-y-6 mb-8">
        {/* Event Type Filter */}
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-400 w-24">Type:</h3>
          <div className="flex flex-wrap gap-2">
            {eventTypeOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setEventType(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 border ${
                  eventType === id 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-400 w-24">Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2 border ${
                  activeCategory === id 
                    ? 'bg-amber-500 text-black border-amber-500' 
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
      
      {/* --- MOBILE FILTER BUTTON & DESKTOP SORT --- */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <button 
          onClick={() => setShowMobileFilter(true)}
          className="w-full md:hidden flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-lg"
        >
          <Filter size={16} className="text-amber-400" />
          Filter & Sort
        </button>

        <div className="hidden md:block relative ml-auto">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
              <span className="text-sm text-gray-400">Sort by:</span>
              <span className="font-semibold">{getActiveLabel(sortOptions, sortBy)}</span>
              <ChevronDown size={16} />
            </Menu.Button>
            <AnimatePresence>
              <Menu.Items as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 focus:outline-none p-2"
              >
                {sortOptions.map(({ id, label, icon: Icon }) => (
                  <Menu.Item key={id}>
                    {({ active }) => (
                      <button
                        onClick={() => setSortBy(id)}
                        className={`w-full text-left px-4 py-2 rounded-md text-sm flex items-center gap-3 transition-colors ${
                          active ? 'bg-amber-500/20 text-amber-300' : 'text-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                        {sortBy === id && <Check size={16} className="ml-auto text-amber-400" />}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </AnimatePresence>
          </Menu>
        </div>
      </div>
      
      {/* --- ACTIVE FILTERS DISPLAY --- */}
      {(searchQuery || activeCategory !== 'all' || sortBy !== 'featured' || eventType !== 'all') && (
        <div className="mb-8 flex flex-wrap items-center gap-3 p-4 bg-black/50 backdrop-blur-md rounded-lg border border-white/5">
          <span className="text-sm font-semibold text-gray-400">Active:</span>
          {searchQuery && <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Search: "{searchQuery}"</span>}
          {eventType !== 'all' && <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Type: {getActiveLabel(eventTypeOptions, eventType)}</span>}
          {activeCategory !== 'all' && <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Category: {getActiveLabel(categories, activeCategory)}</span>}
          {sortBy !== 'featured' && <span className="px-3 py-1 bg-white/10 rounded-full text-xs">Sort: {getActiveLabel(sortOptions, sortBy)}</span>}
          <button onClick={handleClearAll} className="ml-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
            <X size={14} /> Clear All
          </button>
        </div>
      )}

      {/* --- MOBILE FILTER & SORT MODAL --- */}
      <AnimatePresence>
        {showMobileFilter && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-xl p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filter & Sort</h2>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 rounded-full hover:bg-white/10"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8">
              {/* Event Type */}
              <div>
                <h3 className="font-semibold mb-4">Event Type</h3>
                <div className="flex flex-wrap gap-2">
                  {eventTypeOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setEventType(id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 border transition-colors ${
                        eventType === id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white/5 text-gray-300 border-white/10'
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 border transition-colors ${
                        activeCategory === id ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-gray-300 border-white/10'
                      }`}
                    >
                      {Icon && <Icon size={14} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold mb-4">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSortBy(id)}
                      className={`w-full p-4 rounded-lg flex items-center justify-between transition-colors ${
                        sortBy === id ? 'bg-amber-500/20' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={sortBy === id ? 'text-amber-400' : ''} />
                        <span className={sortBy === id ? 'text-amber-300' : ''}>{label}</span>
                      </div>
                      {sortBy === id && <Check size={20} className="text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full mt-6 py-4 bg-amber-500 text-black font-bold rounded-lg"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dummy Menu component for headless UI compatibility
const Menu = ({ as: Component = 'div', children }) => <Component>{children}</Component>;
Menu.Button = ({ children, ...props }) => <button {...props}>{children}</button>;
Menu.Items = ({ children, ...props }) => <div {...props}>{children}</div>;
Menu.Item = ({ children }) => <div>{children}</div>;

export default EventsSearchAndFilter;