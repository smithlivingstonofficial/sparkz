import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, ChevronDown, ChevronUp, 
  Music, Theater, Palette, BookOpen, Camera,
  Video, Film, Trophy, Gamepad2, Utensils, Globe,
  ChefHat, Users, Award, Check, Sparkles, 
  Calendar, Clock, TrendingUp, Zap, Star, Home
} from 'lucide-react';

const EventsSearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showFilter,
  setShowFilter,
  events = [], // Pass events data to extract categories
  isMobile,
  clearSearch
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [categories, setCategories] = useState([]);
  const [eventCount, setEventCount] = useState(0);

  // Extract unique categories from events data
  useEffect(() => {
    if (events && events.length > 0) {
      const categoryMap = {};
      
      // Count events per category
      events.forEach(event => {
        const category = event.category?.toLowerCase() || 'other';
        if (!categoryMap[category]) {
          categoryMap[category] = {
            id: category,
            name: category,
            count: 0,
            events: []
          };
        }
        categoryMap[category].count += 1;
        categoryMap[category].events.push(event);
      });

      // Convert to array and sort by count
      const categoryArray = Object.values(categoryMap);
      categoryArray.sort((a, b) => b.count - a.count);
      
      // Add "All" category at the beginning
      const allCategory = {
        id: 'all',
        name: 'All',
        label: 'All Events',
        count: events.length,
        icon: Home,
        color: 'from-gray-600 to-gray-800'
      };
      
      setCategories([allCategory, ...categoryArray.map(cat => ({
        ...cat,
        label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        ...getCategoryProperties(cat.name)
      }))]);
      
      setEventCount(events.length);
    }
  }, [events]);

  // Get icon, color, and gradient for each category
  const getCategoryProperties = (categoryName) => {
    const category = categoryName.toLowerCase();
    
    const properties = {
      // Existing categories from your JSON
      dance: {
        icon: Music,
        gradient: 'from-purple-600 to-pink-600',
        color: 'purple',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      },
      gaming: {
        icon: Gamepad2,
        gradient: 'from-green-600 to-emerald-600',
        color: 'green',
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30'
      },
      cooking: {
        icon: ChefHat,
        gradient: 'from-yellow-600 to-orange-600',
        color: 'yellow',
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30'
      },
      tourism: {
        icon: Globe,
        gradient: 'from-blue-600 to-cyan-600',
        color: 'blue',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      },
      // Additional common categories
      music: {
        icon: Music,
        gradient: 'from-purple-600 to-pink-600',
        color: 'purple',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      },
      drama: {
        icon: Theater,
        gradient: 'from-red-600 to-rose-600',
        color: 'red',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30'
      },
      arts: {
        icon: Palette,
        gradient: 'from-green-600 to-emerald-600',
        color: 'green',
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30'
      },
      literary: {
        icon: BookOpen,
        gradient: 'from-blue-600 to-cyan-600',
        color: 'blue',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      },
      photo: {
        icon: Camera,
        gradient: 'from-cyan-600 to-teal-600',
        color: 'cyan',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30'
      },
      film: {
        icon: Film,
        gradient: 'from-amber-600 to-orange-600',
        color: 'amber',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30'
      },
      sports: {
        icon: Trophy,
        gradient: 'from-orange-600 to-red-600',
        color: 'orange',
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30'
      },
      // Default for unknown categories
      default: {
        icon: Star,
        gradient: 'from-gray-600 to-gray-800',
        color: 'gray',
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/30'
      }
    };

    return properties[category] || properties.default;
  };

  // Sort options
  const sortOptions = [
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'name', label: 'Name (A-Z)', icon: BookOpen },
    { id: 'popularity', label: 'Most Popular', icon: TrendingUp },
  ];

  // Animation variants
  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const chipVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Handle search with debouncing
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  // Get filtered event count
  const getFilteredEventCount = () => {
    if (!events) return 0;
    
    let filtered = events;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.tagline.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === activeCategory
      );
    }
    
    return filtered.length;
  };

  return (
    <div className="w-full">
      {/* Results Counter - Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm rounded-lg border border-amber-500/30">
              <span className="text-amber-300 text-sm font-medium">
                Showing <span className="font-bold text-white">{getFilteredEventCount()}</span> of {eventCount} Events
              </span>
            </div>
            
            {(searchQuery || activeCategory !== 'all') && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-sm rounded-lg border border-red-500/30 hover:border-amber-500/50 transition-all hover:scale-105"
              >
                <X className="w-3 h-3 text-red-400" />
                <span className="text-white text-sm">Clear All</span>
              </motion.button>
            )}
          </div>

          {/* Sort Options */}
          <div className="relative">
            {/* <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all"
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm">
                Sort: {sortOptions.find(s => s.id === sortBy)?.label}
              </span>
              {showSortOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button> */}

            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-800 shadow-2xl z-50"
                >
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortOptions(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-all ${
                          sortBy === option.id ? 'bg-amber-900/20 text-amber-400' : 'text-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-sm">{option.label}</span>
                        {sortBy === option.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Main Search Bar - Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400/60" size={20} />
              <input
                type="text"
                placeholder="Search events by name, category, or description..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-12 py-4 bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition-all"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter Chips - Desktop */}
      {!isMobile && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Browse by Category
            </h3>
            <div className="text-gray-400 text-sm">
              {categories.length - 1} categories available
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon || Star;
              const isActive = activeCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  variants={chipVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative group px-5 py-3 rounded-full border transition-all duration-300 flex items-center gap-3 ${
                    isActive
                      ? `bg-gradient-to-r ${category.gradient} text-white border-transparent shadow-2xl`
                      : 'bg-black/40 backdrop-blur-sm text-gray-300 border-gray-700 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-red-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon */}
                  <div className={`p-2 rounded-full ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  </div>

                  {/* Label */}
                  <span className="font-medium text-sm md:text-base">
                    {category.label}
                  </span>

                  {/* Count */}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-800/50 text-gray-400 group-hover:text-white'
                  }`}>
                    {category.count}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-red-500/30 rounded-full -z-10"
                    />
                  )}

                  {/* Pulse effect for active */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-red-500/10 rounded-full animate-ping"></div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400/60" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-10 py-3 bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-800/50 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Results Counter and Filter Button */}
          <div className="flex items-center justify-between">
            {/* Results Counter */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm rounded-lg border border-amber-500/30">
                <span className="text-amber-300 text-xs font-medium">
                  {getFilteredEventCount()} Events
                </span>
              </div>
              
              {(searchQuery || activeCategory !== 'all') && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-sm rounded-lg border border-red-500/30 hover:border-amber-500/50"
                >
                  <X className="w-3 h-3 text-red-400" />
                  <span className="text-white text-xs">Clear</span>
                </motion.button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all"
            >
              <Filter className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm">Filter</span>
              {showMobileFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Category Display */}
          {activeCategory !== 'all' && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-3 bg-gradient-to-r from-amber-900/30 to-red-900/30 backdrop-blur-sm rounded-xl border border-amber-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    {(() => {
                      const category = categories.find(c => c.id === activeCategory);
                      const Icon = category?.icon || Star;
                      return <Icon className="w-4 h-4 text-amber-400" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Active Filter</div>
                    <div className="text-amber-300 font-bold">
                      {categories.find(c => c.id === activeCategory)?.label || ''}
                    </div>
                  </div>
                </div>
                <div className="text-amber-400 text-sm font-bold">
                  {categories.find(c => c.id === activeCategory)?.count || 0} events
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile Filter Dropdown */}
          <AnimatePresence>
            {showMobileFilter && categories.length > 0 && (
              <motion.div
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-800 p-4 space-y-4">
                  {/* Categories Section */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Categories</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon || Star;
                        const isActive = activeCategory === category.id;

                        return (
                          <button
                            key={category.id}
                            onClick={() => {
                              setActiveCategory(category.id);
                              setShowMobileFilter(false);
                            }}
                            className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                              isActive
                                ? `bg-gradient-to-r ${category.gradient} text-white border-transparent`
                                : 'bg-black/40 text-gray-300 border-gray-700 hover:text-white'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium text-center">
                              {category.label}
                            </span>
                            <span className="text-xs opacity-70">({category.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm">Sort By</h4>
                    <div className="space-y-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setShowMobileFilter(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                              sortBy === option.id
                                ? 'bg-amber-900/20 text-amber-400 border-amber-500/30'
                                : 'bg-black/40 text-gray-300 border-gray-700 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{option.label}</span>
                            </div>
                            {sortBy === option.id && <Check className="w-4 h-4 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom scrollbar for dropdowns */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.5);
          border-radius: 4px;
        }
        
        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Glass effect */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
};

export default EventsSearchAndFilter;